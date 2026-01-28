from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel

from app.utils.initGemini import GENERATION_CONFIG, client
from app.ai.classifier import classify_email
from app.ai.responder import generate_email_response

app = FastAPI()

@app.get("/health")
def root():
    return {"Status": "ok"}


class EmailRequest(BaseModel):
    text: str


@app.post("/classify/json")
async def classify_email_stream(data: EmailRequest):
    classification = classify_email(data.text)

    generatedText = generate_email_response(data.text, classification, client, GENERATION_CONFIG)

    return {"label": classification, "suggested_response": generatedText}



@app.post("/classify/file")
def classify_email_file(file: UploadFile = File(...)):
    if file.content_type not in [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]:
        raise HTTPException(
            status_code=400,
            detail="formato de arquivo invalido"
        )
    print(file)
    
    return {"filename": file}