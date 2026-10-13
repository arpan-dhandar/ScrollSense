import { Link } from "react-router-dom";
import { NAV_LINKS, SOURCE } from "../config.js";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-inner">
                <div>
                    <strong>ScrollSense</strong>
                    <p className="muted small">Social Media Usage Analysis, a Foundations of Data Science project.</p>
                </div>
                <nav aria-label="Footer" className="footer-links">
                    {NAV_LINKS.map((l) => (
                        <Link key={l.to} to={l.to}>{l.label}</Link>
                    ))}
                    <a href={SOURCE.url} target="_blank" rel="noopener noreferrer">Dataset on Kaggle</a>
                </nav>
            </div>
            <div className="container">
                <p className="muted small copyright">© {new Date().getFullYear()} ScrollSense. Dataset licensed under the MIT License as listed on Kaggle.</p>
            </div>
        </footer>
    );
}