import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CITIES = [
  'Los Angeles',
  'New York',
  'Chicago',
  'Houston',
  'Phoenix',
  'New Delhi',
  'Beijing',
  'London',
  'Tokyo',
  'Sydney',
  'Mumbai',
  'Paris',
  'Berlin',
  'Madrid',
  'Rome',
]

const POLLUTANTS = [
  { value: 'PM2.5', label: 'PM2.5 — Fine Particulate Matter' },
  { value: 'PM10', label: 'PM10 — Coarse Particulate Matter' },
  { value: 'NO2', label: 'NO₂ — Nitrogen Dioxide' },
]

const HORIZONS = [
  { value: '3', label: '3 Day Outlook' },
  { value: '7', label: '7 Day Outlook' },
  { value: '14', label: '14 Day Outlook' },
]

const TODAY = new Date().toISOString().split('T')[0]

const LocationIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)

const InfoIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
)

const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  </svg>
)

const ChevronIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const TIPS = [
  {
    num: '01',
    text: '"ARIMA(1,1,1) model analyzes 24-hour historical CO(GT) concentration patterns."',
  },
  {
    num: '02',
    text: '"CO levels < 2 mg/m³ are considered normal, while ≥ 8 mg/m³ trigger critical alerts."',
  },
  {
    num: '03',
    text: '"Predictions are based on time series analysis of carbon monoxide sensor data."',
  },
]

const InputForm = ({ onSubmit, loading }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    city: '',
  })
  const [error, setError] = useState('')

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'city' && value) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.city) {
      setError('You must select a target city before we can predict CO(GT) levels. Please pick a location from the dropdown menu below.')
      return
    }
    setError('')
    onSubmit(formData)
  }

  return (
    <div className="animate-slide-up space-y-8">
      {/* ── Page heading ── */}
      <div className="text-center">
        <h1 className="page-title">CO(GT) Prediction</h1>
        <p className="text-gray-400 mt-2 text-sm">
          Select a location to generate an ARIMA-based CO concentration forecast.
        </p>
      </div>

      {/* ── Form card ── */}
      <div className="card p-6 space-y-5">
        <p className="section-header">Predict CO(GT) Concentration</p>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-aqi-critical/40 bg-aqi-critical/10 p-4 animate-fade-in">
            <svg className="w-5 h-5 text-aqi-critical mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <div>
              <p className="text-aqi-critical text-sm font-semibold">Action Required: City Selection Missing</p>
              <p className="text-red-300 text-xs mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" id="form-predict-aqi">
          {/* Target City */}
          <div>
            <label className="label" htmlFor="select-city">
              <LocationIcon />
              Target Location
            </label>
            <div className="relative">
              <select
                id="select-city"
                value={formData.city}
                onChange={(e) => update('city', e.target.value)}
                className="input-field appearance-none pr-10"
              >
                <option value="">Select a location for CO prediction…</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronIcon />
              </div>
            </div>
            <p className="text-gray-600 text-xs mt-1.5 flex items-center gap-1">
              <InfoIcon /> ARIMA(1,1,1) model uses last 24 hours of CO(GT) data
            </p>
          </div>

          {/* Info note */}
          <div className="flex items-center gap-2 bg-dark-surface border border-dark-border rounded-xl px-4 py-3">
            <InfoIcon />
            <p className="text-gray-500 text-xs">
              Predictions use ARIMA time series analysis on historical CO concentration data.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
            id="btn-generate-prediction"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Predicting…
              </>
            ) : (
              <>
                PREDICT CO(GT) LEVEL
                <ArrowIcon />
              </>
            )}
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full text-gray-500 hover:text-white text-sm py-1 transition-colors duration-150"
            id="btn-cancel-prediction"
          >
            Cancel and Return to Dashboard
          </button>
        </form>
      </div>

      {/* ── Tips row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TIPS.map((tip) => (
          <div key={tip.num} className="card-surface p-4">
            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mb-2">TIP {tip.num}</p>
            <p className="text-gray-400 text-xs leading-relaxed italic">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InputForm
