import os # Used to intract with operating system for file handling etc
import tempfile # Used to crreate or handling temporary files
# FastAPI is a modern web framework for building APIs with Python 3.6+ based on standard Python type hints.
# UploadFile and File are used to handle file uploads in FastAPI, while Form is used to handle form data.
# HTTPException is used to raise HTTP errors in FastAPI endpoints.
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from typing import Optional # Optimals used to declare that input parameters can be None (optional).

from app.config import settings
from app.schemas.input_schema import PipelineOutput
from app.services.audio_service import AudioAnalysisService
from app.services.stt_service import stt_service

# Initializes the FastAPI application instance and names it using the project name from the configuration settings.
app = FastAPI(title=settings.PROJECT_NAME)

@app.post("/process-input", response_model=PipelineOutput)
async def process_input(
    text: Optional[str] = Form(None),
    audio_file: Optional[UploadFile] = File(None)
):
    if not text and not audio_file:
        raise HTTPException(status_code=400, detail="Provide either an audio file or text input.")

    if audio_file:
        # Creates a secure, named temporary file on the disk ending in .wav. delete=False prevents Python from deleting the file automatically as soon as the with block closes, allowing external services to read it.
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            content = await audio_file.read() # Asynchronously reads the binary content of the uploaded audio file from memory/stream.
            tmp.write(content) # Writes that binary content directly into the newly created temporary file.
            tmp_path = tmp.name
            print(tmp_path)

        try:
            # Service calls
            acoustic_data = AudioAnalysisService.extract_stress_signals(tmp_path)
            stt_result = stt_service.transcribe(tmp_path)

            return PipelineOutput(
                input_type="audio",
                raw_text=stt_result["text"],
                language=stt_result["language"],
                acoustic_features=acoustic_data
            )
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    return PipelineOutput(
        input_type="text",
        raw_text=text,
        language="auto",
        acoustic_features=None
    )