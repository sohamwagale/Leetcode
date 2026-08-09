from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import RegisterRequest

from app.core.security import (
  create_access_token,
  hash_password,
  verify_password
)

def create_user(
  db: Session,
  user_data: RegisterRequest
):

  existing_username = (
    db.query(User)
    .filter(User.username == user_data.username)
    .first()
  )

  if existing_username:
    raise ValueError("Username already exists")

  existing_email = (
    db.query(User)
    .filter(User.email == user_data.email)
    .first()
  )

  if existing_email:
    raise ValueError("Email already exists")

  user = User(
    username=user_data.username,
    email=user_data.email,
    password_hash=hash_password(user_data.password)
  )

  db.add(user)
  db.commit()
  db.refresh(user)

  return user

def authenticate_user(
  db:Session,
  email:str,
  password:str
):
  user = (
    db.query(User)
      .filter(User.email == email)
      .first()
  )

  if not user:
    return None

  if not verify_password(
    password,
    user.password_hash
  ):
    return None

  return user

def login_user(
  db:Session,
  email:str,
  password:str
):
  user = authenticate_user(
    db,
    email,
    password
  )

  if not user:
    raise ValueError("Invalid email or password")

  return create_access_token(user.id)