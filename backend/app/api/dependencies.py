from fastapi import Depends , HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError , jwt
from sqlalchemy.orm import Session

from app.core.config import JWT_ALGORITHM, JWT_SECRET_KEY
from app.models.user import User
from app.database.database import get_db


oauth2_scheme = OAuth2PasswordBearer( # Tells FastAPI that protected requests use Bearer tokens
  tokenUrl="/api/auth/login" # FastAPI uses it to tell Swagger:"The endpoint for obtaining an access token is /api/auth/login."
)

def get_current_user(
  token:str= Depends(oauth2_scheme), # Extract the Bearer token from this request.
  db:Session = Depends(get_db)
)->User:

  credentials_exception = HTTPException(
    status_code=401,
    detail="Could not validate credentials",
    headers={
      "WWW-Authenticate":"Bearer"
    },
  )

  try:
    payload = jwt.decode(
      token,
      JWT_SECRET_KEY, # type: ignore
      algorithms=[JWT_ALGORITHM]
    )

    user_id = payload.get("sub")

    if user_id is None:
      raise credentials_exception

    user_id = int(user_id)

  except (JWTError,ValueError):
    raise credentials_exception

  user = db.get(User,user_id)
  if user is None:
    raise credentials_exception
  
  return user