import json
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

class ProblemExample(BaseModel):
  input: str
  output: str
  explanation: str | None = None

class ProblemCreate(BaseModel):
  title:str=Field(min_length=1,max_length=200)
  slug:str=Field(min_length=1,max_length=200)
  description:str=Field(min_length=1)
  difficulty:str
  function_name:str=Field(min_length=1,max_length=100)
  starter_code:str | None = None
  constraints:str | None = None
  input_format:str | None = None
  output_format:str | None = None
  examples: list[ProblemExample] | str | None = None

class ProblemResponse(BaseModel):
  id: int
  title: str
  slug: str
  description: str
  difficulty: str
  function_name: str
  starter_code: str | None
  constraints: str | None
  input_format: str | None
  output_format: str | None
  examples: list[ProblemExample] | None = None
  created_at: datetime

  @field_validator("examples", mode="before")
  def parse_examples(cls, v):
    if v is None:
      return None
    if isinstance(v, str):
      try:
        return json.loads(v)
      except Exception:
        return None
    return v

  model_config = {
      "from_attributes": True
  }

