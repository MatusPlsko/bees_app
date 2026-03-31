# app/routers/logs.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import models, schemas
from app.database import get_db

router = APIRouter(
    prefix="/logs",
    tags=["logs"]
)

# POST: pridaj poznámku
@router.post("/", response_model=schemas.LogResponse)
def create_log(log: schemas.LogCreate, db: Session = Depends(get_db)):
    # overenie, či úľ existuje
    hive = db.query(models.Hive).filter(models.Hive.id == log.hive_id).first()
    if not hive:
        raise HTTPException(status_code=404, detail="Hive not found")
    db_log = models.Log(hive_id=log.hive_id, content=log.content)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

# GET: všetky poznámky pre daný úľ
@router.get("/{hive_id}", response_model=List[schemas.LogResponse])
def get_logs(hive_id: str, db: Session = Depends(get_db)):
    logs = db.query(models.Log).filter(models.Log.hive_id == hive_id).order_by(models.Log.created_at.desc()).all()
    return logs