"""
config.py — Application configuration settings
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    database_url: str = "postgresql://postgres:password@localhost/airquality_db"
    
    # API Server
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    
    # JWT Authentication
    secret_key: str = "your-secret-key-change-in-production-min-32-chars"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    # OpenWeather API
    openweather_api_key: str = ""  # Optional: for live current AQI

    class Config:
        env_file = ".env"


settings = Settings()
