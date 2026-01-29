from transformers import Pipeline
from google.genai import Client
from typing import Optional

class AIState:
    classifier: Optional[Pipeline] = None
    gemini_client: Optional[Client] = None

ai_state = AIState()
