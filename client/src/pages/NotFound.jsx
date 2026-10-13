import { Link } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta.js";

export default function NotFound() {
    usePageMeta("Page not found | ScrollSense", "The page you are looking for does not exist on ScrollSense.");
    return (
        <section className="hero">
            <p className="eyebrow">Error 404</p>
            <h1>Page not found</h1>
            <p className="lead">That address does not match any page on this site.</p>
            <div className="hero-actions">
                <Link className="btn" to="/">Back to Home</Link>
            </div>
        </section>
    );
}