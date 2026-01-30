from app.ai.state import ai_state

class ClassifyService:
    @staticmethod
    def classifyText(text: str) -> str:

        candidate_labels = [
            "E-mail de finanças que requer ação, análise, ou contém informação crítica (transação, relatório, cliente, regulamentação)",
            "E-mail irrelevante, spam, marketing não financeiro, ou aviso interno sem impacto operacional"
        ]

        result = ai_state.classifier(text, candidate_labels=candidate_labels)
        return "Produtivo" if result["labels"][0].startswith("E-mail de finanças") else "Improdutivo"