
from __future__ import annotations

from app.ml.model_service import xgb_lead_scoring_service

# Endpoint to score a lead using the XGBoost model
@router.post("/score-lead-xgb")
def score_lead_xgb(lead: dict):
    """Score a lead using the XGBoost model (expects 25-feature dict)."""
    result = xgb_lead_scoring_service.score_lead(lead)
    return result

from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_authenticated_user, get_db_session
from app.core.auth import AuthUser, create_access_token, hash_password, require_admin, verify_password
from app.db.models import Category, Interaction, InteractionType, Lead, Score, User, UserRole
from app.ml.model_service import lead_scoring_service
from app.schemas.auth import LoginRequest, MeResponse, RegisterRequest, TokenResponse
from app.schemas.interaction import InteractionCreate, InteractionOut
from app.schemas.lead import LeadCreate, LeadOut, LeadWithScoreOut
from app.schemas.score import RecommendationOut, ScoreExplanationItem, ScoreOut

router = APIRouter(prefix="/api", tags=["smartlead"])


def _get_user_or_401(db: Session, user: AuthUser) -> User:
    db_user = db.query(User).filter(User.id == user.id).one_or_none()
    if not db_user:
        raise HTTPException(status_code=401, detail="User does not exist")
    return db_user


def _build_feature_dict(lead: Lead) -> dict:
    interactions = lead.interactions

    calls = [i for i in interactions if i.interaction_type == InteractionType.call]
    emails = [i for i in interactions if i.interaction_type == InteractionType.email]
    meetings = [i for i in interactions if i.interaction_type == InteractionType.meeting]

    call_duration_total = sum(int(c.payload.get("call_duration_minutes", 0) or 0) for c in calls)
    email_opened = int(any(bool(e.payload.get("email_opened")) for e in emails))
    email_replied = int(any(bool(e.payload.get("email_replied")) for e in emails))
    meeting_completed = int(any(bool(m.payload.get("meeting_completed")) for m in meetings))

    return {
        "website_visits": int(lead.website_visits),
        "time_spent_minutes": int(lead.time_spent_minutes),
        "click_count": int(lead.click_count),
        "call_count": len(calls),
        "call_duration_total": int(call_duration_total),
        "email_opened": email_opened,
        "email_replied": email_replied,
        "meeting_completed": meeting_completed,
        "category": lead.category.value,
    }


def _score_to_response(lead: Lead, score_record: Score | None) -> LeadWithScoreOut:
    if not score_record:
        return LeadWithScoreOut.model_validate(lead, update={"score": 0.0, "recommendation": "Nurture later", "priority": "low"})

    priority = "high" if score_record.score_probability > 80 else "medium" if score_record.score_probability >= 50 else "low"
    return LeadWithScoreOut.model_validate(
        lead,
        update={
            "score": score_record.score_probability,
            "recommendation": score_record.recommendation,
            "priority": priority,
        },
    )


@router.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "SmartLead AI API"}


@router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db_session)):
    existing = db.query(User).filter(User.email == payload.email).one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=UserRole.admin if payload.role == "admin" else UserRole.employee,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role.value})
    return TokenResponse(access_token=token)


@router.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db_session)):
    user = db.query(User).filter(User.email == payload.email).one_or_none()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role.value})
    return TokenResponse(access_token=token)


@router.get("/auth/me", response_model=MeResponse)
def me(user: AuthUser = Depends(get_authenticated_user), db: Session = Depends(get_db_session)):
    db_user = _get_user_or_401(db, user)
    return MeResponse(id=db_user.id, email=db_user.email, role=db_user.role.value)


@router.post("/leads", response_model=LeadOut, status_code=status.HTTP_201_CREATED)
def add_lead(
    payload: LeadCreate,
    db: Session = Depends(get_db_session),
    user: AuthUser = Depends(get_authenticated_user),
):
    _ = _get_user_or_401(db, user)
    existing = db.query(Lead).filter(Lead.email == payload.email).one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Lead with this email already exists")

    lead = Lead(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        category=Category(payload.category),
        company=payload.company,
        budget=payload.budget,
        website_visits=payload.website_visits,
        time_spent_minutes=payload.time_spent_minutes,
        click_count=payload.click_count,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@router.get("/leads", response_model=list[LeadWithScoreOut])
def get_leads(
    priority: str | None = Query(default=None, pattern="^(high|medium|low)$"),
    db: Session = Depends(get_db_session),
    user: AuthUser = Depends(get_authenticated_user),
):
    _ = _get_user_or_401(db, user)
    leads = db.query(Lead).order_by(Lead.created_at.desc()).all()
    data = [_score_to_response(lead, lead.score) for lead in leads]
    if not priority:
        return data
    return [row for row in data if row.priority == priority]


@router.get("/leads/{lead_id}", response_model=LeadWithScoreOut)
def get_lead_details(
    lead_id: str,
    db: Session = Depends(get_db_session),
    user: AuthUser = Depends(get_authenticated_user),
):
    _ = _get_user_or_401(db, user)
    lead = db.query(Lead).filter(Lead.id == lead_id).one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return _score_to_response(lead, lead.score)


@router.post("/leads/{lead_id}/interactions", response_model=InteractionOut, status_code=status.HTTP_201_CREATED)
def add_interaction(
    lead_id: str,
    payload: InteractionCreate,
    db: Session = Depends(get_db_session),
    user: AuthUser = Depends(get_authenticated_user),
):
    db_user = _get_user_or_401(db, user)
    lead = db.query(Lead).filter(Lead.id == lead_id).one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    record = Interaction(
        lead_id=lead_id,
        interaction_type=InteractionType(payload.interaction_type),
        payload=payload.model_dump(exclude={"interaction_type"}, exclude_none=True),
        created_by_user_id=db_user.id,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    _ = generate_score(lead_id=lead_id, db=db, user=user)
    return record


@router.get("/leads/{lead_id}/interactions", response_model=list[InteractionOut])
def get_interactions(
    lead_id: str,
    db: Session = Depends(get_db_session),
    user: AuthUser = Depends(get_authenticated_user),
):
    _ = _get_user_or_401(db, user)
    interactions = db.query(Interaction).filter(Interaction.lead_id == lead_id).order_by(Interaction.created_at.desc()).all()
    return interactions


@router.post("/leads/{lead_id}/score", response_model=ScoreOut)
def generate_score(
    lead_id: str,
    db: Session = Depends(get_db_session),
    user: AuthUser = Depends(get_authenticated_user),
):
    _ = _get_user_or_401(db, user)
    lead = db.query(Lead).filter(Lead.id == lead_id).one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    features = _build_feature_dict(lead)
    prediction = lead_scoring_service.predict(features)

    score_row = db.query(Score).filter(Score.lead_id == lead_id).one_or_none()
    if not score_row:
        score_row = Score(lead_id=lead_id, score_probability=prediction.probability, recommendation=prediction.recommendation)
        db.add(score_row)

    score_row.score_probability = prediction.probability
    score_row.recommendation = prediction.recommendation
    score_row.explanation_json = {"top_factors": prediction.top_factors}
    score_row.model_version = lead_scoring_service.model_version
    score_row.summary = prediction.summary
    db.commit()

    return ScoreOut(
        lead_id=lead_id,
        score=prediction.probability,
        recommendation=prediction.recommendation,
        priority=prediction.priority,
        top_factors=[ScoreExplanationItem.model_validate(item) for item in prediction.top_factors],
        summary=prediction.summary,
    )


@router.get("/leads/{lead_id}/recommendation", response_model=RecommendationOut)
def get_recommendation(
    lead_id: str,
    db: Session = Depends(get_db_session),
    user: AuthUser = Depends(get_authenticated_user),
):
    _ = _get_user_or_401(db, user)
    lead = db.query(Lead).filter(Lead.id == lead_id).one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    score = lead.score.score_probability if lead.score else 0.0
    recommendation = lead.score.recommendation if lead.score else "Nurture later"
    priority = "high" if score > 80 else "medium" if score >= 50 else "low"

    return RecommendationOut(lead_id=lead_id, score=score, recommendation=recommendation, priority=priority)


@router.get("/analytics/summary")
def analytics_summary(
    db: Session = Depends(get_db_session),
    user: AuthUser = Depends(require_admin),
):
    _ = _get_user_or_401(db, user)
    total = db.query(func.count(Lead.id)).scalar() or 0
    scored = db.query(Score).all()

    high = len([s for s in scored if s.score_probability > 80])
    medium = len([s for s in scored if 50 <= s.score_probability <= 80])
    low = len([s for s in scored if s.score_probability < 50])
    avg_score = round(sum(s.score_probability for s in scored) / len(scored), 2) if scored else 0.0

    return {
        "total_leads": total,
        "high_priority": high,
        "medium_priority": medium,
        "low_priority": low,
        "average_score": avg_score,
    }


def bootstrap_model() -> None:
    csv_path = Path(__file__).resolve().parents[2] / "sample_data" / "leads_training.csv"
    lead_scoring_service.train(csv_path)
