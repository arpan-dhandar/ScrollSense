import PageHeader from "../components/PageHeader.jsx";
import DataGate from "../components/DataGate.jsx";
import DetailsNotice from "../components/DetailsNotice.jsx";
import StatCard from "../components/StatCard.jsx";
import { useData } from "../data/dataContext.js";
import { fmt, pretty } from "../utils/format.js";

const ROW_COLUMNS = [
    "Student_ID",
    "Avg_Daily_Usage_Hours",
    "Sleep_Hours_Per_Night",
    "Mental_Health_Score",
    "Conflicts_Over_Social_Media",
    "Addicted_Score",
];

function Body() {
    const { details } = useData();
    const pre = details?.preprocessing;
    if (!pre) return <DetailsNotice />;

    const flagged = pre.outlier_summary.filter((o) => o.count > 0);

    return (
        <>
            <section>
                <h2>Quality checks</h2>
                <div className="grid">
                    <StatCard label="Rows before cleaning" value={fmt(pre.rows_original)} />
                    <StatCard label="Rows after cleaning" value={fmt(pre.rows_after_cleaning)} />
                    <StatCard label="Missing values" value={fmt(pre.missing_total)} />
                    <StatCard label="Duplicate rows" value={fmt(pre.duplicate_rows)} />
                    <StatCard label="Duplicate student IDs" value={fmt(pre.duplicate_ids)} />
                </div>
            </section>

            <section>
                <h2>Cleaning steps</h2>
                <ol className="list">
                    {pre.cleaning_steps.map((s) => (
                        <li key={s}>{s}</li>
                    ))}
                </ol>
            </section>

            <section>
                <h2>Outliers</h2>
                <p>{pre.outlier_method}.</p>
                <div className="table-wrap" tabIndex={0}>
                    <table>
                        <thead>
                        <tr>
                            <th>Variable</th>
                            <th>Lower fence</th>
                            <th>Upper fence</th>
                            <th>Flagged values</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pre.outlier_summary.map((o) => (
                            <tr key={o.column}>
                                <td>{pretty(o.column)}</td>
                                <td>{fmt(o.lower)}</td>
                                <td>{fmt(o.upper)}</td>
                                <td>{fmt(o.count)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {flagged.map((o) => (
                    <div key={o.column} className="block">
                        <h3>Flagged rows: {pretty(o.column)}</h3>
                        <div className="table-wrap" tabIndex={0}>
                            <table>
                                <thead>
                                <tr>
                                    {ROW_COLUMNS.filter((c) => c in o.rows[0]).map((c) => (
                                        <th key={c}>{pretty(c)}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {o.rows.map((row, i) => (
                                    <tr key={i}>
                                        {ROW_COLUMNS.filter((c) => c in row).map((c) => (
                                            <td key={c}>{fmt(row[c])}</td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                <h3>Decision</h3>
                <p className="notice ok">{pre.outlier_decision}</p>
            </section>
        </>
    );
}

export default function Preprocessing() {
    return (
        <>
            <PageHeader
                title="Preprocessing"
                subtitle="Checks for missing values, duplicates and outliers, and every cleaning decision."
                description="Data quality checks, cleaning steps and the outlier decision for the ScrollSense social media usage analysis."
            />
            <DataGate>
                <Body />
            </DataGate>
        </>
    );
}