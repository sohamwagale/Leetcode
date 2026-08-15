from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.database import get_db
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.user import User
from app.schemas.submissions import (
  SubmissionCreate,
  SubmissionResponse
)

router = APIRouter(
  prefix="/api/submissions",
  tags=["Submissions"]
)

@router.post("/",response_model=SubmissionResponse)
def submit(
  request:SubmissionCreate,
  db:Session= Depends(get_db),
  current_user:User=Depends(get_current_user),
):
  problems = db.get(Problem,request.problem_id)

  if not Problem:
    raise HTTPException(
      status_code=404,
      detail="Problem not found",
    )

  submission = Submission(
    user_id=current_user.id,
    problem_id=request.problem_id,
    language=request.language,
    code=request.code,
    status="Pending",
  )

  db.add(submission)
  db.commit()
  db.refresh(submission)

  return submission

@router.get("/mine",response_model=list[SubmissionResponse])
def get_my_submissions(
  db:Session=Depends(get_db),
  current_user:User=Depends(get_current_user)
):
  return (
    db.query(Submission)
    .filter(Submission.user_id == current_user.id)
    .order_by(Submission.created_at.desc())
    .all()
  )