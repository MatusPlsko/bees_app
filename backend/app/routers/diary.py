from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import DiaryEntry
from app.schemas import DiaryEntryCreate, DiaryEntryResponse

router = APIRouter(prefix="/diary", tags=["diary"])

@router.post("/", response_model=DiaryEntryResponse)
def create_diary_entry(entry: DiaryEntryCreate, db: Session = Depends(get_db)):
    db_entry = DiaryEntry(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/{hive_id}", response_model=List[DiaryEntryResponse])
def get_diary_entries(hive_id: str, db: Session = Depends(get_db)):
    entries = (
        db.query(DiaryEntry)
        .filter(DiaryEntry.hive_id == hive_id)
        .order_by(DiaryEntry.created_at.desc())
        .all()
    )
    return entries

@router.delete("/{entry_id}", response_model=dict)
def delete_diary_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(DiaryEntry).filter(DiaryEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Deleted successfully"}