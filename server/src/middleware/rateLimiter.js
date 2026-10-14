const rateLimit = require("express-rate-limit");

/**
 * Rate limiters for different endpoint categories.
 *
 * The general limiter is for all routes.
 * Add stricter limiters for auth/AI endpoints as those features are built.
 */

// ── General: 100 requests per minute per IP ──────────────
const generalLimiter = rateLimit({
    windowMs: 60 * 1000,    // 1 minute
    max: 100,
    standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,   // Disable `X-RateLimit-*` headers
    message: {
        success: false,
        error: "Too many requests. Please try again shortly.",
    },
});

// ── Strict: 20 requests per minute (for future auth/AI endpoints) ──
const strictLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: "Rate limit exceeded. Please wait before retrying.",
    },
});

module.exports = { generalLimiter, strictLimiter };
