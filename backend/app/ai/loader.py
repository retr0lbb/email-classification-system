import os
from dotenv import load_dotenv
from transformers import pipeline
from google import genai

from app.ai.state import ai_state

load_dotenv()

def load_ai_models() -> None:
    if ai_state.classifier and ai_state.gemini_client:
        return  # já carregado

    print("Carregando modelos de IA...")

    ai_state.classifier = pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli",
    )

    ai_state.gemini_client = genai.Client(
        api_key=os.getenv("GEMINI_API_KEY")
    )

    print("Modelos de IA carregados com sucesso!")
