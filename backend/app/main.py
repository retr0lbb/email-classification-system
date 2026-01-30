from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
import os

from app.services.processEmail import ProcessEmailService
from app.utils.documentParser import DocumentParser
from app.ai.loader import load_ai_models

load_dotenv()


app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    load_ai_models()

@app.get("/health")
def root():
    return {"Status": "ok"}


class EmailRequest(BaseModel):
    text: str

executor = ThreadPoolExecutor(max_workers=3)

@app.post("/classify/json")
async def classify_email_route(data: EmailRequest):
    result = await ProcessEmailService.classifyAndGenerate(data.text, executor)
    return result

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
        file.file.seek(0, 2)
        file_size_mb = file.file.tell() / (1024 * 1024)
        file.file.seek(0)

        if file_size_mb > 10:
            raise HTTPException(
                status_code=400,
                detail=f"Arquivo muito grande ({file_size_mb:.2f}MB). Limite: 10MB"
            )

        file_bytes = await file.read()
                
        result = DocumentParser.process_document(file_bytes, file.content_type)

        cleaned_text = result["cleaned_text"]
        if not cleaned_text or len(cleaned_text) < 20:
            raise HTTPException(
                status_code=422,
                detail="Não foi possível extrair texto relevante do arquivo"
            )
        
        result = await ProcessEmailService.classifyAndGenerate(cleaned_text, executor)

        return result

        
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Erro ao processar arquivo")
    