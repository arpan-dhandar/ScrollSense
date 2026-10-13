import { useCallback, useEffect, useMemo, useState } from "react";
import { DataContext } from "./dataContext.js";

async function get(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(url);
    return res.json();
}

export default function DataProvider({ children }) {
    const [state, setState] = useState({
        loading: true,
        error: "",
        findings: null,
        statistics: null,
        details: null,
    });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;
        Promise.allSettled([
            get("/api/findings"),
            get("/api/statistics"),
            get("/api/details"),
        ]).then(([f, s, d]) => {
            if (!active) return;
            if (f.status === "rejected" || s.status === "rejected") {
                setState({
                    loading: false,
                    error: "Could not load the analysis results. Check that the Express server is running on port 5000.",
                    findings: null,
                    statistics: null,
                    details: null,
                });
                return;
            }
            setState({
                loading: false,
                error: "",
                findings: f.value,
                statistics: s.value,
                details: d.status === "fulfilled" ? d.value : null,
            });
        });
        return () => {
            active = false;
        };
    }, [attempt]);

    const reload = useCallback(() => {
        setState((s) => ({ ...s, loading: true, error: "" }));
        setAttempt((a) => a + 1);
    }, []);

    const value = useMemo(() => ({ ...state, reload }), [state, reload]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}