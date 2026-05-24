export default function Header({ title, subtitle, left, right }) {
  return (
    <header className="header">
      <div className="header-left">
        {left}
        <div>
          <div className="header-title">{title}</div>
          {subtitle && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</div>
          )}
        </div>
      </div>
      <div className="header-right">{right}</div>
    </header>
  );
}
