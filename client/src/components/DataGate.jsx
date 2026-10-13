import { useData } from "../data/dataContext.js";

// Shows a loading state or an error with a retry button until results are ready
export default function DataGate({ children }) {
    const { loading, error, reload } = useData();

    if (loading) {
        return <p className="state" role="status">Loading results…</p>;
    }
    if (error) {
        return (
            <div className="state state-error" role="alert">
                <p>{error}</p>
                <button type="button" className="btn" onClick={reload}>Try again</button>
            </div>
        );
    }
    return children;
}