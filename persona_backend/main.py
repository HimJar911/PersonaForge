from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
from app.routes import forge, chat
from dotenv import load_dotenv
from memory import router as memory_router
from routes import rag

load_dotenv()

app = FastAPI(
    title="PersonaForge Backend",
    version="1.0.0"
)
app.include_router(rag.router, prefix="/rag")

# Mount routes
app.include_router(forge.router, prefix="/forge")
app.include_router(chat.router, prefix="/chat")
app.include_router(memory_router, prefix="/memory")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "🚀 PersonaForge backend is running!"}
