import PageHeader from "../components/PageHeader.jsx";
import DataGate from "../components/DataGate.jsx";
import DetailsNotice from "../components/DetailsNotice.jsx";
import { useData } from "../data/dataContext.js";
import { fmt, pretty, strongestPair, corrSentence, CAUSATION_NOTE } from "../utils/format.js";

const MEASURES = [
    ["mean", "Mean"],
    ["median", "Median"],
    ["mode", "Mode"],
    ["std", "Std dev"],
    ["var", "Variance"],
    ["min", "Min"],
    ["max", "Max"],
    ["range", "Range"],
];

const GLOSSARY = [
    ["Mean", "The average: add all values and divide by how many there are."],
    ["Median", "The middle value when all values are sorted. It is less affected by extreme values."],
    ["Mode", "The value that appears most often."],
    ["Standard deviation", "How far values typically sit from the mean. Bigger means more spread."],
    ["Variance", "The standard deviation squared."],
    ["Range", "Maximum minus minimum."],
    ["Correlation (r)", "A number from -1 to +1 showing how two numerical variables move together. It does not show cause."],
];

function cellStyle(r) {
    const alpha = Math.min(Math.abs(r), 1) * 0.6;
    const color = r < 0 ? "248,113,113" : "56,189,248";
    return { background: `rgba(${color},${alpha})` };
}

function Body() {
    const { statistics, details } = useData();
    const corr = details?.correlations;
    const best = corr ? strongestPair(corr) : null;

    return (
        <>
            <section>
                <h2>Descriptive statistics</h2>
                <div className="table-wrap" tabIndex={0}>
                    <table>
                        <thead>
                        <tr>
                            <th>Variable</th>
                            {MEASURES.map(([, label]) => (
                                <th key={label}>{label}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(statistics).map(([name, s]) => (
                            <tr key={name}>
                                <td>{pretty(name)}</td>
                                {MEASURES.map(([key]) => (
                                    <td key={key}>{fmt(s[key])}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2>Correlation matrix</h2>
                {!corr ? (
                    <DetailsNotice />
                ) : (
                    <>
                        <div className="table-wrap" tabIndex={0}>
                            <table className="corr">
                                <thead>
                                <tr>
                                    <th></th>
                                    {Object.keys(corr).map((k) => (
                                        <th key={k}>{pretty(k)}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {Object.entries(corr).map(([row, cols]) => (
                                    <tr key={row}>
                                        <th scope="row">{pretty(row)}</th>
                                        {Object.keys(corr).map((col) => (
                                            <td key={col} style={cellStyle(cols[col])}>{fmt(cols[col])}</td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="muted small">
                            Blue cells are positive, red cells are negative; a stronger colour means a stronger relationship.
                            Only numerical measurements are included. Student_ID is left out because an ID is a label, not a measurement.
                        </p>
                        {best && (
                            <p className="notice ok">
                                Strongest pair in the matrix: {corrSentence(best.a, best.b, best.r)} {CAUSATION_NOTE}
                            </p>
                        )}
                    </>
                )}
            </section>

            <section>
                <h2>What the measures mean</h2>
                <dl className="defs card">
                    {GLOSSARY.map(([term, meaning]) => (
                        <div key={term} className="def-row">
                            <dt>{term}</dt>
                            <dd>{meaning}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </>
    );
}

export default function Statistics() {
    return (
        <>
            <PageHeader
                title="Statistical Analysis"
                subtitle="Mean, median, mode, spread and correlation for the numerical variables."
                description="Descriptive statistics and correlation matrix for the students' social media usage dataset."
            />
            <DataGate>
                <Body />
            </DataGate>
        </>
    );
}