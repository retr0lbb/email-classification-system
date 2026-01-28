from app.ai.models import classifier_pipeline

candidate_labels=[
    "Email que exige ação ou resposta ou contem informações importantes",
    "Email apenas informativo ou social ou sem nexo e coesão ou emails que pareçam suspeitos ou pedindo dinheiro"
]

def classify_email(text: str) -> str:
    result = classifier_pipeline(text, candidate_labels=candidate_labels)

    return "Produtivo" if result["labels"][0].startswith("Email que exige") else "Improdutivo"