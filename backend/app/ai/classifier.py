from app.ai.models import classifier_pipeline

candidate_labels = [
    "email corporativo que contém informações relevantes de trabalho",
    "email social, informal ou sem relevância profissional"
]

def classify_email(text: str) -> str:
    result = classifier_pipeline(text, candidate_labels=candidate_labels)

    return "Produtivo" if result["labels"][0].startswith("Email que exige") else "Improdutivo"