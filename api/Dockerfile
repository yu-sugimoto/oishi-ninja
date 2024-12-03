FROM python:3.13-slim

RUN apt-get update && apt-get install -y \
    libpq-dev gcc curl && \
    apt-get clean

RUN pip install --no-cache-dir poetry

WORKDIR /api

COPY pyproject.toml poetry.lock /api/

ENV POETRY_VIRTUALENVS_CREATE=true
RUN poetry install

COPY . /api

CMD ["sh", "-c", "poetry run db-upgrade && poetry run start"]
