"""
services/model_service.py — ARIMA forecasting model for CO(GT) prediction
"""
import warnings
import numpy as np
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import random
from datetime import datetime

warnings.filterwarnings("ignore")


class ModelService:
    """Service for ARIMA-based CO(GT) forecasting"""
    
    @staticmethod
    def run_arima_forecast(values: list[float], steps: int = 1, latest_co: float = None) -> list[float]:
        """
        Fit ARIMA(1,1,1) and return multi-step-ahead forecast
        
        Parameters:
            values: Historical CO readings
            steps: Number of future steps to predict
            latest_co: Optional live CO value to append as latest observation
        
        Returns:
            List of predicted CO values (mg/m³)
        """
        if len(values) < 2:
            raise ValueError("At least 2 data points required for ARIMA")
        
        # If live CO is provided, append it to the series
        if latest_co is not None:
            values = values + [latest_co]
        
        series = pd.Series(values, dtype=float)
        model = ARIMA(series, order=(1, 1, 1))
        fit = model.fit()
        forecast = fit.forecast(steps=steps)
        
        # Clip to physically plausible range for CO (0–20 mg/m³)
        predictions = [round(max(0.0, min(20.0, float(val))), 4) for val in forecast]
        
        return predictions
    
    @staticmethod
    def generate_mock_co_series(location: str, n: int = 24) -> list[float]:
        """
        Generate deterministic mock CO(GT) time series for a location
        
        Note: This is temporary until real sensor data is integrated.
        Uses seeded RNG based on location name for consistent baseline.
        
        Parameters:
            location: Location name
            n: Number of data points to generate
        
        Returns:
            List of CO values (mg/m³)
        """
        # Seed based on location + current hour (values drift over time)
        seed = abs(hash(location.lower().strip())) + int(datetime.utcnow().timestamp() // 3600)
        rng = random.Random(seed)
        
        # Pick base concentration for this location (0.5–8.5 mg/m³)
        base = rng.uniform(0.5, 8.5)
        
        series: list[float] = []
        value = base
        for _ in range(n):
            # Small AR(1)-like drift + noise
            noise = rng.gauss(0, 0.15)
            trend = rng.uniform(-0.05, 0.05)
            value = max(0.1, value + trend + noise)
            series.append(round(value, 4))
        
        return series
