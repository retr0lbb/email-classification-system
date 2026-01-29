from app.ai.state import ai_state

class ClassifyService:
    @staticmethod
    def classifyText(text: str) -> str:

        candidate_labels = [
            "email produtivo que contribui de forma relevante para a empresa ou ações que precisam ser executadas",
            "email social, informal ou sem relevância profissional ou improdutivo"
        ]

        result = ai_state.classifier(text, candidate_labels=candidate_labels)
        return "Produtivo" if result["labels"][0].startswith("email produtivo que") else "Improdutivo"