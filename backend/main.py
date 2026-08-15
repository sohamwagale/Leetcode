from fastapi import FastAPI
from dotenv import load_dotenv
import os
from app.database.database import Base, engine

# Import models so SQLAlchemy knows about them
from app.models.user import User
from app.models.problem import Problem
from app.models.testcase import TestCase
from app.models.submission import Submission

# ROuters
from app.api.auth import router as auth_router
from app.api.problems import router as problems_router
from app.api.testcases import router as testcases_router
from app.api.submissions import router as submissions_router


from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI(title="BeatCode API")

load_dotenv()
app.add_middleware(
  CORSMiddleware,
  allow_origins=[
    f"{os.getenv("FRONTEND_URL")}",
    # "http://localhost:5173"
  ],
  allow_credentials=True,
  allow_headers=["*"],
  allow_methods=["*"],
)

app.include_router(auth_router)
app.include_router(problems_router)
app.include_router(submissions_router)
app.include_router(testcases_router)

@app.get("/")
def root():
  return {
    "message":"Backend is running"
  }

