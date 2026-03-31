from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class DiaryEntry(Base):
    __tablename__ = "diary_entries"

    id = Column(Integer, primary_key=True, index=True)
    hive_id = Column(String, index=True)
    action_type = Column(String, nullable=False)
    note = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)