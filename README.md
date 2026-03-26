# SmartLead AI

SmartLead AI is a full-stack lead scoring platform that combines website activity and offline interactions (calls, emails, meetings) to calculate conversion probability, provide explainability, and recommend next actions.

## Stack

- Frontend: React + Tailwind + React Query
- Backend: FastAPI
- Database: MySQL
- Auth: JWT (Admin / Employee roles)
- ML: scikit-learn (RandomForest)
- Explainability: SHAP

## Project Structure

- `src/`: Frontend application
- `backend/app/`: FastAPI API, auth, models, ML service
- `backend/sample_data/`: Training CSV for scoring model
- `backend/schema.sql`: MySQL schema reference

## Prerequisites

- Node.js 18+
- Python 3.11+
- MySQL 8+

## 1) MySQL Setup

Create database:

```sql
CREATE DATABASE smartlead;
```

## 2) Backend Setup (FastAPI + JWT)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Update `.env` with your MySQL connection string:

```env
DATABASE_URL=mysql+pymysql://root:root@localhost:3306/smartlead
JWT_SECRET_KEY=change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

Run backend:

```powershell
uvicorn app.main:app --reload --port 8000
```

The backend seeds a default admin user at startup:

- Email: `admin@smartlead.local`
- Password: `admin12345`

## 3) Frontend Setup (React)

In another terminal:

```powershell
cd ..
npm install
npm run dev
```

App URL: `http://localhost:8080`

## 4) Authentication Flow

1. Open `/auth`
2. Login with seeded admin credentials (or register a new user)
3. JWT is stored in browser local storage and used for API requests

## 5) Core API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/leads`
- `GET /api/leads`
- `GET /api/leads/{lead_id}`
- `POST /api/leads/{lead_id}/interactions`
- `GET /api/leads/{lead_id}/interactions`
- `POST /api/leads/{lead_id}/score`
- `GET /api/leads/{lead_id}/recommendation`
- `GET /api/analytics/summary` (admin only)

## 6) Scoring Rules

- Score > 80: Call immediately
- Score 50-80: Send follow-up email
- Score < 50: Nurture later

## Notes

- SHAP explanations are included as top contributing factors per lead score.
- Score recalculation is triggered automatically when a new interaction is logged.
