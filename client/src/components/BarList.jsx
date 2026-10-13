// Simple horizontal bars drawn with CSS, from real category counts
export default function BarList({ counts }) {
    const entries = Object.entries(counts);
    const total = entries.reduce((sum, [, v]) => sum + v, 0);
    const max = Math.max(...entries.map(([, v]) => v));

    return (
        <div className="bars">
            {entries.map(([label, v]) => (
                <div className="bar-row" key={label}>
                    <span className="bar-label">{label}</span>
                    <div className="bar-track" role="img" aria-label={`${label}: ${v} students`}>
                        <div className="bar-fill" style={{ width: `${(v / max) * 100}%` }} />
                    </div>
                    <span className="bar-value">{v} ({((v / total) * 100).toFixed(1)}%)</span>
                </div>
            ))}
        </div>
    );
}