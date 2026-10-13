import PageHeader from "../components/PageHeader.jsx";
import DataGate from "../components/DataGate.jsx";
import DetailsNotice from "../components/DetailsNotice.jsx";
import BarList from "../components/BarList.jsx";
import { useData } from "../data/dataContext.js";
import { fmt, pretty } from "../utils/format.js";

function Body() {
    const { statistics, details } = useData();
    const cats = details?.categorical_counts;

    return (
        <>
            <section>
                <h2>Numerical variables at a glance</h2>
                <div className="table-wrap" tabIndex={0}>
                    <table>
                        <thead>
                        <tr>
                            <th>Variable</th>
                            <th>Min</th>
                            <th>Median</th>
                            <th>Mean</th>
                            <th>Max</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(statistics).map(([name, s]) => (
                            <tr key={name}>
                                <td>{pretty(name)}</td>
                                <td>{fmt(s.min)}</td>
                                <td>{fmt(s.median)}</td>
                                <td>{fmt(s.mean)}</td>
                                <td>{fmt(s.max)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <p className="muted small">A mean close to the median suggests values are spread fairly evenly around the middle.</p>
            </section>

            <section>
                <h2>Categorical variables</h2>
                {!cats ? (
                    <DetailsNotice />
                ) : (
                    <div className="grid grid-wide">
                        {Object.entries(cats).map(([name, counts]) => (
                            <div className="card" key={name}>
                                <h3>{pretty(name)}</h3>
                                <BarList counts={counts} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default function Eda() {
    return (
        <>
            <PageHeader
                title="Exploratory Data Analysis"
                subtitle="A first look at how the values are spread and which categories are common."
                description="Exploratory data analysis of the students' social media usage dataset: numerical ranges and category counts."
            />
            <DataGate>
                <Body />
            </DataGate>
        </>
    );
}