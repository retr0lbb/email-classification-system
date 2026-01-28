from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()

# Inicializar cliente uma vez no módulo
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# System instruction como constante (não recria a cada chamada)
SYSTEM_INSTRUCTION = """Você é um atendente de uma empresa financeira.
Seu papel é responder emails de forma:
- profissional
- educada
- objetiva
- clara

Regras:
- Se o email for PRODUTIVO, forneça uma resposta que informe próximos passos ou status.
- Se o email for IMPRODUTIVO, responda de forma cordial, sem abrir novos chamados.
- Nunca invente informações.
- NÃO utilize placeholders, campos genéricos ou textos entre colchetes ou parênteses.
- NÃO use expressões como "[Nome da Empresa]", "[Seu nome]" ou similares.
- Não utilize emojis.
- Gere o texto como se fosse o e-mail final pronto para envio.
- Você DEVE usar a alcunha de "Equipe de Atendimento" para campos como departamento e nome.
- Use português formal."""

# Config reutilizável
GENERATION_CONFIG = types.GenerateContentConfig(
    system_instruction=SYSTEM_INSTRUCTION,
    temperature=0.7,  # Ajuste conforme necessário
    max_output_tokens=512,  # Limite para respostas mais rápidas
    top_p=0.95,
    top_k=40
)

print("Gemini client started with no problems")