import { useState } from 'react'
import { MapPin, TrendingUp, AlertCircle, Wind } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { postForecast } from '../services/api'

const CITIES = [
  'Los Angeles', 'New York', 'Chicago', 'Houston', 'Phoenix',
  'New Delhi', 'Beijing', 'London', 'Tokyo', 'Sydney',
  'Mumbai', 'Paris', 'Berlin', 'Madrid', 'Rome',
]

const PredictAQI = () => {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')
    const [location, setLocation] = useState('')

    const handlePredict = async (e) => {
        e.preventDefault()
        if (!location) {
            setError('Please select a location')
            return
        }

        setLoading(true)
        setError('')
        setResult(null)

        try {
            const data = await postForecast(location)
            setResult(data)
        } catch (err) {
            setError(err.message || 'Prediction failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const getAQIColors = (aqi) => {
        if (aqi <= 50) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Good' }
        if (aqi <= 100) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'Moderate' }
        if (aqi <= 200) return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', label: 'Poor' }
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Very Poor' }
    }

    const colors = result ? getAQIColors(result.predicted_aqi) : null
    
    // Prepare graph data
    const graphData = result?.forecast ? result.forecast.map((aqi, index) => ({
        hour: index + 1,
        aqi: aqi
    })) : []

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Air Quality Prediction</h1>
                <p className="text-gray-600">Get real-time AQI forecast for your location</p>
            </div>

            {/* Form */}
            {!result && !loading && (
                <div className="card p-8">
                    <form onSubmit={handlePredict} className="space-y-6">
                        <div>
                            <label className="label">
                                <MapPin className="w-4 h-4 text-amber-600" />
                                Select Location
                            </label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="">Choose a city...</option>
                                {CITIES.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <button type="submit" className="btn-primary w-full">
                            <TrendingUp className="w-5 h-5 inline mr-2" />
                            Predict AQI
                        </button>
                    </form>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="card p-12 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Running ARIMA model...</p>
                    <p className="text-sm text-gray-500 mt-2">Analyzing CO(GT) data for {location}</p>
                </div>
            )}

            {/* Result */}
            {result && !loading && (
                <div className="space-y-6">
                    {/* Current AQI Card */}
                    {result.current_aqi !== null && result.current_aqi !== undefined ? (
                        <div className="card p-8 border-2 border-blue-200 bg-blue-50">
                            <div className="text-center mb-4">
                                <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Current AQI (Live)</p>
                                <div className="text-6xl font-bold text-gray-800 mb-4">{result.current_aqi}</div>
                                <span className="inline-block px-6 py-2 rounded-full text-lg font-semibold bg-blue-100 text-blue-700 border-2 border-blue-300">
                                    Live Data
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="card p-6 border-2 border-gray-200 bg-gray-50">
                            <p className="text-center text-gray-600">Current AQI unavailable</p>
                        </div>
                    )}

                    {/* Predicted AQI Card */}
                    <div className={`card p-8 border-2 ${colors.border} ${colors.bg}`}>
                        <div className="text-center mb-6">
                            <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Predicted AQI (ARIMA)</p>
                            <div className="text-7xl font-bold text-gray-800 mb-4">{result.predicted_aqi}</div>
                            <span className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${colors.bg} ${colors.text} border-2 ${colors.border}`}>
                                {colors.label}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="text-center p-4 bg-white rounded-xl">
                                <Wind className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">CO Level</p>
                                <p className="text-xl font-bold text-gray-800">{result.co.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">mg/m³</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl">
                                <AlertCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Alert Level</p>
                                <p className="text-lg font-bold text-gray-800">{result.alert}</p>
                            </div>
                        </div>
                    </div>

                    {/* 24-Hour Forecast Graph */}
                    {graphData.length > 0 && (
                        <div className="card p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">24-Hour AQI Forecast</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={graphData}>
                                    <defs>
                                        <linearGradient id="colorAQI" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#fde68a" opacity={0.3} />
                                    <XAxis 
                                        dataKey="hour" 
                                        stroke="#92400e"
                                        tick={{ fill: '#92400e', fontSize: 12 }}
                                        label={{ value: 'Hours Ahead', position: 'insideBottom', offset: -5, fill: '#92400e' }}
                                    />
                                    <YAxis 
                                        stroke="#92400e"
                                        tick={{ fill: '#92400e', fontSize: 12 }}
                                        label={{ value: 'AQI', angle: -90, position: 'insideLeft', fill: '#92400e' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'white', 
                                            border: '2px solid #fbbf24',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px rgba(251, 146, 60, 0.1)'
                                        }}
                                        labelStyle={{ color: '#92400e', fontWeight: 'bold' }}
                                        formatter={(value) => [`AQI: ${value}`, '']}
                                        labelFormatter={(hour) => `Hour ${hour}`}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="aqi" 
                                        stroke="#f59e0b" 
                                        strokeWidth={3}
                                        fill="url(#colorAQI)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => { setResult(null); setLocation(''); }}
                            className="btn-primary flex-1"
                        >
                            New Prediction
                        </button>
                        <button
                            onClick={() => window.location.href = '/history'}
                            className="btn-secondary flex-1"
                        >
                            View History
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PredictAQI
