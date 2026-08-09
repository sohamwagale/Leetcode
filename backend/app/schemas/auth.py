from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
  username: str = Field(min_length=3,max_length=20)
  email: EmailStr
  password: str = Field(min_length=8)

class RegisterResponse(BaseModel):
  message: str

class LoginResponse(BaseModel):
  access_token:str
  token_type:str

class LoginRequest(BaseModel):
  email:EmailStr
  password:str

class MeResponse(BaseModel):
  id:int
  username:str
  email:EmailStr