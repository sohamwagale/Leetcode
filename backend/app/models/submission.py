from datetime import datetime, timezone

from sqlalchemy import (
  DateTime,
  ForeignKey,
  String,
  Text,
)

from sqlalchemy.orm import Mapped, mapped_column
from app.database.database import Base

class Submission(Base):
  __tablename__="submissions"

  id: Mapped[int] = mapped_column(
    primary_key=True,
    index=True,
  )

  user_id: Mapped[int] = mapped_column(
    ForeignKey("users.id"),
    nullable=False,
    index=True,
  )

  problem_id: Mapped[int] = mapped_column(
    ForeignKey("problems.id"),
    nullable=False,
    index=True
  )

  language: Mapped[str] = mapped_column(
    String(30),
    nullable=False,
  )

  code: Mapped[str] = mapped_column(
    Text,
    nullable=False
  )

  status: Mapped[str] = mapped_column(
    String(30),
    nullable=False,
    default="Pending",
  )

  runtime: Mapped[float | None] = mapped_column(
    nullable=True
  )

  memory: Mapped[float | None] = mapped_column(
    nullable=True
  )

  created_at:Mapped[datetime] = mapped_column(
    DateTime,
    default=datetime.now(timezone.utc),
    nullable=False
  )
