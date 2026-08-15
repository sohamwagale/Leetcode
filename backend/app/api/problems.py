from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.problem import Problem
from app.schemas.problem import (
  ProblemCreate,
  ProblemResponse
)

router = APIRouter(
  prefix="/api/problems",
  tags=["Problems"],
)

@router.post("/",response_model=ProblemResponse)
def create_problem(
  request:ProblemCreate,
  db: Session = Depends(get_db)
):
  existing_problem=(
    db.query(Problem)
    .filter(Problem.slug == request.slug)
    .first()
  )

  if existing_problem:
    raise HTTPException(
      status_code=400,
      detail="Problem already exists"
    )

  problem = Problem(
    title=request.title,
    slug=request.slug,
    description=request.description,
    difficulty=request.difficulty,
    constraints=request.constraints,
    input_format=request.input_format,
    output_format=request.output_format,
  )

  db.add(problem)
  db.commit()
  db.refresh(problem)

  return problem

@router.get("/",response_model=list[ProblemResponse])
def get_all_problems(db:Session=Depends(get_db)):
  return (
    db.query(Problem)
    .order_by(Problem.id)
    .all()
  )

@router.get("/{slug}",response_model=ProblemResponse)
def get_problem(slug:str,db:Session=Depends(get_db)):
  problem = (
    db.query(Problem)
    .filter(Problem.slug == slug)
    .first()
  )

  if not problem:
    raise HTTPException(
      status_code=404,
      detail="Problem not found"
    )

  return problem