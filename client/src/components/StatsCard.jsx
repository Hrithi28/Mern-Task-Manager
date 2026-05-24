export default function StatsCard({ label, value, icon, color, bg, delay }) {
  return (
    <div className="stat-card fade-in" style={{ '--accent-color': color, animationDelay: `${delay}ms` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
        </div>
        <div className="stat-icon" style={{ background: bg, color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
