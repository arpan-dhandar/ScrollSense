const cors = require("cors");
const env = require("./env");

/**
 * CORS configuration.
 *
 * In production only the explicitly listed CLIENT_ORIGIN is allowed.
 * In development we also allow localhost on any port for convenience,
 * but NEVER use `origin: true` or `origin: "*"` with credentials.
 */
const allowedOrigins = env.CLIENT_ORIGIN
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        // Allow server-to-server requests (no origin header) like health checks
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // In development, allow any localhost port
        if (
            env.NODE_ENV !== "production" &&
            /^https?:\/\/localhost(:\d+)?$/.test(origin)
        ) {
            return callback(null, true);
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
