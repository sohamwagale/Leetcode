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

res = run_python_code(
  code,
  "Soham\n"
)

print(res)