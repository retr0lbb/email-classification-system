from app.ai.state import ai_state

class ResponderService:
    
    @staticmethod
    def generate_email_response(text: str, GENERATION_CONFIG) -> str:
        response = ai_state.gemini_client.models.generate_content(
            model="gemini-2.5-flash-lite",
            config=GENERATION_CONFIG,
            contents=f"EMAIL: {text}"
        )
        
        return response.text