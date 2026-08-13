from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
import joblib

app= FastAPI()
model= joblib.load("./models/email_detection.pkl")
tfidf= joblib.load("./models/tfidf_vectorizer.pkl")

app.add_middleware(
    CORSMiddleware,
     allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

class user_input(BaseModel):
    seed_text: str
    
class response(BaseModel):
    model_response: Literal['ham','spam']
    

@app.get("/")
def home():
    return {"message": "Email spam detection API"}

@app.post("/predict",response_model= response)
def predict(data: user_input):
    try:
        vectorized_text= tfidf.transform([data.seed_text])
        prediction= model.predict(vectorized_text)[0]
        final_response= "ham" if prediction==1 else "spam"
        
        return response(model_response= final_response)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail= f"Somthing went wrong from our site: {str(e)}"
        )