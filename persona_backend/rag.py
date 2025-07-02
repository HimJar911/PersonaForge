from chromadb import Client
from openai import OpenAI
from dotenv import load_dotenv
import os
import uuid

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ✅ Initialize ChromaDB client
chroma_client = Client()

# ✅ Single collection (like a table for memory)
collection = chroma_client.get_or_create_collection(name="persona_memories")


def embed_text(text: str) -> list[float]:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding


def store_message(persona_name: str, message: str):
    embedding = embed_text(message)
    uid = str(uuid.uuid4())
    metadata = {"persona": persona_name}
    collection.add(
        documents=[message],
        ids=[uid],
        embeddings=[embedding],
        metadatas=[metadata]
    )


def search_memory(persona_name: str, query: str, top_k: int = 3) -> list[str]:
    query_embedding = embed_text(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={"persona": persona_name}
    )
    return results["documents"][0] if results["documents"] else []
