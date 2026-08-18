from app.services.judge_service import run_python_code

code = """
name = input()
print("HEllo",name)
"""

code = """
while True:
    pass
"""

code = """
import urllib.request

urllib.request.urlopen("https://example.com")
"""

# Correct one
code = """
def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
"""

code = """
def twoSum(nums, target):
    return [0, 2]
"""

code = """
def twoSum(nums, target):
    return undefined_variable
"""

code = """
def twoSum(nums, target):
    while True:
        pass
"""

res = run_python_code(
  code,
  function_name="twoSum",
  input_data="[[2,7,11,15],9]",
  expected_output="[0,1]",
)

print(res)