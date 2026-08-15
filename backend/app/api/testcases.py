from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.problem import Problem
from app.models.testcase import TestCase
from app.schemas.testcase import (
  TestCaseCreate,
  TestCaseResponse
)

router = APIRouter(
  prefix="/api/testcases",
  tags=["Test Cases"]
)

@router.post(
  "/",
  response_model=TestCaseResponse
)
def create_test_case(
  req:TestCaseCreate,
  db:Session = Depends(get_db),
):
  problem = db.get(Problem,req.problem_id)

  if not problem:
    raise HTTPException(
      status_code=404,
      detail="Problem not found",
    )

  testcase = TestCase(
    problem_id=req.problem_id,
    input=req.input,
    expected_output=req.expected_output,
    is_hidden=req.is_hidden,
  )

  db.add(testcase)
  db.commit()
  db.refresh(testcase)

  return testcase

@router.get(
  "/problem/{problem_id}",
  response_model=list[TestCaseResponse],
)
def get_problem_test_cases(
  problem_id:int,
  db:Session= Depends(get_db)
):
  return (
    db.query(TestCase)
    .filter(
      TestCase.problem_id == problem_id,
      TestCase.is_hidden == False,
    )
    .all()
  )

