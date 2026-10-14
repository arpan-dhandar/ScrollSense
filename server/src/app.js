const express = require("express");
const corsMiddleware = require("./config/cors");
const securityMiddleware = require("./middleware/security");
const { generalLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const apiRoutes = require("./routes");
const research = require("./controllers/research.controller");

/**
 * Express application factory.
 *
 * Creates and configures the Express app with all middleware and routes.
 * Separated from server.js so the app can be imported by tests without
 * starting a listener.
 */
function createApp() {
    const app = express();

    // ── Security ──────────────────────────────────────────
    app.use(corsMiddleware);
    securityMiddleware().forEach((mw) => app.use(mw));
    app.use(generalLimiter);

    // ── Static assets ─────────────────────────────────────
    app.use("/charts", express.static(research.chartsStatic));

    // ── API routes ────────────────────────────────────────
    app.use("/api", apiRoutes);

    // ── 404 catch-all ─────────────────────────────────────
    app.use((_req, res) => {
        res.status(404).json({ success: false, error: "Route not found." });
    });

    // ── Global error handler (MUST be last) ───────────────
    app.use(errorHandler);

    return app;
}

module.exports = createApp;
