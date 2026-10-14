const dotenv = require("dotenv");
const path = require("path");

// Load .env from the server root (one level up from src/)
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

/**
 * Centralised, validated environment configuration.
 *
 * Every variable the app needs is read here once.
 * If a required variable is missing in production the process exits
 * immediately — failing fast is safer than running with broken config.
 */

const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT, 10) || 5000,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};

// ── Validation ────────────────────────────────────────────
const isProduction = env.NODE_ENV === "production";

/**
 * Variables that MUST be set when NODE_ENV === "production".
 * Add to this array as new features (MongoDB, JWT, AI) are integrated.
 */
const requiredInProduction = [
    // "MONGODB_URI",
    // "JWT_SECRET",
];

if (isProduction) {
    const missing = requiredInProduction.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        // Intentionally does NOT log the values — only the names.
        console.error(
            `[FATAL] Missing required environment variables: ${missing.join(", ")}`
        );
        process.exit(1);
    }
}

module.exports = env;
