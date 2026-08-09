from pwdlib import PasswordHash
from datetime import timedelta, datetime,timezone

from jose import jwt
from app.core.config import (
  JWT_ACCESS_TOKEN_EXPIRE_MINUTES,
  JWT_ALGORITHM,
  JWT_SECRET_KEY
)

password_hash = PasswordHash.recommended()


def hash_password(password: str)->str:
  # print(password)
  return password_hash.hash(password)

def verify_password(
  plain_password: str,
  hashed_password: str
) -> bool:
  return password_hash.verify(
    plain_password,
    hashed_password
  )

def create_access_token(user_id:int)->str:
  expire = datetime.now(timezone.utc) + timedelta( minutes= JWT_ACCESS_TOKEN_EXPIRE_MINUTES )

  payload = {
    "sub": str(user_id),
    "exp": expire
  }

  return jwt.encode(
    payload,
    JWT_SECRET_KEY, # type: ignore
    algorithm=JWT_ALGORITHM
  )