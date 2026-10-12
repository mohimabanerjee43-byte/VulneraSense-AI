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

# Map 2-letter ISO codes (from langdetect) to MyMemory supported language names
ISO_TO_MYMEMORY = {
    'hi': 'hindi',
    'bn': 'bengali',
    'ta': 'tamil india',
    'te': 'telugu',
    'mr': 'marathi',
    'gu': 'gujarati',
    'kn': 'kannada',
    'ml': 'malayalam',
    'pa': 'punjabi',
    'ur': 'urdu',
    'or': 'odia',
    'ne': 'nepali',
    'as': 'assamese',
    'bho': 'bhojpuri',
    'mai': 'maithili',
    'en': 'english'
}
@app.post("/api/translate")
def translate_text(payload: TranslationRequest):
    raw_text = payload.text.strip()
    
    if not raw_text:
        raise HTTPException(status_code=400, detail="No text provided")

    # 1. Try Google Translator
    try:
        translated = GoogleTranslator(source='auto', target='en').translate(raw_text)
        if translated:
            return {"translated_text": translated}
    except TooManyRequests:
        print("[WARNING] Google Translator rate-limited. Switching to fallback...")
    except Exception as e:
        print(f"[WARNING] Google Translator error: {e}")

    # 2. Fallback: Try LibreTranslate
    try:
        # Using a public LibreTranslate mirror (no credit card or API key needed)
        translated = LibreTranslator(
            source='auto', 
            target='en', 
            base_url='https://libretranslate.de/' # You can also try other public mirrors
        ).translate(raw_text)
        print(f"[INFO] LibreTranslate output: {translated}")

        if translated:
            return {"translated_text": translated}
    except Exception as e:
        print(f"[WARNING] LibreTranslate error: {e}")
    
    # 3. Fallback: MyMemory Translator
    try:
        # Automatically detect the language code (e.g., 'hi', 'ta', 'te', 'bn')
        detected_lang = detect(raw_text)
        print(f"[INFO] Detected language code: {detected_lang}")

        # If input is already English, return directly
        if detected_lang == 'en':
            return {"translated_text": raw_text}


        # Look up full language name (e.g., 'bn' -> 'bengali', 'hi' -> 'hindi')
        mymemory_lang = ISO_TO_MYMEMORY.get(detected_lang, "hindi")  # Default to Hindi if not found
        # Map the detected language code to MyMemory supported language name
        translated = MyMemoryTranslator(source=mymemory_lang, target='english', email='adityasett2004@gmail.com').translate(raw_text)
        print(f"[INFO] MyMemory Translator output: {translated}")
        if translated:
            return {"translated_text": translated}
    except Exception as e:
        print(f"[WARNING] MyMemory Translator error: {e}")

    # 3. Graceful Degrade: Return original raw text so the pipeline keeps running
    return {
        "translated_text": raw_text,
        "warning": "Translation unavailable due to rate limits. Using original text."
    }