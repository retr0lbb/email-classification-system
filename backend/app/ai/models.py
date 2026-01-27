from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM

print("Carregando modelos de IA...")

classifier_pipeline = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli",
)

print("Modelos carregados com sucesso!")
