from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_email_response(text: str, classification: str) -> str:
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        config=types.GenerateContentConfig(
            system_instruction="""
                Você é um atendente de uma empresa financeira.
                Seu papel é responder emails de forma:
                - profissional
                - educada
                - objetiva
                - clara

                Regras:
                - Se o email for PRODUTIVO, forneça uma resposta que informe próximos passos ou status.
                - Se o email for IMPRODUTIVO, responda de forma cordial, sem abrir novos chamados.
                - Nunca invente informações.
                - Não utilize emojis.
                - Use português formal.
            """
        ),
        contents=f"""
            CATEGORIA: {classification}

            EMAIL: {text}
        """
    )
    return response.text