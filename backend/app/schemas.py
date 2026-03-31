from pydantic import BaseModel
from datetime import datetime

class DiaryEntryBase(BaseModel):
    hive_id: str
    action_type: str
    note: str

class DiaryEntryCreate(BaseModel):
    hive_id: str
    action_type: str
    note: str

class DiaryEntryResponse(DiaryEntryCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # pre ORM model