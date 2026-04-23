"""
models/__init__.py — Database models
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class User(Base):
    """User model for authentication"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    total_searches = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    predictions = relationship("Prediction", back_populates="user")


class Prediction(Base):
    """Prediction model for storing forecast history"""
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, index=True, nullable=False)
    input_values = Column(JSON, nullable=False)  # Historical CO values
    prediction = Column(Float, nullable=False)    # Predicted CO value
    aqi = Column(Integer, nullable=False)         # Predicted AQI
    alert = Column(String, nullable=False)        # Alert level
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationship
    user = relationship("User", back_populates="predictions")
