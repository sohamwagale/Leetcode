from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.auth import (
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  MeResponse
)

from app.api.dependencies import get_current_user
from app.models.user import User

from app.services.auth_service import (
  create_user,
  login_user
)

router = APIRouter(
  prefix="/api/auth",
  tags=["Authentication"]
)

@router.post("/register",response_model=RegisterResponse)
def register(
  req: RegisterRequest,
  db: Session = Depends(get_db)
):
  try:
    create_user(db,user_data=req)
    return RegisterResponse(
      message="User registered successfully"
    )
  except ValueError as e:
    raise HTTPException(
      status_code=400,
      detail=str(e)
    )


@router.post("/login",response_model=LoginResponse)
def login(
  req:LoginRequest,
  db:Session = Depends(get_db)
):
  try:
    access_token = login_user(
      db,
      req.email,
      req.password
    )

    return LoginResponse(
      access_token=access_token,
      token_type="bearer"
    )

  except ValueError as e:
    raise HTTPException(
      status_code=401,
      detail=str(e)
    )


@router.get("/me",response_model=MeResponse)
def me(
  current_user: User = Depends(get_current_user)
):
  return {
    "id":current_user.id,
    "username":current_user.username,
    "email":current_user.email,
  }