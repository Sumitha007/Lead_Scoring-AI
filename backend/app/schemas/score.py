from pydantic import BaseModel


class ScoreExplanationItem(BaseModel):
    feature: str
    impact: float


class ScoreOut(BaseModel):
    lead_id: str
    score: float
    recommendation: str
    priority: str
    top_factors: list[ScoreExplanationItem]
    summary: str


class RecommendationOut(BaseModel):
    lead_id: str
    score: float
    recommendation: str
    priority: str
