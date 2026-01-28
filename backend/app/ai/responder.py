from google import genai
from google.genai import types
from dotenv import load_dotenv
import os
from functools import lru_cache


def generate_email_response(text: str, classification: str, geminiClient, GENERATION_CONFIG) -> str:
    response = geminiClient.models.generate_content(
        model="gemini-2.5-flash-lite",  # Modelo mais recente e rápido
        config=GENERATION_CONFIG,
        contents=f"CATEGORIA: {classification}\n\nEMAIL: {text}"
    )
    
    return response.text


# Versão com cache (se houver emails repetidos)
@lru_cache(maxsize=128)
def generate_email_response_cached(text: str, classification: str) -> str:
    """Versão com cache para emails idênticos."""
    return generate_email_response(text, classification)