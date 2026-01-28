from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel

from app.utils.initGemini import GENERATION_CONFIG, client
from app.ai.classifier import classify_email
from app.ai.responder import generate_email_response
from app.utils.documentParser import DocumentParser

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
async def classify_email_file(file: UploadFile = File(...)):
    if file.content_type not in [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]:
        raise HTTPException(
            status_code=400,
            detail="formato de arquivo invalido"
        )
    

    try:
        file_bytes = await file.read()

        file_size_mb = len(file_bytes) / (1024 * 1024)

        if file_size_mb > 10:
            raise HTTPException(
                status_code = 400,
                detail=f"Arquivo muito grande ({file_size_mb:.2f}MB). Limite: 10MB"
            )
        
        result = DocumentParser.process_document(file_bytes, file.content_type)

        cleaned_text = result["cleaned_text"]
        classification = classify_email(cleaned_text)

        generatedText = generate_email_response(cleaned_text, classification, client, GENERATION_CONFIG)

        return {"label": classification, "suggested_response": generatedText}

        
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Erro ao processar arquivo")
    