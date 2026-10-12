import time
import requests
from deep_translator import GoogleTranslator, MyMemoryTranslator, LibreTranslator
from deep_translator.exceptions import TooManyRequests
from langdetect import detect
# FastAPI is a modern web framework for building APIs with Python 3.6+ based on standard Python type hints.
# UploadFile and File are used to handle file uploads in FastAPI, while Form is used to handle form data.
# HTTPException is used to raise HTTP errors in FastAPI endpoints.
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional # Optimals used to declare that input parameters can be None (optional).

from python_backend.config import settings
from python_backend.schemas.input_schema import TranslationRequest

# Initializes the FastAPI application instance and names it using the project name from the configuration settings.
app = FastAPI(title=settings.PROJECT_NAME)

# Enable CORS (Allows requests from frontend servers on different ports/domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to restrict origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Map ISO language codes to Sarvam AI supported codes (e.g., 'bn-IN', 'hi-IN')
ISO_TO_SARVAM = {
    'hi': 'hi-IN',
    'bn': 'bn-IN',
    'ta': 'ta-IN',
    'te': 'te-IN',
    'mr': 'mr-IN',
    'gu': 'gu-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN',
    'pa': 'pa-IN',
    'or': 'or-IN',
    'en': 'en-IN'
}

SARVAM_API_KEY = settings.SARVAM_API_KEY
print(f"[INFO] Using Sarvam API Key: {SARVAM_API_KEY}...")

@app.post("/api/translate")
def translate_text(payload: TranslationRequest):
    raw_text = payload.text.strip()
    
    if not raw_text:
        raise HTTPException(status_code=400, detail="No text provided")

    # Detect language using langdetect
    try:
        detected_lang = detect(raw_text)
        print(f"[INFO] Detected language code: {detected_lang}")

        # If input is already English, pass it directly
        if detected_lang == 'en':
            return {"translated_text": raw_text}

        source_language_code = ISO_TO_SARVAM.get(detected_lang, "hi-IN") # Default to Hindi if unknown

        # Call Sarvam AI Translation API (Official, Reliable, No IP Blocking)
        url = "https://api.sarvam.ai/translate"
        api_payload = {
            "input": raw_text,
            "source_language_code": source_language_code,
            "target_language_code": "en-IN",
            "mode": "formal",
            "model": "mayura:v1"
        }
        headers = {
            "Content-Type": "application/json",
            "api-subscription-key": SARVAM_API_KEY
        }

        response = requests.post(url, json=api_payload, headers=headers)
        
        if response.status_code == 200:
            res_data = response.json()
            translated = res_data.get("translated_text")
            if translated:
                print(f"[INFO] Sarvam Translator output: {translated}")
                return {"translated_text": translated}
        else:
            print(f"[WARNING] Sarvam API error: {response.text}")

    except Exception as e:
        print(f"[WARNING] Translation exception: {e}")

    # Fallback only if API call fails entirely, ensuring pipeline awareness
    raise HTTPException(
        status_code=502, 
        detail="Translation service error. Unable to translate non-English input for analysis pipeline."
    )
    