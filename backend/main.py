from fastapi import FastAPI
from dotenv import load_dotenv
import os
from app.database.database import Base, engine

# Import models so SQLAlchemy knows about them
from app.models.user import User


# ROuters
from app.api.auth import router as auth_router


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


@app.get("/")
def root():
  return {
    "message":"Backend is running"
  }

