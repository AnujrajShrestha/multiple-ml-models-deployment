from fastapi import FastAPI,HTTPException
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel,Field
from typing import Literal
import joblib

app= FastAPI()
model= joblib.load("./models/house_model.pkl")
columns= ['price',
 'area',
 'bedrooms',
 'bathrooms',
 'stories',
 'mainroad',
 'guestroom',
 'basement',
 'hotwaterheating',
 'airconditioning',
 'parking',
 'prefarea',
 'furnishingstatus']

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

class home_info(BaseModel):
    area: float= Field(...,ge=1000,description="Area of house in sq.ft")
    bedrooms: int= Field(...,ge=0,description="Number of bedrooms")
    bathrooms: int= Field(...,ge=0, description="Number of bathrooms")
    stories: int= Field(...,ge=0,description="Number of stories")
    mainroad: Literal['yes','no']
    guestroom: Literal['yes','no']
    basement: Literal['yes','no']
    hotwaterheating: Literal['yes','no']
    airconditioning: Literal['yes','no']
    parking: int= Field(...,ge=0,description="Number of paking sapces")
    prefarea: Literal['yes','no']
    furnishingstatus: Literal['furnished','semi-furnished','unfurnished']
    
class response(BaseModel):
    price: float
    

@app.get("/")
def home():
    return{"message": "House price prediction API"}

@app.post("/predict",response_model= response)
def predict(data: home_info):
    try:
        input_data= pd.DataFrame([{
            'area': data.area,
            'bedrooms': data.bedrooms,
            'bathrooms': data.bathrooms,
            'stories': data.stories,
            'mainroad': data.mainroad,
            'guestroom': data.guestroom,
            'basement': data.basement,
            'hotwaterheating': data.hotwaterheating,
            'airconditioning': data.airconditioning,
            'parking': data.parking,
            'prefarea': data.prefarea,
            'furnishingstatus': data.furnishingstatus
        }])
    except Exception as e:
        raise HTTPException(
            status_code= 400,
            detail= f"Invaild input data: {str(e)}"
        )
        
    try:
        prediction= model.predict(input_data)[0]
        return response(price= round(float(prediction),2))
    except Exception as e:
        raise HTTPException(
                    status_code= 500,
                    detail=f"Something went wrong in our site: {str(e)}"
                )