import json
import subprocess
import tempfile
from pathlib import Path
import uuid

from app.models.problem import Problem
from app.models.testcase import TestCase

def run_python_code(
  code:str, #initally starter code
  funciton_name:str,
  input_data:str,
  expected_output:str,
  timeout:float=2.0,
):

  try:
    arguments = json.loads(input_data)
    expected = json.loads(expected_output)

  except json.JSONDecodeError:
    return {
      "status":"Judge Error",
      "message":"invalid testcase format"
    }

  code_with_driver = f"""

import json

{code}

arguments = {json.dumps(arguments)}

result = {funciton_name}(*arguments)

print(json.dumps(result))
"""
  
  
  with tempfile.TemporaryDirectory() as temp_dir:
    temp_path = Path(temp_dir)
    source_file = temp_path / "solution.py" #join file path and name

    source_file.write_text(
      code_with_driver,
      encoding="utf-8",
    )

    container_name = f"judge-{uuid.uuid4().hex}" #        # Unique name so we can kill/remove this specific container if it hangs

    # Give the container a hard internal timeout too (belt-and-suspenders):
    # coreutils' `timeout` is present in python:3.12-slim, so this kills the
    # python process inside the container even if our subprocess.run kill
    # doesn't reach the container itself.
    inner_timeout = f"{timeout}s"


    command = [
      "docker",
      "run",
      "--rm",
      "-i",

      #name
      "--name",
      container_name,

      #No net
      "--network",
      "none",

      #resource limits
      "--cpus",
      "0.5",

      "--memory",
      "128m",

      "--memory-swap",
      "128m",  # disable swap headroom; caps total RAM+swap at 128m

      "--pids-limit", #limits the processes created
      "64",

      #security restricitons
      "--cap-drop", # Drop linux capabilities
      "ALL",

      "--security-opt",
      "no-new-privileges",

      "--read-only", #makes file system readonly

      "--tmpfs", # give program a temp writable dir
      "/tmp:rw,noexec,nosuid,size=16m",

      #Only mount the submitted code
      "-v",
      f"{source_file}:/code/solution.py:ro",

      "leetcode-python-runner",

      "timeout",
      "--signal=KILL",
      inner_timeout,
      "python",
      "solution.py",
    ]

    try:
      result = subprocess.run(
        command,
        input=input_data,
        text=True,
        capture_output=True,
        timeout=timeout+1.0
      )

    except subprocess.TimeoutExpired:
      subprocess.run(
        ["docker","kill",container_name],
        capture_output=True
      )

      subprocess.run(
        ["docker","rm","-f",container_name],
        capture_output=True
      )

      return {
        "status":"time limit exceeed",
        "output":""
      }

    if result.returncode == 137:
      return {
        "status":"time limit exceeded",
        "output":"",
      }

    if result.returncode !=0:
      return {
        "status":"Runtime error",
        "output":result.stderr
      }

    actual_output = result.stdout.strip()

    try:
      actual = json.loads(actual_output)
    except json.JSONDecodeError:
      return {
        "status": "Wrong Answer",
        "output": actual_output,
      }

    if actual != expected:
      return {
        "status": "Wrong Answer",
        "output": actual_output,
      }

    return {
      "status":"Accepted",
      "output":actual_output
    }

def judge_submission(
  problem:Problem,
  test_cases:list[TestCase],
  code:str
):
  # test_case_statuses = dict() HERE
  
  for test_case in test_cases:
    result = run_python_code(
      code=code,
      funciton_name=problem.function_name,
      input_data=test_case.input,
      expected_output=test_case.expected_output
    )

    # HERE
    # test_case_statuses[test_case.id] = result["status"] 

    if result["status"] != "Accepted":
      return result
      # return { HERE
      #   **result,
      #   "test_case_statuses": test_case_statuses
      # }

  return {
    "status":"Accepted",
    "output":"",
    # HERE
    # "test_case_statuses":test_case_statuses
  }


