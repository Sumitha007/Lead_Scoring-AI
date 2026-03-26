from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.auth import AuthUser, get_current_user
from app.db.session import get_db


def get_db_session(db: Session = Depends(get_db)) -> Session:
    return db


def get_authenticated_user(user: AuthUser = Depends(get_current_user)) -> AuthUser:
    return user
