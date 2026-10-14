/**
 * Server entry point.
 *
 * Loads environment config first (so all modules see process.env),
 * then boots the Express app.
 */
const env = require("./config/env");
const logger = require("./utils/logger");
const createApp = require("./app");

const app = createApp();

app.listen(env.PORT, () => {
    logger.info(`ScrollSense API running`, {
        port: env.PORT,
        env: env.NODE_ENV,
        cors: env.CLIENT_ORIGIN,
    });
});

// ── Graceful uncaught error handling ──────────────────────
process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", {
        error: reason instanceof Error ? reason.message : String(reason),
    });
});

process.on("uncaughtException", (err) => {
    logger.error("Uncaught exception — shutting down", { error: err.message });
    process.exit(1);
});
