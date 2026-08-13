from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel,Field
from typing import Literal
import pandas as pd
import joblib

app= FastAPI()
model= joblib.load("./models/student_placement_model")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

COLUMNS= ['IQ',
 'Prev_Sem_Result',
 'CGPA',
 'Communication_Skills',
 'Projects_Completed',
 'Internship_Experience']

class student_info(BaseModel):
    IQ: int= Field(...,ge=20,le=150,description="Enter student's IQ between 20 to 150")
    Prev_Sem_Result: float= Field(...,ge=0,description="Enter sutdent's previous semester CGPA")
    CGPA: float= Field(...,ge=0,description="Enter syudent's CGPA")
    Communication_Skills: int= Field(...,ge=0,description="Enter student's communication skills")
    Projects_Completed: int= Field(...,ge=0,description="Enter student's completed projects")
    Internship_Experience: Literal['yes','no']
    
class response(BaseModel):
    placement: Literal['Yes','No']
    
@app.get("/")
def home():
    return {'message': 'Student placement prediction API'}

@app.post("/predict",response_model= response)
def predict(features: student_info):
    try:
        row= pd.DataFrame([features.model_dump()],columns=COLUMNS)
        
        prediction= model.predict(row)[0]
        return response(placement= prediction)
    except Exception as e:
        raise HTTPException(
            status_code= 500,
            detail= f"Something went wrong from our site {str(e)}"
        )