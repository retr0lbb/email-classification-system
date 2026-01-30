from google import genai
from transformers import pipeline
from dotenv import load_dotenv
import os

load_dotenv()

print("Carregando modelos de IA...")

classifier_pipeline = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli",
)


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("Gemini client started with no problems")

print("Modelos carregados com sucesso!")
