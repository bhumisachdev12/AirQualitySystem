import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { TrendingUp, Activity, Clock, AlertTriangle, Wind } from 'lucide-react'
import { healthCheck, getHistory } from '../services/api'

const Dashboard = () => {
    const navigate = useNavigate()
    const [apiOnline, setApiOnline] = useState(null)
    const [history, setHistory] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [dataError, setDataError] = useState('')
    const [latestForecast, setLatestForecast] = useState(null)

    const fetchDashboard = useCallback(async () => {
        setLoadingData(true)
        setDataError('')

        // Health check
        healthCheck()
            .then(() => setApiOnline(true))
            .catch(() => setApiOnline(false))

        try {
            const rows = await getHistory({ limit: 10 })
            setHistory(rows)
            
            // If we have history, fetch latest forecast for comparison chart
            if (rows.length > 0) {
                const latestLocation = rows[0].location
                try {
                    const { postForecast } = await import('../services/api')
                    const forecastData = await postForecast(latestLocation)
                    setLatestForecast(forecastData)
                } catch (err) {
                    console.error('Failed to fetch latest forecast:', err)
                    // Continue without forecast data
                }
            }
        } catch (err) {
            setDataError(err.message || 'Could not load recent predictions.')
        } finally {
            setLoadingData(false)
        }
    }, [])

    useEffect(() => { fetchDashboard() }, [fetchDashboard])

    // Get latest prediction
    const latest = history[0] ?? null
    const currentAQI = latestForecast?.current_aqi ?? latest?.current_aqi ?? null
    const predictedAQI = latestForecast?.predicted_aqi ?? latest?.aqi ?? null
    const currentCO = latest?.prediction ?? null

    // Prepare comparison chart data (Current vs Predicted AQI)
    const comparisonData = latestForecast?.forecast && latestForecast.forecast.length > 0
        ? latestForecast.forecast.map((predictedAQI, index) => ({
            hour: index + 1,
            currentAQI: currentAQI,      // Flat line (same value for all hours, can be null)
            predictedAQI: predictedAQI    // Varying line (forecast values)
        }))
        : []

    // Get AQI status
    const getAQIStatus = (aqi) => {
        if (aqi <= 50) return { label: 'Good', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
        if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' }
        if (aqi <= 200) return { label: 'Poor', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
        return { label: 'Very Poor', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
    }

    const aqiStatus = predictedAQI ? getAQIStatus(predictedAQI) : null

    // Stats cards
    const stats = [
        { label: 'Current AQI', value: currentAQI || 'N/A', icon: Activity, color: 'text-blue-600' },
        { label: 'Predicted AQI', value: predictedAQI || '—', icon: TrendingUp, color: 'text-amber-600' },
        { label: 'CO Level', value: currentCO ? `${currentCO.toFixed(2)} mg/m³` : '—', icon: Wind, color: 'text-orange-600' },
        { label: 'Predictions', value: history.length, icon: Clock, color: 'text-green-600' },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Real-time air quality monitoring</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-amber-200 shadow-sm">
                    <div className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium text-gray-700">
                        {apiOnline === null ? 'Checking...' : apiOnline ? 'Online' : 'Offline'}
                    </span>
                </div>
            </div>

            {/* Error */}
            {dataError && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-red-700">{dataError}</p>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-6">
                        <div className="flex items-center justify-between mb-3">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            <span className="text-xs font-semibold text-gray-500 uppercase">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current AQI Card */}
                <div className="lg:col-span-2">
                    {loadingData ? (
                        <div className="card p-8 h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
                        </div>
                    ) : latest ? (
                        <div className="card p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800">Current Air Quality</h2>
                                <Clock className="w-5 h-5 text-gray-400" />
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 mb-2">Predicted Air Quality Index</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-6xl font-bold text-gray-800">{predictedAQI}</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${aqiStatus.bg} ${aqiStatus.color} border ${aqiStatus.border}`}>
                                            {aqiStatus.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {currentAQI ? `Current: ${currentAQI} · ` : ''}CO: {currentCO.toFixed(2)} mg/m³ · {latest.location}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/predict')}
                                className="btn-primary w-full"
                            >
                                New Prediction
                            </button>
                        </div>
                    ) : (
                        <div className="card p-8 text-center">
                            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No predictions yet</p>
                            <button onClick={() => navigate('/predict')} className="btn-primary">
                                Make First Prediction
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <div className="card p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => navigate('/predict')}
                                className="w-full text-left px-4 py-3 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
                            >
                                <p className="font-medium text-gray-800">New Prediction</p>
                                <p className="text-xs text-gray-600">Get AQI forecast</p>
                            </button>
                            <button
                                onClick={() => navigate('/history')}
                                className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
                            >
                                <p className="font-medium text-gray-800">View History</p>
                                <p className="text-xs text-gray-600">Past predictions</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current vs Predicted AQI Comparison Chart */}
            {comparisonData.length > 0 && (
                <div className="card p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Current vs Predicted AQI (Next 24 Hours)</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Compare current air quality with predicted trend for {latest?.location}
                        {!currentAQI && <span className="text-orange-600"> (Current AQI unavailable - showing predicted trend only)</span>}
                    </p>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={comparisonData}>
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
                                formatter={(value, name) => {
                                    const label = name === 'currentAQI' ? 'Current AQI' : 'Predicted AQI'
                                    return [value, label]
                                }}
                                labelFormatter={(hour) => `Hour ${hour}`}
                            />
                            <Legend 
                                wrapperStyle={{ paddingTop: '20px' }}
                                formatter={(value) => {
                                    return value === 'currentAQI' ? 'Current AQI (Live)' : 'Predicted AQI (Forecast)'
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="currentAQI" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                name="currentAQI"
                                connectNulls={false}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="predictedAQI" 
                                stroke="#f59e0b" 
                                strokeWidth={3}
                                dot={{ fill: '#f59e0b', r: 4 }}
                                name="predictedAQI"
                                connectNulls={true}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Recent Predictions Table */}
            {history.length > 0 && (
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Recent Predictions</h2>
                        <button
                            onClick={() => navigate('/history')}
                            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                        >
                            View All →
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-amber-100">
                                    <th className="text-left py-3 text-sm font-semibold text-gray-600">Location</th>
                                    <th className="text-center py-3 text-sm font-semibold text-gray-600">AQI</th>
                                    <th className="text-center py-3 text-sm font-semibold text-gray-600">CO</th>
                                    <th className="text-center py-3 text-sm font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.slice(0, 5).map((item) => {
                                    const status = getAQIStatus(item.aqi)
                                    return (
                                        <tr key={item.id} className="border-b border-amber-50 hover:bg-amber-50/50">
                                            <td className="py-3 text-gray-800">{item.location}</td>
                                            <td className="py-3 text-center font-bold text-gray-800">{item.aqi}</td>
                                            <td className="py-3 text-center text-gray-600">{item.prediction.toFixed(2)}</td>
                                            <td className="py-3 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
