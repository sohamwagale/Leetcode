from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.api.dependencies import get_current_user

from app.models.problem import Problem
from app.models.user import User

from app.schemas.run import RunRequest,RunResponse
from app.services.judge_service import execute_python_code

router = APIRouter(
  prefix="/api/run",
  tags=["Code Execution"],
)

@router.post("",response_model=RunResponse)
def run_code(
  req:RunRequest,
  db: Session= Depends(get_db),
  current_user:User= Depends(get_current_user),
):
  problem = db.get(Problem,req.problem_id)

  if not problem:
    raise HTTPException(
      status_code=404,
      detail="Problem not found",
    )

  if req.language != "python":
    raise HTTPException(
      status_code=400,
      detail="Only Python is supported right now",
    )

  result:dict[str,str] = execute_python_code(
    code=req.code,
    function_name=problem.function_name,
    input_data=req.input # used for custom input
  )

  return RunResponse(
    status=result["status"],
    output=result["output"]
  )

  