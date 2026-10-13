import { Link } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta.js";
import DataGate from "../components/DataGate.jsx";
import StatCard from "../components/StatCard.jsx";
import { useData } from "../data/dataContext.js";
import { FINDING_LABELS, fmt, pretty } from "../utils/format.js";

const OBJECTIVES = [
    "Check the dataset for missing values, duplicates, wrong data types, inconsistent values and outliers.",
    "Describe each numerical variable with mean, median, mode, variance, standard deviation and range.",
    "Study how daily usage relates to sleep, mental health score and other measured behaviour.",
    "Present findings with their limitations, and keep the report, notebook and website consistent.",
];

function KeyFindings() {
    const { findings } = useData();
    return (
        <>
            <p className="notice ok" role="status">
                Results loaded from the latest analysis export ({fmt(findings.total_students)} student records).
            </p>
            <div className="grid">
                {Object.entries(findings).map(([key, value]) => (
                    <StatCard key={key} label={FINDING_LABELS[key] || pretty(key)} value={fmt(value)} />
                ))}
            </div>
        </>
    );
}

export default function Home() {
    usePageMeta(
        "ScrollSense | Social Media Usage Analysis",
        "ScrollSense analyses how students' social media usage relates to sleep, mental health score and reported academic impact."
    );

    return (
        <>
            <section className="hero">
                <p className="eyebrow">Foundations of Data Science project</p>
                <h1>
                    Scroll<span className="grad">Sense</span>
                </h1>
                <p className="lead">
                    A data analysis of student social media usage: how screen time, platform choice and other measurable
                    behaviour relate to each other.
                </p>
                <div className="hero-actions">
                    <Link className="btn" to="/visualizations">View visualizations</Link>
                    <Link className="btn btn-ghost" to="/dataset">Explore the dataset</Link>
                </div>
            </section>

            <section>
                <h2>Objectives</h2>
                <ol className="list">
                    {OBJECTIVES.map((o) => (
                        <li key={o}>{o}</li>
                    ))}
                </ol>
            </section>

            <section>
                <h2>Key findings</h2>
                <DataGate>
                    <KeyFindings />
                </DataGate>
                <p className="muted small">
                    Every number above is computed by the Python analysis and served from its exported files.{" "}
                    <Link to="/findings">Read the full findings</Link>.
                </p>
            </section>
        </>
    );
}