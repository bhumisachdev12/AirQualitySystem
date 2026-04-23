import { Link } from 'react-router-dom'

const STATUS_STYLES = {
  Good: 'bg-aqi-good/15 text-aqi-good border border-aqi-good/30',
  Moderate: 'bg-aqi-moderate/15 text-aqi-moderate border border-aqi-moderate/30',
  High: 'bg-aqi-high/15 text-aqi-high border border-aqi-high/30',
  Unhealthy: 'bg-aqi-high/15 text-aqi-high border border-aqi-high/30',
  Critical: 'bg-aqi-critical/15 text-aqi-critical border border-aqi-critical/30',
  Hazardous: 'bg-aqi-critical/15 text-aqi-critical border border-aqi-critical/30',
}

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
)

const HistorySection = ({ data = [], showLink = true }) => {
  const getStatus = (aqi) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'High'
    return 'Critical'
  }

  const resolveStatus = (item) =>
    item.condition || item.status || getStatus(item.aqi ?? item.aqiValue ?? 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px]">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="table-header">Date</th>
            <th className="table-header">City</th>
            <th className="table-header">Pollutant</th>
            <th className="table-header text-center">AQI Value</th>
            <th className="table-header">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-12 text-center text-gray-500 text-sm">
                No prediction history yet. Run a prediction to see results here.
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const status = resolveStatus(item)
              return (
                <tr key={item.id ?? index} className="table-row">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon />
                      <span className="text-white text-sm">{item.date}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <LocationIcon />
                      <span className="text-white text-sm">{item.city}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      {item.pollutant ?? '—'}
                    </span>
                  </td>
                  <td className="py-3.5 text-center">
                    <span className="text-white font-bold text-base">{item.aqi ?? item.aqiValue ?? '—'}</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`badge px-3 py-1 rounded-md text-xs font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES.Moderate}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {showLink && data.length > 0 && (
        <div className="mt-4 text-center">
          <Link
            to="/history"
            className="text-sm text-gray-400 hover:text-primary transition-colors duration-150"
            id="link-view-full-history"
          >
            View Full History →
          </Link>
        </div>
      )}
    </div>
  )
}

export default HistorySection
