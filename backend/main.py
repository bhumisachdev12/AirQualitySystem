"""
main.py — FastAPI application entry point for Air Quality Prediction System
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes import auth, forecast

# Auto-create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Air Quality Prediction API",
    description="24-hour AQI forecasting using ARIMA(1,1,1) with live current AQI integration",
    version="3.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(forecast.router)
app.include_router(auth.router)


@app.get("/", tags=["root"])
def root():
    """API root endpoint"""
    return {
        "message": "Air Quality Prediction API",
        "version": "3.0.0",
        "docs": "/docs",
        "endpoints": {
            "health": "GET  /health",
            "forecast": "POST /forecast",
            "history": "GET  /history",
            "signup": "POST /auth/signup",
            "login": "POST /auth/login",
            "me": "GET  /auth/me",
        },
    }
