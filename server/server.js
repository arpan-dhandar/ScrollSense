const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Colab exports live one level up, in data/exports
const EXPORTS = path.join(__dirname, "..", "data", "exports");

app.use(cors());
app.use("/charts", express.static(path.join(EXPORTS, "charts")));

// Read a JSON export fresh on every request
function sendJson(fileName, res) {
    const filePath = path.join(EXPORTS, "json", fileName);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: `${fileName} not found` });
    }
    try {
        res.json(JSON.parse(fs.readFileSync(filePath, "utf8")));
    } catch (err) {
        res.status(500).json({ error: `Could not read ${fileName}` });
    }
}

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get("/api/findings", (req, res) => sendJson("findings.json", res));
app.get("/api/statistics", (req, res) => sendJson("statistics.json", res));
app.get("/api/details", (req, res) => sendJson("details.json", res));

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