import PageHeader from "../components/PageHeader.jsx";
import DataGate from "../components/DataGate.jsx";
import ChartCard from "../components/ChartCard.jsx";
import { useData } from "../data/dataContext.js";
import { fmt, pretty, strongestPair, corrSentence, CAUSATION_NOTE } from "../utils/format.js";

function Body() {
    const { findings, statistics, details } = useData();

    const usage = statistics.Avg_Daily_Usage_Hours;
    const corr = details?.correlations;
    const platforms = details?.categorical_counts?.Most_Used_Platform;
    const total = platforms ? Object.values(platforms).reduce((a, b) => a + b, 0) : null;
    const topName = platforms ? Object.keys(platforms)[0] : findings.most_used_platform;

    const usageSleep =
        corr?.Avg_Daily_Usage_Hours?.Sleep_Hours_Per_Night ?? findings.usage_sleep_correlation;
    const usageMental = corr?.Avg_Daily_Usage_Hours?.Mental_Health_Score;
    const best = corr ? strongestPair(corr) : null;

    const gap = Math.abs(usage.mean - usage.median);
    const shape =
        gap <= 0.1 * usage.std
            ? "The mean and median are close, so the values are spread fairly evenly around the middle."
            : "The mean and median differ noticeably, so the distribution is somewhat lopsided.";

    const charts = [
        {
            file: "usage_distribution.png",
            title: "Distribution of daily social media usage",
            variables: "Avg Daily Usage Hours",
            shows: "A histogram: each bar counts how many students fall in a range of daily usage hours.",
            interpretation: `Daily usage ranges from ${fmt(usage.min)} to ${fmt(usage.max)} hours, with a mean of ${fmt(usage.mean)} and a median of ${fmt(usage.median)}. ${shape}`,
            limits: "It shows how usage is spread, not why students use social media for that long.",
        },
        {
            file: "platform_usage.png",
            title: "Most used social media platforms",
            variables: "Most Used Platform",
            shows: "A bar chart: each bar is one platform, and its height is the number of students who chose it.",
            interpretation: platforms
                ? `${topName} is the most used platform, chosen by ${fmt(platforms[topName])} of ${fmt(total)} students (${((platforms[topName] / total) * 100).toFixed(1)}%).`
                : `${topName} is the most used platform in the dataset.`,
            limits: "It shows which platform each student names as their most used one, not how long they spend on it.",
        },
        {
            file: "usage_vs_sleep.png",
            title: "Daily usage vs sleep hours",
            variables: "Avg Daily Usage Hours, Sleep Hours Per Night",
            shows: "A scatter plot: each point is one student.",
            interpretation: corrSentence("Avg_Daily_Usage_Hours", "Sleep_Hours_Per_Night", usageSleep),
            limits: `${CAUSATION_NOTE} Other factors, such as workload, are not measured here.`,
        },
        {
            file: "usage_vs_mental_health.png",
            title: "Daily usage vs mental health score",
            variables: "Avg Daily Usage Hours, Mental Health Score",
            shows: "A scatter plot: each point is one student.",
            interpretation:
                typeof usageMental === "number"
                    ? `${corrSentence("Avg_Daily_Usage_Hours", "Mental_Health_Score", usageMental)} The score is on the dataset's own scale, which the source does not document.`
                    : "Run the extra export to see the correlation value for this pair.",
            limits: `${CAUSATION_NOTE} The meaning of the score is not documented, so it should not be read as a clinical measure.`,
        },
        {
            file: "correlation_heatmap.png",
            title: "Correlation heatmap",
            variables: "All numerical variables",
            shows: "A grid: each cell is the correlation between two numerical columns. Values near +1 or -1 mean a stronger relationship; near 0 means little linear relationship.",
            interpretation: best
                ? `The strongest pair is ${pretty(best.a)} and ${pretty(best.b)} (r = ${fmt(best.r)}), a ${best.r < 0 ? "negative" : "positive"} relationship.`
                : "Run the extra export to see the strongest pair.",
            limits: "It only captures straight-line relationships between numerical columns, and says nothing about cause.",
        },
    ];

    return (
        <>
            <p className="notice ok" role="status">Showing {charts.length} charts from the Python analysis.</p>
            <div className="chart-grid">
                {charts.map((c) => (
                    <ChartCard key={c.file} {...c} />
                ))}
            </div>
        </>
    );
}

export default function Visualizations() {
    return (
        <>
            <PageHeader
                title="Visualizations"
                subtitle="Five charts from the Python analysis, each with a plain-language reading."
                description="Charts of student social media usage, sleep, mental health score and platform choice, with interpretations."
            />
            <DataGate>
                <Body />
            </DataGate>
        </>
    );
}