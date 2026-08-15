from datetime import datetime
from pydantic import BaseModel, Field

class ProblemCreate(BaseModel):
  title:str=Field(min_length=1,max_length=200)
  slug:str=Field(min_length=1,max_length=200)
  description:str=Field(min_length=1)
  difficulty:str
  constraints:str | None = None
  input_format:str | None = None
  output_format:str | None = None

class ProblemResponse(BaseModel):
  id: int
  title: str
  slug: str
  description: str
  difficulty: str
  constraints: str | None
  input_format: str | None
  output_format: str | None
  created_at: datetime

  model_config = {
      "from_attributes": True
  }

