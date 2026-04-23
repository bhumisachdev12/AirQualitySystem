/**
 * LoadingState — "Calculating Forecast" overlay shown during API call.
 * Matches the wireframe loading screen with city/duration summary,
 * progress bar, and pulsing "Predicting…" button.
 */

const LoadingState = ({
  message = 'Running ARIMA(1,1,1) model on CO(GT) data…',
  city = '',
}) => {
  return (
    <div className="card p-6 animate-fade-in space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Generating Prediction</h2>
        <p className="text-gray-500 text-sm mt-1">{message}</p>
      </div>

      {/* Selected params (greyed-out) */}
      {city && (
        <div className="card-surface p-3">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">Selected Location</p>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            </svg>
            <span className="text-gray-300 text-sm truncate">{city}</span>
          </div>
        </div>
      )}

      {/* Pulsing predict button */}
      <button
        disabled
        className="btn-primary w-full flex items-center justify-center gap-2 opacity-90 cursor-not-allowed"
      >
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Predicting…
      </button>

      {/* Info notice */}
      <div className="flex items-start gap-3 rounded-xl border border-aqi-moderate/30 bg-aqi-moderate/10 p-4">
        <svg className="w-5 h-5 text-aqi-moderate mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
        <div>
          <p className="text-aqi-moderate text-sm font-semibold">ARIMA Model Processing</p>
          <p className="text-yellow-300/70 text-xs mt-1 leading-relaxed">
            Analyzing last 24 hours of CO(GT) concentration data{city ? ` for ${city}` : ''} using time series forecasting.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoadingState
