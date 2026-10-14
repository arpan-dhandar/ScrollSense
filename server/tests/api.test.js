const supertest = require("supertest");
const createApp = require("../src/app");

const app = createApp();
const request = supertest(app);

describe("Research API", () => {
    // ── Health ────────────────────────────────────────────
    describe("GET /api/health", () => {
        it("returns 200 with status ok", async () => {
            const res = await request.get("/api/health");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ success: true, status: "ok" });
        });
    });

    // ── Findings ──────────────────────────────────────────
    describe("GET /api/findings", () => {
        it("returns 200 with findings data", async () => {
            const res = await request.get("/api/findings");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.total_students).toBe(705);
        });

        it("does not expose internal file paths", async () => {
            const res = await request.get("/api/findings");
            const body = JSON.stringify(res.body);
            expect(body).not.toMatch(/node_modules/);
            expect(body).not.toMatch(/\\.env/);
        });
    });

    // ── Statistics ─────────────────────────────────────────
    describe("GET /api/statistics", () => {
        it("returns 200 with statistics data", async () => {
            const res = await request.get("/api/statistics");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.Avg_Daily_Usage_Hours).toBeDefined();
        });
    });

    // ── Details ───────────────────────────────────────────
    describe("GET /api/details", () => {
        it("returns 200 with details data", async () => {
            const res = await request.get("/api/details");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    // ── Charts listing ────────────────────────────────────
    describe("GET /api/charts", () => {
        it("returns an array of chart files", async () => {
            const res = await request.get("/api/charts");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
            expect(res.body.data[0]).toHaveProperty("file");
            expect(res.body.data[0]).toHaveProperty("url");
        });
    });
});

describe("Security headers", () => {
    it("does not expose X-Powered-By", async () => {
        const res = await request.get("/api/health");
        expect(res.headers["x-powered-by"]).toBeUndefined();
    });

    it("sets Helmet security headers", async () => {
        const res = await request.get("/api/health");
        // Helmet sets these by default
        expect(res.headers["x-content-type-options"]).toBe("nosniff");
        expect(res.headers["x-frame-options"]).toBeDefined();
    });

    it("sets Content-Security-Policy", async () => {
        const res = await request.get("/api/health");
        expect(res.headers["content-security-policy"]).toBeDefined();
    });
});

describe("Error handling", () => {
    it("returns 404 JSON for unknown routes", async () => {
        const res = await request.get("/api/nonexistent-route");
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBeDefined();
    });

    it("404 response does not leak stack traces", async () => {
        const res = await request.get("/api/nonexistent-route");
        const body = JSON.stringify(res.body);
        expect(body).not.toMatch(/at\s+\w+\s+\(/); // no stack frames
    });
});

describe("CORS", () => {
    it("allows requests from the configured origin", async () => {
        const res = await request
            .get("/api/health")
            .set("Origin", "http://localhost:5173");
        expect(res.headers["access-control-allow-origin"]).toBe(
            "http://localhost:5173"
        );
    });

    it("rejects requests from unknown origins", async () => {
        const res = await request
            .get("/api/health")
            .set("Origin", "https://evil.example.com");
        // CORS error — the origin header should NOT be reflected
        expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    });
});

describe("Response format consistency", () => {
    it("all API endpoints return { success } field", async () => {
        const endpoints = ["/api/health", "/api/findings", "/api/statistics", "/api/charts"];
        for (const ep of endpoints) {
            const res = await request.get(ep);
            expect(res.body).toHaveProperty("success");
        }
    });
});
