const helmet = require("helmet");
const express = require("express");

/**
 * Security middleware stack.
 *
 * Returns an array of middleware that should be mounted early in the
 * Express pipeline (before any route handlers).
 */
function securityMiddleware() {
    return [
        // ── Helmet: sets many security-related HTTP headers ───────
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "blob:"],
                    connectSrc: ["'self'"],
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    frameAncestors: ["'none'"],
                },
            },
            crossOriginEmbedderPolicy: false, // allow chart images to load
        }),

        // ── Disable Express fingerprinting ────────────────────────
        (req, res, next) => {
            res.removeHeader("X-Powered-By");
            next();
        },

        // ── Body size limits ──────────────────────────────────────
        express.json({ limit: "256kb" }),
        express.urlencoded({ extended: false, limit: "256kb" }),
    ];
}

module.exports = securityMiddleware;
