"""
schemas/__init__.py — Pydantic request/response schemas
"""
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import List, Optional


# ─── Authentication Schemas ───────────────────────────────────────────────────

class UserSignup(BaseModel):
    """User signup request"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """User information response"""
    id: int
    email: str
    username: str
    total_searches: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Forecast Schemas ─────────────────────────────────────────────────────────

class ForecastRequest(BaseModel):
    """Forecast request"""
    location: str = Field(..., min_length=1, description="City or location name")


class ForecastResponse(BaseModel):
    """Forecast response with current and predicted AQI"""
    current_co: Optional[float] = None  # Live CO from OpenWeather (mg/m³)
    current_aqi: Optional[int] = None   # Live AQI from OpenWeather (optional)
    predicted_aqi: int                   # Average predicted AQI (24 hours)
    co: float                            # First predicted CO value (mg/m³)
    alert: str                           # NORMAL | MODERATE | HIGH | CRITICAL
    forecast: List[int]                  # 24-hour AQI forecast values
    timestamp: str                       # ISO-8601 timestamp

    class Config:
        from_attributes = True


# ─── History Schemas ──────────────────────────────────────────────────────────

class HistoryItem(BaseModel):
    """Historical prediction item"""
    id: int
    location: str
    input_values: List[float]  # Historical CO values
    prediction: float           # Predicted CO value (mg/m³)
    aqi: int                    # Predicted AQI
    alert: str                  # Alert level
    timestamp: str              # ISO-8601 timestamp

    class Config:
        from_attributes = True
