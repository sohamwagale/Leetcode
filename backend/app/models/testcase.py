from sqlalchemy import ForeignKey,Text
from sqlalchemy.orm import Mapped,mapped_column

from app.database.database import Base

class TestCase(Base):
  __tablename__="test_cases"

  id: Mapped[int] = mapped_column(
    primary_key=True,
    index=True
  )

  problem_id:Mapped[int] = mapped_column(
    ForeignKey("problems.id"),
    nullable=False,
    index=True,
  )

  input: Mapped[str] = mapped_column(
    Text,
    nullable=False
  )

  expected_output: Mapped[str] = mapped_column(
    Text,
    nullable=False
  )

  is_hidden: Mapped[bool] = mapped_column(
    default=True,
    nullable=False
  )

