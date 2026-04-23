/**
 * ResultCard — shows a single metric stat (UV Index, Humidity, Pressure, Wind Speed, etc.)
 * Matches the right-column stat cards in the wireframe Dashboard.
 */
const ResultCard = ({ title, value, unit, subtitle, icon, accentColor = 'text-primary' }) => {
  return (
    <div className="stat-card flex items-center gap-4 animate-fade-in">
      {/* Icon badge */}
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-dark-elevated flex items-center justify-center shrink-0">
          <span className={`text-xl ${accentColor}`}>{icon}</span>
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest truncate">
          {title}
        </p>
        <p className="text-white text-2xl font-bold leading-none mt-0.5">
          {value}
          {unit && (
            <span className="text-gray-500 text-sm font-normal ml-1">{unit}</span>
          )}
        </p>
        {subtitle && (
          <p className={`text-xs font-medium mt-0.5 ${accentColor}`}>{subtitle}</p>
        )}
      </div>
    </div>
  )
}

export default ResultCard
