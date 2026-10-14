const env = require("../config/env");
const logger = require("../utils/logger");

/**
 * Global Express error handler.
 *
 * This MUST be the last middleware registered with app.use().
 * It catches both AppError (operational) and unexpected errors.
 *
 * Rules:
 *  - Never expose stack traces or internal details to the client.
 *  - Log the full error server-side for debugging.
 *  - Return a consistent JSON shape: { success, error, requestId? }
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
    const statusCode = err.statusCode || 500;
    const isOperational = err.isOperational === true;

    // Log — include stack only in development; never log secrets
    logger.error(err.message, {
        statusCode,
        path: req.originalUrl,
        method: req.method,
        ...(env.NODE_ENV !== "production" && { stack: err.stack }),
    });

    // Client response
    res.status(statusCode).json({
        success: false,
        error:
            isOperational || env.NODE_ENV !== "production"
                ? err.message
                : "An unexpected error occurred. Please try again later.",
    });
}

module.exports = errorHandler;
