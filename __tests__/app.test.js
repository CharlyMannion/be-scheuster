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
                it("status 200: responds with the correct keys", () => {
                    return request(app)
                        .get("/api/shoes")
                        .expect(200)
                        .then(({ body: { shoes } }) => {
                            shoes.forEach((shoe) => {
                                expect(shoe).toHaveProperty("name");
                                expect(shoe).toHaveProperty("description");
                                expect(shoe).toHaveProperty("price");
                                expect(shoe).toHaveProperty("sizing_info");
                                expect(shoe).toHaveProperty("shoe_id");
                                expect(shoe).toHaveProperty("stock_number");
                                expect(shoe).toHaveProperty("avatar_url");
                            });
                        });
                });
                it("status 200: responds with an array of shoes matching the name of the shoe specified in the request query", () => {
                    return request(app)
                        .get("/api/shoes/?name=Bovver+Boot")
                        .expect(200)
                        .then(({ body: { shoes } }) => {
                            expect(Array.isArray(shoes)).toBe(true);
                            expect(shoes.length).toBe(1);
                            shoes.forEach((shoe) => {
                                expect(shoe.name).toBe('Bovver Boot');
                            });
                        });
                });
                it("status 404: NOT FOUND responds with an error when name of shoe in query does not exist", () => {
                    return request(app)
                        .get("/api/shoes/?name=wrong")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe("Sorry Pal, That Query Was Funky. Shoe Not Found!");
                        });
                });
                it("status 404: NOT FOUND responds with an error when number of shoe in query does not exist", () => {
                    return request(app)
                        .get("/api/shoes/?nombre=Bovver+Boot")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe("Sorry Pal, That Query Was Funky. Shoe Not Found!");
                        });
                });
            });
            describe("POST", () => {
                it("status 201: responds with 201 for a successfully posted shoe", () => {
                    return request(app)
                        .post("/api/shoes")
                        .send({
                            name: "Charly's Shoe",
                            description: "December 4, 2020",
                            price: 100.00,
                            sizing_info: 'Fits like a dream',
                            stock_number: 2,
                            avatar_url: "https://www.jimmychoo.com/dw/image/v2/BDNT_PRD/on/demandware.static/-/Sites-jch-master-product-catalog/default/dw032f2408/images/original/MISTY120CGF_120011_SIDE.jpg?sw=1800&sh=1800&sm=fit",
                        })
                        .expect(201);
                });
                it("status 201: responds with the successfully posted shoe", () => {
                    return request(app)
                        .post("/api/shoes")
                        .send({
                            name: "Charly's Shoe",
                            description: "December 4, 2020",
                            price: 100.00,
                            sizing_info: 'Fits like a dream',
                            stock_number: 2,
                            avatar_url: "https://www.jimmychoo.com/dw/image/v2/BDNT_PRD/on/demandware.static/-/Sites-jch-master-product-catalog/default/dw032f2408/images/original/MISTY120CGF_120011_SIDE.jpg?sw=1800&sh=1800&sm=fit",
                        })
                        .expect(201)
                        .then(({ body }) => {
                            expect(body.shoe.name).toBe("Charly's Shoe");
                            expect(body.shoe).toHaveProperty('shoe_id');
                            expect(body.shoe).toHaveProperty('name');
                            expect(body.shoe).toHaveProperty("description");
                            expect(body.shoe).toHaveProperty("price");
                            expect(body.shoe).toHaveProperty("sizing_info");
                            expect(body.shoe).toHaveProperty("stock_number");
                            expect(body.shoe).toHaveProperty("avatar_url");
                        });
                });
                it("status 400: BAD REQUEST -> malformed body/ missing fields responds with an error message", () => {
                    return request(app)
                        .post("/api/shoes")
                        .send({})
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("No Can Do Pal, Bad Request. Fix Ya Body!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if request fails schema validation", () => {
                    return request(app)
                        .post("/api/shoes")
                        .send({
                            name: null,
                            description: null,
                            price: null,
                            sizing_info: null,
                            stock_number: null,
                            avatar_url: null,
                        })
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("No Can Do Pal, Bad Request. Fix Ya Body!");
                        });
                });
            });
            describe("INVALID METHODS", () => {
                it("status 405: for invalid methods DELETE, PATCH and PUT", () => {
                    const invalidMethods = ["delete", "patch", "put"];

                    const promises = invalidMethods.map((method) => {
                        return request(app)[method]("/api/shoes")
                            .expect(405)
                            .then(({ body: { msg } }) => {
                                expect(msg).toBe("Nah Pal, Method Not Allowed!");
                            });
                    });
                    return Promise.all(promises);
                });
            });
        });
    });
});