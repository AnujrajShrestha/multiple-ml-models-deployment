from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
import joblib
import pandas as pd

app = FastAPI()
model = joblib.load("./models/model.pkl")
tfidf = joblib.load("./models/tfidfvect.pkl")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

class response(BaseModel):
    model_response: Literal["REAL", "FAKE"] 

@app.get("/")
def home():
    return {"message": "Fake news detection API"}

@app.post("/predict", response_model=response)
def predict(data: str = Body(..., media_type="text/plain")):
    try:
        cleaned_text = " ".join(data.split())
        
        input_df = pd.DataFrame([{"text": cleaned_text}])
        
        vectorized_text = tfidf.transform(input_df)
        prediction = model.predict(vectorized_text)[0]
        final_response = "REAL" if prediction == 1 else "FAKE"
        
        return {"model_response": final_response}
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Something went wrong from our side: {str(e)}"
        )