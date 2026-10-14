/**
 * Custom application error with an HTTP status code.
 *
 * Throw this anywhere in a route handler or service layer and the
 * global error handler will use the statusCode + message for the response.
 */
class AppError extends Error {
    /**
     * @param {string} message  - Safe, client-facing error message.
     * @param {number} statusCode - HTTP status code (default 500).
     */
    constructor(message, statusCode = 500) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.isOperational = true; // distinguishes expected errors from bugs
    }
}

module.exports = AppError;
