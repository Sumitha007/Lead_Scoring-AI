from __future__ import annotations
import xgboost as xgb
import joblib

# XGBoost-based lead scoring service using 25 features
class XGBoostLeadScoringService:
    FEATURE_NAMES = [
        'Lead Origin', 'Lead Source', 'Do Not Email', 'Do Not Call', 'TotalVisits',
        'Total Time Spent on Website', 'Page Views Per Visit', 'Last Activity', 'Country',
        'Specialization', 'What is your current occupation', 'What matters most to you in choosing a course',
        'Search', 'Magazine', 'Newspaper Article', 'X Education Forums', 'Newspaper',
        'Digital Advertisement', 'Through Recommendations', 'Receive More Updates About Our Courses',
        'Update me on Supply Chain Content', 'Get updates on DM Content', 'I agree to pay the amount through cheque',
        'A free copy of Mastering The Interview', 'Last Notable Activity'
    ]

    def __init__(self, model_path, encoders_path, feature_names_path):
        self.model = xgb.XGBClassifier()
        self.model.load_model(model_path)
        self.encoders = joblib.load(encoders_path)
        self.feature_names = joblib.load(feature_names_path)

    def encode_value(self, col, value):
        if col in self.encoders:
            le = self.encoders[col]
            if str(value) in le.classes_:
                return int(le.transform([str(value)])[0])
            else:
                return 0
        return value

    def yn(self, val):
        return 1 if str(val).strip().lower() == "yes" else 0

    def score_lead(self, lead_dict):
        # Map input to exact column names
        raw = {
            "Lead Origin":       lead_dict.get("Lead_Origin", "API"),
            "Lead Source":       lead_dict.get("Lead_Source", "Google"),
            "Do Not Email":      self.yn(lead_dict.get("Do_Not_Email", "No")),
            "Do Not Call":       self.yn(lead_dict.get("Do_Not_Call", "No")),
            "TotalVisits":       lead_dict.get("TotalVisits", 0.0),
            "Total Time Spent on Website": lead_dict.get("Total_Time_Spent_on_Website", 0.0),
            "Page Views Per Visit":        lead_dict.get("Page_Views_Per_Visit", 0.0),
            "Last Activity":     lead_dict.get("Last_Activity", "Email Opened"),
            "Country":           lead_dict.get("Country", "India"),
            "Specialization":    lead_dict.get("Specialization", "Unknown"),
            "What is your current occupation":               lead_dict.get("Current_Occupation", "Unemployed"),
            "What matters most to you in choosing a course": lead_dict.get("What_matters_most", "Better Career Prospects"),
            "Search":                                   self.yn(lead_dict.get("Search", "No")),
            "Magazine":                                 self.yn(lead_dict.get("Magazine", "No")),
            "Newspaper Article":                        self.yn(lead_dict.get("Newspaper_Article", "No")),
            "X Education Forums":                       self.yn(lead_dict.get("X_Education_Forums", "No")),
            "Newspaper":                                self.yn(lead_dict.get("Newspaper", "No")),
            "Digital Advertisement":                    self.yn(lead_dict.get("Digital_Advertisement", "No")),
            "Through Recommendations":                  self.yn(lead_dict.get("Through_Recommendations", "No")),
            "Receive More Updates About Our Courses":   self.yn(lead_dict.get("Receive_More_Updates", "No")),
            "Update me on Supply Chain Content":        self.yn(lead_dict.get("Update_Supply_Chain", "No")),
            "Get updates on DM Content":                self.yn(lead_dict.get("Get_updates_DM", "No")),
            "I agree to pay the amount through cheque": self.yn(lead_dict.get("I_agree_cheque", "No")),
            "A free copy of Mastering The Interview":   self.yn(lead_dict.get("Free_copy_interview", "No")),
            "Last Notable Activity": lead_dict.get("Last_Notable_Activity", "Email Opened"),
        }
        # Build row in exact feature order with encoding
        row = {}
        for col in self.FEATURE_NAMES:
            val = raw.get(col, 0)
            if isinstance(val, str):
                row[col] = self.encode_value(col, val)
            else:
                row[col] = val
        import pandas as pd
        df = pd.DataFrame([row], columns=self.FEATURE_NAMES)
        prob  = self.model.predict_proba(df)[0][1]
        score = round(float(prob) * 100, 1)
        if score >= 80:
            tier   = "Hot"
            action = "Call immediately"
        elif score >= 50:
            tier   = "Warm"
            action = "Send personalized email"
        elif score >= 20:
            tier   = "Cold"
            action = "Add to drip campaign"
        else:
            tier   = "Drop"
            action = "Deprioritize"
        return {"score": score, "tier": tier, "action": action}


# Singleton instance for use in API
xgb_lead_scoring_service = XGBoostLeadScoringService(
    model_path="../../../../backend/my_model.json",
    encoders_path="../../../../backend/encoders.pkl",
    feature_names_path="../../../../backend/feature_names.pkl"
)
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import shap
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


@dataclass
class PredictionResult:
    probability: float
    recommendation: str
    priority: str
    top_factors: list[dict[str, float | str]]
    summary: str


def recommendation_for_score(score: float) -> tuple[str, str]:
    if score > 80:
        return "Call immediately", "high"
    if score >= 50:
        return "Send follow-up email", "medium"
    return "Nurture later", "low"


class LeadScoringService:
    def __init__(self) -> None:
        self.model_version = "rf-v1"
        self.feature_columns = [
            "website_visits",
            "time_spent_minutes",
            "click_count",
            "call_count",
            "call_duration_total",
            "email_opened",
            "email_replied",
            "meeting_completed",
            "category",
        ]
        numeric_features = self.feature_columns[:-1]
        category_features = ["category"]
        preprocessor = ColumnTransformer(
            transformers=[
                ("num", "passthrough", numeric_features),
                ("cat", OneHotEncoder(handle_unknown="ignore"), category_features),
            ]
        )
        self.pipeline = Pipeline(
            steps=[
                ("preprocessor", preprocessor),
                ("model", RandomForestClassifier(n_estimators=220, random_state=42)),
            ]
        )
        self._fitted = False

    def train(self, csv_path: Path) -> None:
        df = pd.read_csv(csv_path)
        X = df[self.feature_columns]
        y = df["converted"]
        self.pipeline.fit(X, y)
        self._fitted = True

    def _normalize_feature_name(self, feature: str) -> str:
        cleaned = feature.replace("num__", "").replace("cat__", "")
        cleaned = cleaned.replace("category_", "category=")
        return cleaned

    def _explain(self, row_df: pd.DataFrame) -> list[dict[str, float | str]]:
        preprocessor = self.pipeline.named_steps["preprocessor"]
        model = self.pipeline.named_steps["model"]

        X_transformed = preprocessor.transform(row_df)
        feature_names = preprocessor.get_feature_names_out().tolist()
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X_transformed)

        values = shap_values[1][0] if isinstance(shap_values, list) else shap_values[0]
        pairs = list(zip(feature_names, values, strict=False))
        pairs.sort(key=lambda item: abs(item[1]), reverse=True)

        top = []
        for name, impact in pairs[:4]:
            top.append({"feature": self._normalize_feature_name(name), "impact": float(impact)})
        return top

    def predict(self, features: dict[str, Any]) -> PredictionResult:
        if not self._fitted:
            raise RuntimeError("Scoring model is not trained")

        row_df = pd.DataFrame([features], columns=self.feature_columns)
        prob = float(self.pipeline.predict_proba(row_df)[0][1])
        score = round(prob * 100, 2)
        recommendation, priority = recommendation_for_score(score)

        try:
            top_factors = self._explain(row_df)
        except Exception:
            top_factors = [
                {"feature": "website_visits", "impact": float(features.get("website_visits", 0))},
                {"feature": "email_replied", "impact": float(features.get("email_replied", 0))},
            ]

        summary = "Top drivers: " + ", ".join(str(item["feature"]) for item in top_factors)
        return PredictionResult(
            probability=score,
            recommendation=recommendation,
            priority=priority,
            top_factors=top_factors,
            summary=summary,
        )


lead_scoring_service = LeadScoringService()
