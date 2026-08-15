FROM python:3.12-slim

WORKDIR /code

RUN useradd --create-home --uid 1000 judge

USER judge

CMD ["python" , "solution.py"]
