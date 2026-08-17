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
from app.models.testcase import TestCase
from app.services.judge_service import judge_submission

router = APIRouter(
  prefix="/api/submissions",
  tags=["Submissions"]
)

@router.post(
  "/",
  response_model=SubmissionResponse
) # To add feature of status of each visible testcase
def submit(
  request:SubmissionCreate,
  db:Session= Depends(get_db),
  current_user:User=Depends(get_current_user),
):
  problem = db.get(Problem,request.problem_id)

  if not problem:
    raise HTTPException(
      status_code=404,
      detail="Problem not found",
    )

  submission = Submission(
    user_id=current_user.id,
    problem_id=request.problem_id,
    language=request.language,
    code=request.code,
    status="Running",
  )

  db.add(submission)
  db.commit()
  db.refresh(submission)

  test_cases = (
    db.query(TestCase)
    .filter(TestCase.problem_id == request.problem_id)
    .all()
  )

  if not test_cases:
    submission.status = "Judge Error"
    db.commit()
    db.refresh(submission)
    return submission

  if request.language != "python":
    submission.status = "Unsupported Language"
    db.commit()
    db.refresh(submission)
    return submission

  result = judge_submission(
    problem=problem,
    test_cases=test_cases,
    code=request.code
  )

  submission.status = result["status"]

  ## temp var name
  # statuses = result["test_case_statuses"] HERE

  db.commit()
  db.refresh(submission)

  return submission
  # return { HERE
  #   "id": submission.id,
  #   "problem_id": submission.problem_id,
  #   "language": submission.language,
  #   "code": submission.code,
  #   "status": submission.status,
  #   "statuses": statuses,
  #   "runtime": submission.runtime,
  #   "memory": submission.memory,
  #   "created_at": submission.created_at,
  # }
  # return statuses

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