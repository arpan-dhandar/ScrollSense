const env = require("../config/env");

/**
 * Minimal structured logger.
 *
 * Uses JSON output in production for machine parsing and coloured
 * human-readable output in development.
 *
 * This intentionally avoids adding a heavy dependency (winston/pino)
 * for the current project size. Replace with pino when the project
 * grows or when you need log rotation, transports, etc.
 */

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const CURRENT_LEVEL = env.NODE_ENV === "production" ? LOG_LEVELS.info : LOG_LEVELS.debug;

function formatMessage(level, message, meta) {
    const timestamp = new Date().toISOString();

    if (env.NODE_ENV === "production") {
        // JSON lines for production log aggregators
        return JSON.stringify({ timestamp, level, message, ...meta });
    }

    // Coloured console output for development
    const colours = { error: "\x1b[31m", warn: "\x1b[33m", info: "\x1b[36m", debug: "\x1b[90m" };
    const reset = "\x1b[0m";
    const colour = colours[level] || "";
    const metaStr = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
    return `${colour}[${timestamp}] [${level.toUpperCase()}]${reset} ${message}${metaStr}`;
}

function log(level, message, meta = {}) {
    if (LOG_LEVELS[level] > CURRENT_LEVEL) return;
    const output = formatMessage(level, message, meta);
    if (level === "error") {
        console.error(output);
    } else if (level === "warn") {
        console.warn(output);
    } else {
        console.log(output);
    }
}

module.exports = {
    error: (msg, meta) => log("error", msg, meta),
    warn: (msg, meta) => log("warn", msg, meta),
    info: (msg, meta) => log("info", msg, meta),
    debug: (msg, meta) => log("debug", msg, meta),
};
