import PageHeader from "../components/PageHeader.jsx";
import DataGate from "../components/DataGate.jsx";
import DetailsNotice from "../components/DetailsNotice.jsx";
import StatCard from "../components/StatCard.jsx";
import { useData } from "../data/dataContext.js";
import { SOURCE } from "../config.js";
import { fmt } from "../utils/format.js";

function Body() {
    const { findings, details } = useData();
    const ds = details?.dataset;

    return (
        <>
            <section>
                <h2>Source</h2>
                <div className="card">
                    <dl className="defs">
                        <dt>Title</dt>
                        <dd>{SOURCE.title}</dd>
                        <dt>Uploader</dt>
                        <dd>{SOURCE.uploader}</dd>
                        <dt>Link</dt>
                        <dd>
                            <a href={SOURCE.url} target="_blank" rel="noopener noreferrer">{SOURCE.url}</a>
                        </dd>
                        <dt>License</dt>
                        <dd>{SOURCE.license}</dd>
                        <dt>Accessed</dt>
                        <dd>{SOURCE.accessed}</dd>
                    </dl>
                    <p className="notice warn">
                        The Kaggle page has no dataset description. How the data was collected and how the score columns are
                        defined are not documented.
                    </p>
                </div>
            </section>

            <section>
                <h2>Size</h2>
                <div className="grid">
                    <StatCard label="Records (students)" value={fmt(ds?.rows ?? findings.total_students)} />
                    {ds && <StatCard label="Columns" value={fmt(ds.columns_count)} />}
                </div>
            </section>

            <section>
                <h2>Variables</h2>
                {!ds ? (
                    <DetailsNotice />
                ) : (
                    <div className="table-wrap" tabIndex={0}>
                        <table>
                            <thead>
                            <tr>
                                <th>Column</th>
                                <th>Role</th>
                                <th>Stored as</th>
                                <th>Missing</th>
                                <th>Distinct values</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ds.columns.map((c) => (
                                <tr key={c.name}>
                                    <td><code>{c.name}</code></td>
                                    <td>{c.role}</td>
                                    <td>{c.type}</td>
                                    <td>{fmt(c.missing)}</td>
                                    <td>{fmt(c.unique)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
}

export default function Dataset() {
    return (
        <>
            <PageHeader
                title="Dataset"
                subtitle="Where the data comes from, how big it is and what each column holds."
                description="Source, license, size and variables of the students' social media usage dataset used by ScrollSense."
            />
            <DataGate>
                <Body />
            </DataGate>
        </>
    );
}