export const fmt = (v, d = 2) =>
    typeof v === "number"
        ? v.toLocaleString("en-IN", { maximumFractionDigits: d })
        : v;

export const pretty = (name) => String(name).replaceAll("_", " ");

export const FINDING_LABELS = {
    total_students: "Total students",
    average_daily_usage_hours: "Average daily usage (hours)",
    average_sleep_hours: "Average sleep (hours)",
    average_mental_health_score: "Average mental health score",
    most_used_platform: "Most used platform",
    usage_sleep_correlation: "Usage vs sleep correlation",
};

// Words for the size and direction of a correlation coefficient (r)
export function corrStrength(r) {
    const a = Math.abs(r);
    const size = a >= 0.7 ? "strong" : a >= 0.4 ? "moderate" : a >= 0.2 ? "weak" : "very weak";
    return `${size} ${r < 0 ? "negative" : "positive"}`;
}

export function corrSentence(a, b, r) {
    const move =
        r < 0
            ? "Higher values of one tend to go with lower values of the other."
            : "Higher values of one tend to go with higher values of the other.";
    return `${pretty(a)} and ${pretty(b)} show a ${corrStrength(r)} correlation (r = ${fmt(r)}). ${move}`;
}

export const CAUSATION_NOTE =
    "This is an association within this dataset. It does not show that one thing causes the other.";

// Finds the pair of numerical columns with the largest absolute correlation
export function strongestPair(corr, skip = ["Student_ID"]) {
    const keys = Object.keys(corr).filter((k) => !skip.includes(k));
    let best = null;
    for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
            const r = corr[keys[i]]?.[keys[j]];
            if (typeof r === "number" && (!best || Math.abs(r) > Math.abs(best.r))) {
                best = { a: keys[i], b: keys[j], r };
            }
        }
    }
    return best;
}