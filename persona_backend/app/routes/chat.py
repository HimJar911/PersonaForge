from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
router = APIRouter()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Temporary in-memory store: { persona_name: [ { role, content }, ... ] }
chat_memory = {}


class ChatRequest(BaseModel):
    persona_name: str
    persona_prompt: str
    user_message: str


@router.post("/")
def talk_to_persona(payload: ChatRequest):
    print("✅ HIT chat.py ROUTE")
    try:
        if payload.persona_name not in chat_memory:
            chat_memory[payload.persona_name] = [
                {"role": "system", "content": payload.persona_prompt}
            ]

        chat_memory[payload.persona_name].append(
            {"role": "user", "content": payload.user_message}
        )

        response = client.chat.completions.create(
            model="gpt-4", messages=chat_memory[payload.persona_name], temperature=0.75
        )

        assistant_reply = response.choices[0].message.content.strip()
        chat_memory[payload.persona_name].append({"role": "assistant", "content": assistant_reply})

        # ✅ Print the actual assistant response
        print("🧞 Assistant reply:", assistant_reply)

        return {
            "persona_name": payload.persona_name,
            "history": chat_memory[payload.persona_name][1:]  # Skip system
        }


    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
