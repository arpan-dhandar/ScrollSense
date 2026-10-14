import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV_LINKS } from "../constants/siteConfig.js";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <header className="nav">
            <div className="container nav-inner">
                <Link to="/" className="logo" onClick={close}>
                    <span className="logo-mark" aria-hidden="true">S</span>
                    ScrollSense
                </Link>

                <button
                    type="button"
                    className="nav-toggle"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    aria-controls="nav-links"
                    onClick={() => setOpen((o) => !o)}
                >
                    {open ? "✕" : "☰"}
                </button>

                <nav id="nav-links" className={`nav-links${open ? " open" : ""}`} aria-label="Main">
                    {NAV_LINKS.map((l) => (
                        <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={close}>
                            {l.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}