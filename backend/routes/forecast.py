"""
routes/forecast.py — Forecast and history endpoints
"""
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models import Prediction
from schemas import ForecastRequest, ForecastResponse, HistoryItem
from services.aqi_service import AQIService
from services.model_service import ModelService
from services.alert_service import AlertService

router = APIRouter(tags=["forecast"])


@router.get("/health", summary="Health check")
def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Air Quality Prediction API is running",
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


@router.post("/forecast", response_model=ForecastResponse, summary="Generate 24-hour AQI forecast")
async def post_forecast(
    body: ForecastRequest,
    db: Session = Depends(get_db),
):
    """
    Generate 24-hour AQI forecast for a location
    
    Steps:
    1. Fetch live CO and current AQI from OpenWeather API (optional)
    2. Generate historical CO data (mock until real sensors integrated)
    3. Append live CO as latest observation to historical series (if available)
    4. Run ARIMA(1,1,1) to predict next 24 CO values
    5. Convert each predicted CO to AQI
    6. Add natural variation to forecast for realistic visualization
    7. Calibrate forecast using current AQI (if available)
    8. Calculate average predicted AQI from calibrated forecast
    9. Generate alert based on calibrated average predicted AQI
    10. Store and return result
    """
    if not body.location.strip():
        raise HTTPException(status_code=422, detail="Location must not be empty")
    
    # Step 1: Fetch current CO and AQI from OpenWeather (optional)
    current_co = None
    current_aqi = None
    try:
        pollution_data = await AQIService.get_current_pollution_for_location(body.location)
        if pollution_data:
            current_co = pollution_data["co"]
            current_aqi = pollution_data["aqi"]
    except Exception as e:
        print(f"Failed to fetch current pollution data: {e}")
        # Continue without current data
    
    # Step 2: Get historical CO data
    try:
        input_values = ModelService.generate_mock_co_series(body.location, n=24)
        
        # Step 3: Run ARIMA prediction with live CO as latest observation (if available)
        predicted_co_values = ModelService.run_arima_forecast(
            input_values, 
            steps=24,
            latest_co=current_co  # Use live CO as latest observation
        )
        
        # Step 4: Convert each CO to AQI
        forecast_aqi = [AlertService.co_to_aqi(co) for co in predicted_co_values]
        
        # Step 5: Add natural variation to forecast for realistic visualization
        # Create smooth waves using sine-based variation
        import math
        varied_forecast = []
        for i, aqi in enumerate(forecast_aqi):
            # Create smooth oscillation: ±3 AQI points with period of ~8 hours
            wave1 = 3 * math.sin(2 * math.pi * i / 8)
            # Add secondary wave for complexity: ±2 AQI points with period of ~6 hours
            wave2 = 2 * math.sin(2 * math.pi * i / 6 + 1)
            # Small random-like variation based on hour (deterministic)
            wave3 = (i % 3 - 1) * 1.5
            
            variation = wave1 + wave2 + wave3
            varied_aqi = round(aqi + variation)
            varied_forecast.append(max(0, varied_aqi))
        
        forecast_aqi = varied_forecast
        
        # Step 6: Calibrate forecast using current AQI (if available)
        if current_aqi is not None:
            # Calculate adjustment based on difference between current AQI and first predicted
            first_predicted = forecast_aqi[0]
            adjustment = current_aqi - first_predicted
            
            # Apply adjustment to all forecast values
            forecast_aqi = [max(0, value + adjustment) for value in forecast_aqi]
        
        # Step 7: Calculate average predicted AQI (from calibrated forecast)
        avg_predicted_aqi = round(sum(forecast_aqi) / len(forecast_aqi))
        
        # Step 8: Generate alert based on calibrated average predicted AQI
        alert = AlertService.classify_alert_by_aqi(avg_predicted_aqi)
        
        # Step 9: Store in database
        record = Prediction(
            location=body.location.strip(),
            input_values=input_values,
            prediction=predicted_co_values[0],  # First predicted CO value
            aqi=avg_predicted_aqi,
            alert=alert,
            timestamp=datetime.utcnow(),
            user_id=None  # Optional: add auth if needed
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Forecast failed: {exc}") from exc
    
    return ForecastResponse(
        current_co=current_co,
        current_aqi=current_aqi,
        predicted_aqi=avg_predicted_aqi,
        co=predicted_co_values[0],
        alert=alert,
        forecast=forecast_aqi,
        timestamp=record.timestamp.isoformat() + "Z",
    )


@router.get("/history", response_model=List[HistoryItem], summary="Get prediction history")
def get_history(
    limit: int = Query(100, ge=1, le=500, description="Maximum number of records"),
    db: Session = Depends(get_db),
):
    """
    Retrieve all past predictions ordered newest-first
    
    Used by History page and Dashboard
    """
    rows: List[Prediction] = (
        db.query(Prediction)
        .order_by(Prediction.timestamp.desc())
        .limit(limit)
        .all()
    )
    
    return [
        HistoryItem(
            id=row.id,
            location=row.location,
            input_values=row.input_values,
            prediction=row.prediction,
            aqi=row.aqi,
            alert=row.alert,
            timestamp=row.timestamp.isoformat() + "Z",
        )
        for row in rows
    ]
