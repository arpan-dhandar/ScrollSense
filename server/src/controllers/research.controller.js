const fs = require("fs");
const path = require("path");
const AppError = require("../utils/AppError");

/**
 * Research data controller.
 *
 * Serves the pre-computed JSON exports and chart file listings from
 * the Colab analysis.  All file paths are resolved relative to the
 * project root's data/exports/ directory — never from user input.
 */

// Resolve once at startup — path is deterministic and never user-controlled
const EXPORTS = path.join(__dirname, "..", "..", "..", "data", "exports");
const JSON_DIR = path.join(EXPORTS, "json");
const CHARTS_DIR = path.join(EXPORTS, "charts");

// ── Helpers ───────────────────────────────────────────────

/**
 * Read and parse a JSON file from the exports directory.
 * The filename is NOT taken from the request — it is hardcoded per route.
 */
function readJsonExport(fileName) {
    const filePath = path.join(JSON_DIR, fileName);

    if (!fs.existsSync(filePath)) {
        throw new AppError(`${fileName} not found. Run the Colab export first.`, 404);
    }

    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
        throw new AppError(`Could not parse ${fileName}.`, 500);
    }
}

// ── Route handlers ────────────────────────────────────────

exports.getHealth = (_req, res) => {
    res.json({ success: true, status: "ok" });
};

exports.getFindings = (_req, res) => {
    res.json({ success: true, data: readJsonExport("findings.json") });
};

exports.getStatistics = (_req, res) => {
    res.json({ success: true, data: readJsonExport("statistics.json") });
};

exports.getDetails = (_req, res) => {
    res.json({ success: true, data: readJsonExport("details.json") });
};

exports.getCharts = (_req, res) => {
    if (!fs.existsSync(CHARTS_DIR)) {
        throw new AppError("Charts directory not found.", 404);
    }

    const files = fs
        .readdirSync(CHARTS_DIR)
        .filter((f) => f.endsWith(".png"))
        .map((f) => ({ file: f, url: `/charts/${f}` }));

    res.json({ success: true, data: files });
};

/**
 * Express static middleware for chart images — exported so app.js can
 * mount it on "/charts".
 */
exports.chartsStatic = CHARTS_DIR;
