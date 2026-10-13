const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Your Colab exports live one level up, in data/exports
const EXPORTS = path.join(__dirname, "..", "data", "exports");

app.use(cors());

// Serve chart images at /charts/<filename>
app.use("/charts", express.static(path.join(EXPORTS, "charts")));

// Read a JSON file fresh on every request, so replaced exports show up without a restart
function readJson(fileName) {
    const filePath = path.join(EXPORTS, "json", fileName);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/findings", (req, res) => {
    try {
        res.json(readJson("findings.json"));
    } catch (err) {
        res.status(500).json({ error: "Could not read findings.json" });
    }
});

app.get("/api/statistics", (req, res) => {
    try {
        res.json(readJson("statistics.json"));
    } catch (err) {
        res.status(500).json({ error: "Could not read statistics.json" });
    }
});

// List the chart files that actually exist
app.get("/api/charts", (req, res) => {
    try {
        const files = fs
            .readdirSync(path.join(EXPORTS, "charts"))
            .filter((f) => f.endsWith(".png"))
            .map((f) => ({ file: f, url: `/charts/${f}` }));
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: "Could not read charts folder" });
    }
});

app.listen(PORT, () => {
    console.log(`ScrollSense API running at http://localhost:${PORT}`);
});