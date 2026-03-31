from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import diary  # tvoje routy

app = FastAPI()

# --- CORS middleware ---
origins = [
    "http://localhost:5173",  # port tvojho Vite/React dev servera
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # povoli POST, GET, DELETE, OPTIONS ...
    allow_headers=["*"],  # povoli Content-Type atď.
)

# --- Routers ---
app.include_router(diary.router)