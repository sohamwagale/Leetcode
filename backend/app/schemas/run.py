from pydantic import BaseModel

class RunRequest(BaseModel):
  problem_id:int
  language:str
  code:str
  input:str

class RunResponse(BaseModel):
  status:str
  output:str
  