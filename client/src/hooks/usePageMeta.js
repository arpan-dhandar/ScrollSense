import { useEffect } from "react";

// Sets the browser tab title and the meta description for each page
export default function usePageMeta(title, description) {
    useEffect(() => {
        document.title = title;
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "description");
            document.head.appendChild(meta);
        }
        meta.setAttribute("content", description);
    }, [title, description]);
}