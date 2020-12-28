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
                                expect(shoe.name).toBe("Bovver Boot");
                            });
                        });
                });
                it("status 404: NOT FOUND responds with an error when name of shoe in query does not exist", () => {
                    return request(app)
                        .get("/api/shoes/?name=wrong")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe(
                                "Sorry Pal, That Query Was Funky. Shoe Not Found!"
                            );
                        });
                });
                it("status 404: NOT FOUND responds with an error when number of shoe in query does not exist", () => {
                    return request(app)
                        .get("/api/shoes/?nombre=Bovver+Boot")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe(
                                "Sorry Pal, That Query Was Funky. Shoe Not Found!"
                            );
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
                            price: 100.0,
                            sizing_info: "Fits like a dream",
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
                            price: 100.0,
                            sizing_info: "Fits like a dream",
                            stock_number: 2,
                            avatar_url: "https://www.jimmychoo.com/dw/image/v2/BDNT_PRD/on/demandware.static/-/Sites-jch-master-product-catalog/default/dw032f2408/images/original/MISTY120CGF_120011_SIDE.jpg?sw=1800&sh=1800&sm=fit",
                        })
                        .expect(201)
                        .then(({ body }) => {
                            expect(body.shoe.name).toBe("Charly's Shoe");
                            expect(body.shoe).toHaveProperty("shoe_id");
                            expect(body.shoe).toHaveProperty("name");
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

        describe("/shoes/:shoe_id", () => {
            describe("GET", () => {
                it("status 200: responds with status 200 when an shoe id is given", () => {
                    return request(app).get("/api/shoes/1").expect(200);
                });
                it("status 200: responds with an array containing an shoe when an shoe id is given", () => {
                    return request(app)
                        .get("/api/shoes/1")
                        .expect(200)
                        .then(({ body: { shoes } }) => {
                            shoes.forEach((shoe) => {
                                expect(shoe.name).toBe("Bovver Boot");
                                // expect(shoe).toHaveProperty("name");
                                expect(shoe).toHaveProperty("description");
                                expect(shoe).toHaveProperty("price");
                                expect(shoe).toHaveProperty("sizing_info");
                                expect(shoe).toHaveProperty("shoe_id");
                                expect(shoe).toHaveProperty("stock_number");
                                expect(shoe).toHaveProperty("avatar_url");
                            });
                        });
                });
                it("status 404: NOT FOUND -> responds with an error message if the requested shoe does not exist", () => {
                    return request(app)
                        .get("/api/shoes/999")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe("Sorry Pal, Shoe Not Found!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if the shoe_id is invalid", () => {
                    return request(app)
                        .get("/api/shoes/notAnId")
                        .expect(400)
                        .then((response) => {
                            expect(response.body.msg).toBe("No Can Do Pal, Bad Request!");
                        });
                });
            });

            describe("PATCH", () => {
                it("status 200: responds with status 200", () => {
                    return request(app)
                        .patch("/api/shoes/1")
                        .send({ reduce_stock: 1 })
                        .expect(200);
                });
                it("status 200: responds with the specified shoe, with stock reduced by the specified number", () => {
                    return request(app)
                        .patch("/api/shoes/1")
                        .send({ reduce_stock: 1 })
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.shoe.stock_number).toBe(99);
                        });
                });
                it("status 404: NOT FOUND responds with an error message if the requested shoe does not exist", () => {
                    return request(app)
                        .patch("/api/shoes/9999")
                        .send({ reduce_stock: 1 })
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe("Sorry Pal, Shoe Not Found!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if the shoe_id is invalid", () => {
                    return request(app)
                        .patch("/api/shoes/notAnId")
                        .send({ reduce_stock: 1 })
                        .expect(400)
                        .then((response) => {
                            expect(response.body.msg).toBe("No Can Do Pal, Bad Request!");
                        });
                });
                it("status 400: BAD REQUEST -> malformed body/ missing fields responds with an error message", () => {
                    return request(app)
                        .patch("/api/shoes/notAnId")
                        .send({})
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("No Can Do Pal, Bad Request. Fix Ya Body!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if request fails schema validation", () => {
                    return request(app)
                        .patch("/api/shoes/notAnId")
                        .send({
                            reduce_stock: null,
                        })
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("No Can Do Pal, Bad Request!");
                        });
                });
            });

            describe('DELETE', () => {
                it('status 204: returns 204 when delete an shoe', () => {
                    return request(app).delete('/api/shoes/3').expect(204);
                });
                it('status 204: the deleted shoe is no longer in shoes, so get returns a 404', () => {
                    return request(app)
                        .delete('/api/shoes/3')
                        .expect(204)
                        .then(() => {
                            return request(app)
                                .get('/api/shoes/3')
                                .expect(404)
                                .then((response) => {
                                    expect(response.body.msg).toBe('Sorry Pal, Shoe Not Found!');
                                })
                        });
                });
                it('status 404: NO CONTENT responds with an error message if the shoe you attempt to delete does not exist (path potentially valid but no content)', () => {
                    return request(app)
                        .delete('/api/shoes/10000000')
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe('Sorry Pal, Cannot Delete Non Existant Shoe!')
                        });
                });
                it('status 400: INVALID PATH responds with an error message if the shoe you attempt to delete with an invalid id e.g. a word', () => {
                    return request(app)
                        .delete('/api/shoes/somethingseedy')
                        .expect(400)
                        .then((response) => {
                            expect(response.body.msg).toBe('No Can Do Pal, Bad Request!')
                        });
                });
            });

            describe("INVALID METHODS", () => {
                it("status 405: for invalid methods POST, DELETE, PATCH and PUT", () => {
                    const invalidMethods = ["post", "put"];

                    const promises = invalidMethods.map((method) => {
                        return request(app)[method]("/api/shoes/1")
                            .expect(405)
                            .then(({ body: { msg } }) => {
                                expect(msg).toBe("Nah Pal, Method Not Allowed!");
                            });
                    });
                    return Promise.all(promises);
                });
            });
        });

        describe("/users", () => {
            describe("GET", () => {
                it("status 200: responds with status 200", () => {
                    return request(app).get("/api/users").expect(200);
                });
                it("status 200: responds with an array", () => {
                    return request(app)
                        .get("/api/users")
                        .expect(200)
                        .then(({ body: { users } }) => {
                            expect(Array.isArray(users)).toBe(true);
                            expect(users).toHaveLength(4);
                        });
                });
                it("status 200: responds with the correct keys", () => {
                    return request(app)
                        .get("/api/users")
                        .expect(200)
                        .then(({ body: { users } }) => {
                            users.forEach((user) => {
                                expect(user).toHaveProperty("name");
                                expect(user).toHaveProperty("username");
                                expect(user).toHaveProperty("email");
                                expect(user).toHaveProperty("user_id");
                                expect(user).toHaveProperty("avatar_url");
                            });
                        });
                });
                it("status 200: responds with an array of users matching the name of the user specified in the request query", () => {
                    return request(app)
                        .get("/api/users/?name=Arthur")
                        .expect(200)
                        .then(({ body: { users } }) => {
                            expect(Array.isArray(users)).toBe(true);
                            expect(users.length).toBe(1);
                            users.forEach((user) => {
                                expect(user.name).toBe("Arthur");
                            });
                        });
                });
                it("status 200: responds with an array of users matching the username of the user specified in the request query", () => {
                    return request(app)
                        .get("/api/users/?username=Atty")
                        .expect(200)
                        .then(({ body: { users } }) => {
                            expect(Array.isArray(users)).toBe(true);
                            expect(users.length).toBe(1);
                            users.forEach((user) => {
                                expect(user.username).toBe("Atty");
                            });
                        });
                });
                it("status 200: responds with an array of users matching the email of the user specified in the request query", () => {
                    return request(app)
                        .get("/api/users/?email=attyralphmannion@gmail")
                        .expect(200)
                        .then(({ body: { users } }) => {
                            expect(Array.isArray(users)).toBe(true);
                            expect(users.length).toBe(1);
                            users.forEach((user) => {
                                expect(user.email).toBe("attyralphmannion@gmail");
                            });
                        });
                });
                it("status 404: NOT FOUND responds with an error when name of user in query does not exist", () => {
                    return request(app)
                        .get("/api/users/?name=wrong")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe(
                                "Sorry Pal, That Query Was Funky. User Not Found!"
                            );
                        });
                });
                it("status 404: NOT FOUND responds with an error when username of user in query does not exist", () => {
                    return request(app)
                        .get("/api/users/?username=wrong")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe(
                                "Sorry Pal, That Query Was Funky. User Not Found!"
                            );
                        });
                });
                it("status 404: NOT FOUND responds with an error when email of user in query does not exist", () => {
                    return request(app)
                        .get("/api/users/?email=wrong")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe(
                                "Sorry Pal, That Query Was Funky. User Not Found!"
                            );
                        });
                });
                it("status 404: NOT FOUND responds with an error when number of user in query does not exist", () => {
                    return request(app)
                        .get("/api/users/?nombre=Bovver+Boot")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe(
                                "Sorry Pal, That Query Was Funky. User Not Found!"
                            );
                        });
                });
            });

            describe("POST", () => {
                it("status 201: responds with 201 for a successfully posted user", () => {
                    return request(app)
                        .post("/api/users")
                        .send({
                            name: "Charly",
                            username: "Tottie",
                            email: 'charly@gmail.com',
                            avatar_url: "https://media-exp1.licdn.com/dms/image/C4D03AQEkMlQVLdC-NQ/profile-displayphoto-shrink_200_200/0/1594117894380?e=1614816000&v=beta&t=Y7sRVSg_SKN05eGu9vxNiqrmeklst3GYPk0YxSptvuA",
                        })
                        .expect(201);
                });
                it("status 201: responds with the successfully posted user", () => {
                    return request(app)
                        .post("/api/users")
                        .send({
                            name: "Charly",
                            username: "Tottie",
                            email: 'charly@gmail.com',
                            avatar_url: "https://media-exp1.licdn.com/dms/image/C4D03AQEkMlQVLdC-NQ/profile-displayphoto-shrink_200_200/0/1594117894380?e=1614816000&v=beta&t=Y7sRVSg_SKN05eGu9vxNiqrmeklst3GYPk0YxSptvuA",
                        })
                        .expect(201)
                        .then(({ body }) => {
                            expect(body.user.name).toBe("Charly");
                            expect(body.user.username).toBe("Tottie");
                            expect(body.user.email).toBe("charly@gmail.com");
                            expect(body.user).toHaveProperty("avatar_url");
                        });
                });
                it("status 400: BAD REQUEST -> malformed body/ missing fields responds with an error message", () => {
                    return request(app)
                        .post("/api/users")
                        .send({})
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("No Can Do Pal, Bad Request. Fix Ya Body!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if request fails schema validation", () => {
                    return request(app)
                        .post("/api/users")
                        .send({
                            name: null,
                            username: null,
                            email: null,
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
                        return request(app)[method]("/api/users")
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