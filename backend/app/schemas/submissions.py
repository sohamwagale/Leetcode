from datetime import datetime
from pydantic import BaseModel

class SubmissionCreate(BaseModel):
  problem_id:int
  language:str
  code:str

class SubmissionResponse(BaseModel):
  id:int
  problem_id:int
  language:str
  code:str
  status:str
  runtime:float | None
  memory:float | None
  created_at: datetime

  model_config = {
    "from_attributes":True
  }

