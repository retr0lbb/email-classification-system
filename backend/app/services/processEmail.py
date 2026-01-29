import time
import asyncio
from app.services.classifyService import ClassifyService
from app.services.responserService import ResponderService
from app.ai.models import GENERATION_CONFIG

class ProcessEmailService:

    @staticmethod
    async def classifyAndGenerate(text: str, executor) -> dict:
        start = time.time()
        loop = asyncio.get_event_loop()

        classification_task = loop.run_in_executor(
            executor,
            ClassifyService.classifyText,
            text
        )

        response_task = loop.run_in_executor(
            executor,
            ResponderService.generate_email_response,
            text,
            GENERATION_CONFIG
        )

        classification, generated_text = await asyncio.gather(
            classification_task,
            response_task
        )

        total_time = time.time() - start

        return {
            "label": classification,
            "suggested_response": generated_text,
            "processing_time": f"{total_time:.2f}s"
        }
    
