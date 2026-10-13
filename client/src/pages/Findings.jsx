import PageHeader from "../components/PageHeader.jsx";
import DataGate from "../components/DataGate.jsx";
import { useData } from "../data/dataContext.js";
import { fmt, corrSentence, CAUSATION_NOTE } from "../utils/format.js";

const LIMITATIONS = [
    "The Kaggle page gives no description of how the data was collected, so it is unclear whether these students represent students in general.",
    "The Mental Health Score and Addicted Score are on the dataset's own scales, which the source does not define.",
    "All relationships found are associations in one dataset. They do not prove cause and effect.",
    "Correlation only measures straight-line relationships between numerical columns.",
];

function Body() {
    const { findings, statistics, details } = useData();

    const usageSleep =
        details?.correlations?.Avg_Daily_Usage_Hours?.Sleep_Hours_Per_Night ?? findings.usage_sleep_correlation;
    const usageMental = details?.correlations?.Avg_Daily_Usage_Hours?.Mental_Health_Score;
    const academic = details?.categorical_counts?.Affects_Academic_Performance;
    const academicTotal = academic ? Object.values(academic).reduce((a, b) => a + b, 0) : null;
    const yes = academic?.Yes;

    return (
        <>
            <section>
                <h2>Findings</h2>
                <ul className="list">
                    <li>
                        The dataset has {fmt(findings.total_students)} students. They use social media for{" "}
                        {fmt(findings.average_daily_usage_hours)} hours a day on average and sleep{" "}
                        {fmt(findings.average_sleep_hours)} hours a night on average.
                    </li>
                    <li>
                        The most used platform is {findings.most_used_platform}. The average mental health score is{" "}
                        {fmt(findings.average_mental_health_score)} (on the dataset's own scale).
                    </li>
                    <li>{corrSentence("Avg_Daily_Usage_Hours", "Sleep_Hours_Per_Night", usageSleep)}</li>
                    {typeof usageMental === "number" && (
                        <li>{corrSentence("Avg_Daily_Usage_Hours", "Mental_Health_Score", usageMental)}</li>
                    )}
                    {typeof yes === "number" && (
                        <li>
                            {fmt(yes)} of {fmt(academicTotal)} students ({((yes / academicTotal) * 100).toFixed(1)}%) report that
                            social media affects their academic performance.
                        </li>
                    )}
                    <li>
                        Daily usage varies from {fmt(statistics.Avg_Daily_Usage_Hours.min)} to{" "}
                        {fmt(statistics.Avg_Daily_Usage_Hours.max)} hours across students.
                    </li>
                </ul>
            </section>

            <section>
                <h2>Conclusion</h2>
                <div className="card">
                    <p>
                        In this dataset, students who report more daily social media use also tend to report{" "}
                        {usageSleep < 0 ? "less" : "more"} sleep (r = {fmt(usageSleep)}).
                        {typeof usageMental === "number" &&
                            ` Daily use and mental health score are also related (r = ${fmt(usageMental)}).`}{" "}
                        {CAUSATION_NOTE}
                    </p>
                </div>
            </section>

            <section>
                <h2>Limitations</h2>
                <ul className="list">
                    {LIMITATIONS.map((l) => (
                        <li key={l}>{l}</li>
                    ))}
                </ul>
            </section>
        </>
    );
}

export default function Findings() {
    return (
        <>
            <PageHeader
                title="Findings and Conclusion"
                subtitle="What the analysis found, what it concludes and what it cannot tell us."
                description="Evidence-based findings, conclusion and limitations of the ScrollSense social media usage analysis."
            />
            <DataGate>
                <Body />
            </DataGate>
        </>
    );
}