import { useState } from "react";
import { API_URL } from "../api/config.js";

export default function ChartCard({ file, title, variables, shows, interpretation, limits }) {
    const [failed, setFailed] = useState(false);

    return (
        <article className="card chart-card">
            <h2>{title}</h2>
            <p className="muted small">Variables: {variables}</p>
            {failed ? (
                <p className="notice warn" role="alert">
                    The image <code>{file}</code> could not be loaded. Check <code>data/exports/charts</code> and that the
                    server is running.
                </p>
            ) : (
                <img
                    className="chart-img"
                    src={`${API_URL}/charts/${file}`}
                    alt={title}
                    decoding="async"
                    onError={() => setFailed(true)}
                />
            )}
            <h3>What it shows</h3>
            <p>{shows}</p>
            <h3>Interpretation</h3>
            <p>{interpretation}</p>
            <h3>What it cannot show</h3>
            <p>{limits}</p>
        </article>
    );
}