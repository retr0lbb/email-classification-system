import pdfplumber
from io import BytesIO

from app.utils.cleanText import clean_text

class DocumentParser:

    @staticmethod
    def extract_from_pdf(file_bytes: bytes) -> str:
        text = ""

        try:
            with pdfplumber.open(BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(e)

            pass

        return text
    
    @classmethod
    def process_document(cls, file_bytes: bytes, content_type: str) -> dict:
        raw_text = ""
        if content_type == "application/pdf":
            raw_text = cls.extract_from_pdf(file_bytes)
        else:
            raise ValueError(f"Tipo de arquivo nao suportado: {content_type}")
        
        cleanedText = clean_text(raw_text or "")

        return {
            "cleaned_text": cleanedText,
        }


    
