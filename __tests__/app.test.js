const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

beforeEach(() => {
    return connection.seed.run();
});

afterAll(() => {
    return connection.destroy();
});

describe("app", () => {
    it("status: 404 for invalid path", () => {
        return request(app)
            .get("/invalid-path")
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Oopsie, Path Not Found!");
            });
    });
    describe("/api", () => {
        describe("/shoes", () => {
            describe("GET", () => {
                it("status 200: responds with status 200", () => {
                    return request(app).get("/api/shoes").expect(200);
                });
                it("status 200: responds with an array", () => {
                    return request(app)
                        .get("/api/shoes")
                        .expect(200)
                        .then(({ body: { shoes } }) => {
                            expect(Array.isArray(shoes)).toBe(true);
                            expect(shoes).toHaveLength(4);
                        });
                });
            });
        });
    });
});