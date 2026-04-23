"""
services/alert_service.py — AQI conversion and alert classification
"""


class AlertService:
    """Service for CO to AQI conversion and alert classification"""
    
    @staticmethod
    def co_to_aqi(co_value: float) -> int:
        """
        Convert CO concentration (mg/m³) to AQI using EPA breakpoints
        
        CO Breakpoints:
            0.0 - 2.0  → AQI   0 -  50  (Good)
            2.0 - 4.0  → AQI  51 - 100  (Moderate)
            4.0 - 8.0  → AQI 101 - 200  (Poor)
            8.0+       → AQI 201 - 300  (Very Poor)
        
        Parameters:
            co_value: CO concentration in mg/m³
        
        Returns:
            AQI value (0-300+)
        """
        breakpoints = [
            (0.0, 2.0, 0, 50),      # Good
            (2.0, 4.0, 51, 100),    # Moderate
            (4.0, 8.0, 101, 200),   # Poor
            (8.0, 20.0, 201, 300),  # Very Poor
        ]
        
        # Clamp CO value to valid range
        co_value = max(0.0, min(20.0, co_value))
        
        # Find appropriate breakpoint range
        for co_low, co_high, aqi_low, aqi_high in breakpoints:
            if co_low <= co_value <= co_high:
                # Linear interpolation
                aqi = ((aqi_high - aqi_low) / (co_high - co_low)) * (co_value - co_low) + aqi_low
                return round(aqi)
        
        # If above all breakpoints, cap at 300
        return 300
    
    @staticmethod
    def classify_alert_by_aqi(aqi: int) -> str:
        """
        Generate alert level based on predicted AQI value
        
        Alert Thresholds:
            AQI 0-50   → NORMAL
            AQI 51-100 → MODERATE
            AQI 101-200 → HIGH
            AQI 201+   → CRITICAL
        
        Parameters:
            aqi: AQI value
        
        Returns:
            Alert level string
        """
        if aqi <= 50:
            return "NORMAL"
        elif aqi <= 100:
            return "MODERATE"
        elif aqi <= 200:
            return "HIGH"
        else:
            return "CRITICAL"
    
    @staticmethod
    def get_aqi_category(aqi: int) -> str:
        """
        Get AQI category label
        
        Parameters:
            aqi: AQI value
        
        Returns:
            Category label
        """
        if aqi <= 50:
            return "Good"
        elif aqi <= 100:
            return "Moderate"
        elif aqi <= 200:
            return "Poor"
        else:
            return "Very Poor"
