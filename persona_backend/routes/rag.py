from fastapi import APIRouter
from pydantic import BaseModel
from rag import store_message, search_memory

router = APIRouter()

class RAGStoreRequest(BaseModel):
    persona_name: str
    message: str

@router.post("/store")
def rag_store(req: RAGStoreRequest):
    store_message(req.persona_name, req.message)
    return {"status": "stored"}

class RAGSearchRequest(BaseModel):
    persona_name: str
    query: str

@router.post("/search")
def rag_search(req: RAGSearchRequest):
    results = search_memory(req.persona_name, req.query)
    return {"results": results}
