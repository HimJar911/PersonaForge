from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os
import json

load_dotenv()
router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ForgeRequest(BaseModel):
    name: str
    role: str
    traits: str

@router.post("/")
def forge_persona(payload: ForgeRequest):
    try:
        prompt = f"""
You are an AI system that forges fictional AI personas based on user input.

Create a detailed persona with:
- Name: {payload.name}
- Role: {payload.role}
- Traits: {payload.traits}

Return a structured JSON like:
{{
  "name": "...",
  "role": "...",
  "traits": "...",  ← could be string or array
  "style": "...",
  "goals": "...",
  "summary": "..."
}}
        """

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        # ✅ This goes **after** response is defined
        persona_raw = response.choices[0].message.content.strip()
        persona_obj = json.loads(persona_raw)

        # ✅ Normalize traits
        traits = persona_obj.get("traits", [])
        if isinstance(traits, str):
            persona_obj["traits"] = [trait.strip() for trait in traits.split(",")]

        return {"persona": persona_obj}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
