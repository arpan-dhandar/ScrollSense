const AppError = require("../src/utils/AppError");

describe("AppError", () => {
    it("creates an error with a message and status code", () => {
        const err = new AppError("Not found", 404);
        expect(err.message).toBe("Not found");
        expect(err.statusCode).toBe(404);
        expect(err.isOperational).toBe(true);
        expect(err).toBeInstanceOf(Error);
    });

    it("defaults to status 500", () => {
        const err = new AppError("Something broke");
        expect(err.statusCode).toBe(500);
    });

    it("has the correct name property", () => {
        const err = new AppError("test");
        expect(err.name).toBe("AppError");
    });
});
