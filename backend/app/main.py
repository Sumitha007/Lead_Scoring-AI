from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import bootstrap_model, router
from app.core.auth import hash_password
from app.core.config import settings
from app.db.base import Base
from app.db.models import User, UserRole
from app.db.session import SessionLocal
from app.db.session import engine

app = FastAPI(title="SmartLead AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.parsed_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


# Root endpoint for health check or welcome message
@app.get("/")
def read_root():
    return {"message": "Welcome to SmartLead AI API. Backend is running."}


@app.on_event("startup")
def startup_event() -> None:
    Base.metadata.create_all(bind=engine)
    bootstrap_model()

    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@smartlead.local").one_or_none()
        if not admin:
            db.add(
                User(
                    email="admin@smartlead.local",
                    password_hash=hash_password("admin12345"),
                    role=UserRole.admin,
                )
            )
            db.commit()
    finally:
        db.close()
