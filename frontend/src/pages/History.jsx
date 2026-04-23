import { useState, useEffect, useCallback } from 'react'
import { Search, RefreshCw, MapPin, Calendar } from 'lucide-react'
import { getHistory } from '../services/api'

const History = () => {
    const [allData, setAllData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    const fetchHistory = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const rows = await getHistory({ limit: 100 })
            setAllData(rows)
        } catch (err) {
            setError(err.message || 'Failed to load prediction history.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchHistory() }, [fetchHistory])

    const filtered = allData.filter((r) => {
        const q = search.toLowerCase()
        return !search ||
            r.location.toLowerCase().includes(q) ||
            String(r.aqi).includes(q)
    })

    const getAQIStatus = (aqi) => {
        if (aqi <= 50) return { label: 'Good', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' }
        if (aqi <= 100) return { label: 'Moderate', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' }
        if (aqi <= 200) return { label: 'Poor', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' }
        return { label: 'Very Poor', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Prediction History</h1>
                    <p className="text-gray-600 mt-1">All past AQI predictions</p>
                </div>
                <button
                    onClick={fetchHistory}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-50 border-2 border-amber-200 rounded-xl font-medium text-gray-700 transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by location or AQI..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="card p-4 bg-red-50 border-2 border-red-200">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Table */}
            <div className="card p-6">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mx-auto"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No predictions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-amber-100">
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase">Date</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600 uppercase">Location</th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600 uppercase">AQI</th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600 uppercase">CO</th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => {
                                    const status = getAQIStatus(item.aqi)
                                    return (
                                        <tr key={item.id} className="border-b border-amber-50 hover:bg-amber-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {new Date(item.timestamp).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2 text-gray-800 font-medium">
                                                    <MapPin className="w-4 h-4 text-amber-600" />
                                                    {item.location}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="text-2xl font-bold text-gray-800">{item.aqi}</span>
                                            </td>
                                            <td className="py-4 px-4 text-center text-gray-600">
                                                {item.prediction.toFixed(2)} mg/m³
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${status.bg} ${status.text} border ${status.border}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && filtered.length > 0 && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Showing {filtered.length} of {allData.length} predictions
                    </div>
                )}
            </div>
        </div>
    )
}

export default History
