from datetime import datetime,timezone

from sqlalchemy import String , Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base

class Problem(Base):
  __tablename__="problems"

  id: Mapped[int] = mapped_column(
    primary_key=True,
    index=True
  )

  title:Mapped[str]=mapped_column(
    String(200),
    nullable=False
  )

  slug:Mapped[str]=mapped_column(
    String(200),
    unique=True,
    index=True,
    nullable=False
  )

  description:Mapped[str]=mapped_column(
    Text,
    nullable=False
  )

  difficulty:Mapped[str]=mapped_column(
    String(20),
    nullable=False
  )

  function_name:Mapped[str]=mapped_column(
    String(100),
    nullable=False
  )

  starter_code:Mapped[str]=mapped_column(
    Text,
    nullable=True
  )

  constraints:Mapped[str|None]=mapped_column(
    Text,
    nullable=True
  )

  input_format:Mapped[str|None]=mapped_column(
    Text,
    nullable=True
  )

  output_format:Mapped[str|None]=mapped_column(
    Text,
    nullable=True
  )

  created_at:Mapped[datetime]=mapped_column(
    DateTime,
    default=datetime.now(timezone.utc),
    nullable=False
  )

  updated_at:Mapped[datetime]=mapped_column(
    DateTime,
    default=datetime.now(timezone.utc),
    onupdate=datetime.now(timezone.utc),
    nullable=False,
  )

