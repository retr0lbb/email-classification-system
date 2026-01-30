from app.ai.state import ai_state
import os
from dotenv import load_dotenv

load_dotenv()

class ResponderService:
    
    @staticmethod
    def generate_email_response(text: str, GENERATION_CONFIG) -> str:
        response = ai_state.gemini_client.models.generate_content(
            model=os.getenv("GEMINI_MODEL"),
            config=GENERATION_CONFIG,
            contents=f"EMAIL: {text}"
        )
        
        return response.text