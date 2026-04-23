"""
services/aqi_service.py — OpenWeather API integration for live current AQI
"""
import httpx
from typing import Optional, Tuple
from config import settings


class AQIService:
    """Service for fetching live AQI data from OpenWeather API"""
    
    BASE_URL = "http://api.openweathermap.org"
    GEOCODING_URL = f"{BASE_URL}/geo/1.0/direct"
    AIR_POLLUTION_URL = f"{BASE_URL}/data/2.5/air_pollution"
    
    @staticmethod
    async def get_coordinates(location: str) -> Optional[Tuple[float, float]]:
        """
        Convert location name to latitude/longitude
        
        Parameters:
            location: City name (e.g., "London")
        
        Returns:
            (latitude, longitude) or None if not found
        """
        if not settings.openweather_api_key:
            return None
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    AQIService.GEOCODING_URL,
                    params={
                        "q": location,
                        "limit": 1,
                        "appid": settings.openweather_api_key
                    }
                )
                
                if response.status_code != 200:
                    return None
                
                data = response.json()
                if not data or len(data) == 0:
                    return None
                
                lat = data[0].get("lat")
                lon = data[0].get("lon")
                
                if lat is None or lon is None:
                    return None
                
                return (float(lat), float(lon))
                
        except Exception:
            return None
    
    @staticmethod
    async def get_current_air_pollution(lat: float, lon: float) -> Optional[dict]:
        """
        Fetch current air pollution data including CO and AQI
        
        Parameters:
            lat: Latitude
            lon: Longitude
        
        Returns:
            Dictionary with CO (μg/m³) and AQI, or None if fetch fails
        """
        if not settings.openweather_api_key:
            return None
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    AQIService.AIR_POLLUTION_URL,
                    params={
                        "lat": lat,
                        "lon": lon,
                        "appid": settings.openweather_api_key
                    }
                )
                
                if response.status_code != 200:
                    return None
                
                data = response.json()
                pollution_data = data.get("list", [{}])[0]
                
                # Get AQI index
                aqi_index = pollution_data.get("main", {}).get("aqi")
                
                # Get CO concentration (μg/m³)
                co_ugm3 = pollution_data.get("components", {}).get("co")
                
                if aqi_index is None or co_ugm3 is None:
                    return None
                
                # Convert OpenWeather 1-5 scale to standard 0-500 AQI scale
                aqi_mapping = {
                    1: 25,   # Good (0-50)
                    2: 75,   # Fair (51-100)
                    3: 125,  # Moderate (101-150)
                    4: 175,  # Poor (151-200)
                    5: 250   # Very Poor (201-300)
                }
                
                aqi = aqi_mapping.get(aqi_index, 100)
                
                # Convert CO from μg/m³ to mg/m³ (divide by 1000)
                co_mgm3 = co_ugm3 / 1000.0
                
                return {
                    "co": round(co_mgm3, 4),  # CO in mg/m³
                    "aqi": aqi
                }
                
        except Exception:
            return None
    
    @staticmethod
    async def get_current_aqi(lat: float, lon: float) -> Optional[int]:
        """
        Fetch current AQI from OpenWeather Air Pollution API
        
        Parameters:
            lat: Latitude
            lon: Longitude
        
        Returns:
            AQI value (converted to 0-500 scale) or None if fetch fails
        """
        pollution_data = await AQIService.get_current_air_pollution(lat, lon)
        return pollution_data["aqi"] if pollution_data else None
    
    @staticmethod
    async def get_current_aqi_for_location(location: str) -> Optional[int]:
        """
        Get current AQI for a location (combines geocoding + air pollution)
        
        Parameters:
            location: City name
        
        Returns:
            Current AQI value or None if unavailable
        """
        coords = await AQIService.get_coordinates(location)
        if not coords:
            return None
        
        lat, lon = coords
        aqi = await AQIService.get_current_aqi(lat, lon)
        return aqi

    @staticmethod
    async def get_current_pollution_for_location(location: str) -> Optional[dict]:
        """
        Get current CO and AQI for a location
        
        Parameters:
            location: City name
        
        Returns:
            Dictionary with CO (mg/m³) and AQI, or None if unavailable
        """
        coords = await AQIService.get_coordinates(location)
        if not coords:
            return None
        
        lat, lon = coords
        pollution_data = await AQIService.get_current_air_pollution(lat, lon)
        return pollution_data
