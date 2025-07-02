from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict
import json
from pathlib import Path

router = APIRouter()

# TEMP in-memory memory store
persona_facts: Dict[str, List[str]] = {}


class MemoryRequest(BaseModel):
    persona_name: str
    fact: str


@router.post("/store")
def store_fact(req: MemoryRequest):
    facts = persona_facts.setdefault(req.persona_name, [])
    if req.fact not in facts:
        facts.append(req.fact)
    return {"status": "stored", "facts": facts}


@router.get("/all")
def get_all_personas():
    return persona_facts

@router.get("/{persona_name}")
def get_facts(persona_name: str):
    return {"facts": persona_facts.get(persona_name, [])}

