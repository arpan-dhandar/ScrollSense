import usePageMeta from "../hooks/usePageMeta.js";

export default function PageHeader({ title, subtitle, description }) {
    usePageMeta(`${title} | ScrollSense`, description || subtitle);
    return (
        <header className="page-header">
            <h1>{title}</h1>
            <p className="lead">{subtitle}</p>
        </header>
    );
}