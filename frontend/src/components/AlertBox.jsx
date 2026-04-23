/**
 * AlertBox — color-coded alert banner following the wireframe design.
 *
 * severity prop → one of: 'Good' | 'Moderate' | 'High' | 'Critical'
 *              or legacy aliases: 'Normal', 'Unhealthy', 'Hazardous'
 */

const SEVERITY_MAP = {
  // Canonical
  Good: { bar: 'bg-aqi-good', ring: 'border-aqi-good/40', text: 'text-aqi-good', bg: 'bg-aqi-good/10', icon: '✓', label: 'Good — Air quality is satisfactory.' },
  Moderate: { bar: 'bg-aqi-moderate', ring: 'border-aqi-moderate/40', text: 'text-aqi-moderate', bg: 'bg-aqi-moderate/10', icon: '⚠', label: 'Moderate — Acceptable; some pollutants may be a concern.' },
  High: { bar: 'bg-aqi-high', ring: 'border-aqi-high/40', text: 'text-aqi-high', bg: 'bg-aqi-high/10', icon: '!', label: 'High — Unhealthy for sensitive groups.' },
  Critical: { bar: 'bg-aqi-critical', ring: 'border-aqi-critical/40', text: 'text-aqi-critical', bg: 'bg-aqi-critical/10', icon: '✕', label: 'Critical — Health warnings. Everyone may be affected.' },
  // Backend alert levels
  NORMAL: { bar: 'bg-aqi-good', ring: 'border-aqi-good/40', text: 'text-aqi-good', bg: 'bg-aqi-good/10', icon: '✓', label: 'Normal — CO levels within safe limits.' },
  MODERATE: { bar: 'bg-aqi-moderate', ring: 'border-aqi-moderate/40', text: 'text-aqi-moderate', bg: 'bg-aqi-moderate/10', icon: '⚠', label: 'Moderate — CO levels acceptable.' },
  HIGH: { bar: 'bg-aqi-high', ring: 'border-aqi-high/40', text: 'text-aqi-high', bg: 'bg-aqi-high/10', icon: '!', label: 'High — Elevated CO levels detected.' },
  CRITICAL: { bar: 'bg-aqi-critical', ring: 'border-aqi-critical/40', text: 'text-aqi-critical', bg: 'bg-aqi-critical/10', icon: '✕', label: 'Critical — Very high CO levels.' },
  // Aliases
  Normal: null,
  Unhealthy: null,
  Hazardous: null,
}

const ALIASES = {
  Normal: 'Good',
  Unhealthy: 'High',
  Hazardous: 'Critical',
}

const AlertBox = ({ severity = 'Moderate', message, icon: customIcon, className = '' }) => {
  const resolved = ALIASES[severity] ?? severity
  const style = SEVERITY_MAP[resolved] ?? SEVERITY_MAP.Moderate
  const displayMsg = message || style.label

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 animate-fade-in ${style.bg} ${style.ring} ${className}`}
      role="alert"
    >
      {/* Colored left bar */}
      <div className={`w-1 self-stretch rounded-full shrink-0 ${style.bar}`} />

      {/* Icon */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${style.bg} ${style.text}`}>
        {customIcon || style.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${style.text}`}>{resolved}</p>
        <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{displayMsg}</p>
      </div>
    </div>
  )
}

export default AlertBox
