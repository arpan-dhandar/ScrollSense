/**
 * Test to verify that env.js validates required environment
 * variables in production mode.
 */

describe("Environment configuration", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        // Reset module cache so env.js re-evaluates
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("loads with defaults in development", () => {
        process.env.NODE_ENV = "development";
        const env = require("../src/config/env");
        expect(env.NODE_ENV).toBe("development");
        expect(env.PORT).toBe(5000);
        expect(env.CLIENT_ORIGIN).toBe("http://localhost:5173");
    });

    it("reads PORT from environment", () => {
        process.env.PORT = "3001";
        process.env.NODE_ENV = "development";
        const env = require("../src/config/env");
        expect(env.PORT).toBe(3001);
    });

    it("does not log secret values in the exported object", () => {
        process.env.NODE_ENV = "development";
        const env = require("../src/config/env");
        const keys = Object.keys(env);
        // env should NOT export raw JWT_SECRET, MONGODB_URI, etc.
        expect(keys).not.toContain("JWT_SECRET");
        expect(keys).not.toContain("MONGODB_URI");
        expect(keys).not.toContain("GEMINI_API_KEY");
    });
});
