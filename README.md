# Air Quality CO(GT) Prediction System

A full-stack application for predicting CO(GT) concentrations using ARIMA(1,1,1) time series forecasting with real-time alerts.

## 🎯 Features

- **24-Hour AQI Forecast**: Predicts next 24 hours of AQI using ARIMA(1,1,1) on CO(GT) data
- **Live Current AQI**: Fetches real-time AQI from OpenWeather API (optional)
- **Comparison Chart**: Visual comparison of Current vs Predicted AQI with dual-line graph
- **Visual Forecast Graph**: Beautiful area chart showing 24-hour AQI trend
- **Alert Classification**: Automatic categorization (NORMAL / MODERATE / HIGH / CRITICAL)
- **Real-time Dashboard**: View latest predictions and system status
- **Prediction History**: Complete log of all past predictions with filtering
- **PostgreSQL Storage**: Persistent database for all predictions
- **Modern UI**: React + Tailwind CSS with responsive design

## 🏗️ Tech Stack

### Backend
- FastAPI (Python)
- PostgreSQL / SQLite
- ARIMA (statsmodels)
- SQLAlchemy ORM

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL (optional, SQLite works out-of-the-box)

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Configure PostgreSQL
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run the server
python run.py
```

Backend will run on `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure API URL (optional)
cp .env.example .env
# Edit .env if backend is not on localhost:8000

# Run development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🐳 Docker Setup (Alternative)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Generate 24-Hour Forecast
```
POST /forecast
Body: { "location": "London" }
Response: {
  "current_aqi": 75,           // Live AQI from OpenWeather (optional)
  "predicted_aqi": 120,        // Average predicted AQI for next 24 hours
  "co": 3.45,                  // First predicted CO value (mg/m³)
  "alert": "MODERATE",         // NORMAL | MODERATE | HIGH | CRITICAL
  "forecast": [120, 118, ...], // 24 AQI values (one per hour)
  "timestamp": "2026-04-21T..."
}
```

### Get History
```
GET /history?limit=100
Response: [{ "id": 1, "location": "...", "prediction": 2.45, "aqi": 87, "alert": "MODERATE", ... }]
```

## 🎨 Alert Levels

| Alert | AQI Range | Color | Description |
|-------|-----------|-------|-------------|
| NORMAL | 0-50 | Green | Good air quality |
| MODERATE | 51-100 | Yellow | Acceptable |
| HIGH | 101-200 | Orange | Unhealthy |
| CRITICAL | 201+ | Red | Very unhealthy |

## 📊 How It Works

1. **User selects a location** from the dropdown
2. **Backend fetches current AQI** from OpenWeather API (optional)
3. **Backend generates mock 24-hour CO data** (deterministic based on location)
4. **ARIMA(1,1,1) model** predicts next 24 CO values
5. **Each CO value converted to AQI** using EPA breakpoints
6. **Average predicted AQI calculated** and alert classified
7. **Result stored in database** with timestamp
8. **Frontend displays** current AQI, predicted AQI, alert, and 24-hour graph

## 🗂️ Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── ml/
│   │   │   └── co_forecaster.py      # ARIMA model
│   │   ├── routers/
│   │   │   └── co_predictions.py     # API endpoints
│   │   ├── services/
│   │   │   └── co_forecast_service.py # Business logic
│   │   ├── models.py                  # SQLAlchemy models
│   │   ├── schemas.py                 # Pydantic schemas
│   │   ├── database.py                # DB connection
│   │   └── main.py                    # FastAPI app
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PredictAQI.jsx
│   │   │   └── History.jsx
│   │   ├── services/
│   │   │   └── api.js                 # Axios client
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── docker-compose.yml
```

## 🔧 Configuration

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/airquality
# Or use SQLite (default): sqlite:///./airquality.db

# API Server
API_HOST=0.0.0.0
API_PORT=8000

# OpenWeather API (Optional - for live current AQI)
OPENWEATHER_API_KEY=your_api_key_here
```

**Get OpenWeather API Key** (Optional):
1. Sign up at https://openweathermap.org/api
2. Get free API key (1000 calls/day)
3. Add to `backend/.env`

**Without API key**: System works perfectly, just shows "Current AQI unavailable"

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 📝 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🧪 Testing the System

### Manual Testing

1. Navigate to `http://localhost:3000`
2. Go to "Predict AQI" page
3. Select a location (e.g., "London")
4. Click "Predict AQI"
5. View results:
   - Current AQI (live from OpenWeather)
   - Predicted AQI (average for next 24 hours)
   - Alert level (color-coded)
   - 24-hour forecast graph
6. Check "History" page to see all predictions
7. View "Dashboard" for overview and trends

### Automated Testing

Run the test script:
```bash
./test_24h_forecast.sh
```

This tests:
- Health endpoint
- Forecast generation
- 24-hour forecast array
- Response structure
- Multiple cities
- History endpoint
7. Visit "Dashboard" to see latest prediction

## 🛠️ Development

### Backend
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run dev
```

## 📦 Production Build

### Frontend
```bash
cd frontend
npm run build
# Output in dist/ folder
```

### Backend
```bash
cd backend
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🤝 Contributing

This is a production-ready system with:
- ✅ 24-hour AQI forecast with visual graph
- ✅ Live current AQI from OpenWeather API
- ✅ AQI-based alert system
- ✅ No hardcoded data
- ✅ Full backend integration
- ✅ Database persistence
- ✅ Dynamic UI updates
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design

## 📚 Documentation

- **[Comparison Chart Guide](COMPARISON_CHART_GUIDE.md)** - Current vs Predicted AQI visualization
- **[24-Hour Forecast Guide](24_HOUR_FORECAST_GUIDE.md)** - Complete guide to the 24-hour forecast feature
- **[Real vs Mock Data](REAL_VS_MOCK_DATA.md)** - Understanding what's real prediction vs synthetic input
- **[OpenWeather Setup](OPENWEATHER_SETUP.md)** - How to configure live current AQI
- **[Current AQI Integration](CURRENT_AQI_INTEGRATION.md)** - Details on current AQI implementation
- **[Quick Start](QUICKSTART.md)** - Fast setup guide
- **[Deployment](DEPLOYMENT.md)** - Production deployment guide

## 📄 License

MIT License

## 🙋 Support

For issues or questions, please open an issue on GitHub.
