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
                                expect(shoe).toHaveProperty("category");
                                expect(shoe).toHaveProperty("style");
                                expect(shoe).toHaveProperty("material");
                                expect(shoe).toHaveProperty("size");
                                expect(shoe).toHaveProperty("colour_group");
                                expect(shoe).toHaveProperty("heel_height");
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
                it("status 200: responds with an array of shoes matching the category of the shoe specified in the request query", () => {
                    return request(app)
                        .get("/api/shoes/?category=women")
                        .expect(200)
                        .then(({ body: { shoes } }) => {
                            expect(Array.isArray(shoes)).toBe(true);
                            expect(shoes.length).toBe(2);
                            shoes.forEach((shoe) => {
                                expect(shoe.category).toBe("women");
                            });
                        });
                });
                it("status 200: responds with an array of shoes matching the style of the shoe specified in the request query", () => {
                    return request(app)
                        .get("/api/shoes/?style=Courts")
                        .expect(200)
                        .then(({ body: { shoes } }) => {
                            expect(Array.isArray(shoes)).toBe(true);
                            expect(shoes.length).toBe(1);
                            shoes.forEach((shoe) => {
                                expect(shoe.style).toBe("Courts");
                            });
                        });
                });
                it("status 200: responds with an array of shoes matching the material of the shoe specified in the request query", () => {
                    return request(app)
                        .get("/api/shoes/?material=leather")
                        .expect(200)
                        .then(({ body: { shoes } }) => {
                            expect(Array.isArray(shoes)).toBe(true);
                            expect(shoes.length).toBe(3);
                            shoes.forEach((shoe) => {
                                expect(shoe.material).toBe("leather");
                            });
                        });
                });
                it("status 200: responds with an array of shoes matching the size of the shoe specified in the request query", () => {
                    return request(app)
                        .get("/api/shoes/?size=4")
                        .expect(200)
                        .then(({ body: { shoes } }) => {
                            expect(Array.isArray(shoes)).toBe(true);
                            expect(shoes.length).toBe(1);
                            shoes.forEach((shoe) => {
                                expect(shoe.size).toBe(4);
                            });
                        });
                });
                it("status 200: responds with an array of shoes matching the colour_group of the shoe specified in the request query", () => {
                    return request(app)
                        .get("/api/shoes/?colour_group=black")
                        .expect(200)
                        .then(({ body: { shoes } }) => {
                            expect(Array.isArray(shoes)).toBe(true);
                            expect(shoes.length).toBe(1);
                            shoes.forEach((shoe) => {
                                expect(shoe.colour_group).toBe("black");
                            });
                        });
                });
                it("status 200: responds with an array of shoes matching the heel_height of the shoe specified in the request query", () => {
                    return request(app)
                        .get("/api/shoes/?heel_height=flats")
                        .expect(200)
                        .then(({ body: { shoes } }) => {
                            expect(Array.isArray(shoes)).toBe(true);
                            expect(shoes.length).toBe(3);
                            shoes.forEach((shoe) => {
                                expect(shoe.heel_height).toBe("flats");
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
                            category: "women",
                            style: "chelsea boot",
                            material: "vegan leather",
                            size: 5,
                            colour_group: 'black',
                            heel_height: 'flats',
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
                            category: "women",
                            style: "chelsea boot",
                            material: "vegan leather",
                            size: 5,
                            colour_group: 'black',
                            heel_height: 'flats',
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
                            expect(body.shoe).toHaveProperty("category");
                            expect(body.shoe).toHaveProperty("style");
                            expect(body.shoe).toHaveProperty("material");
                            expect(body.shoe).toHaveProperty("size");
                            expect(body.shoe).toHaveProperty("colour_group");
                            expect(body.shoe).toHaveProperty("heel_height");
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
                                expect(shoe).toHaveProperty("description");
                                expect(shoe).toHaveProperty("price");
                                expect(shoe).toHaveProperty("sizing_info");
                                expect(shoe).toHaveProperty("shoe_id");
                                expect(shoe).toHaveProperty("stock_number");
                                expect(shoe).toHaveProperty("avatar_url");
                                expect(shoe).toHaveProperty("category");
                                expect(shoe).toHaveProperty("style");
                                expect(shoe).toHaveProperty("material");
                                expect(shoe).toHaveProperty("size");
                                expect(shoe).toHaveProperty("colour_group");
                                expect(shoe).toHaveProperty("heel_height");
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
                        .patch("/api/shoes/1")
                        .send({})
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("No Can Do Pal, Bad Request. Fix Ya Body!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if request fails schema validation", () => {
                    return request(app)
                        .patch("/api/shoes/1")
                        .send({
                            reduce_stock: null,
                        })
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("No Can Do Pal, Bad Request. Fix Ya Body!");
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
                it("status 405: for invalid methods POST and PUT", () => {
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

        describe("/users/:user_id", () => {
            describe("GET", () => {
                it("status 200: responds with status 200 when an user id is given", () => {
                    return request(app).get("/api/users/1").expect(200);
                });
                it("status 200: responds with an array containing an user when an user id is given", () => {
                    return request(app)
                        .get("/api/users/1")
                        .expect(200)
                        .then(({ body: { users } }) => {
                            users.forEach((user) => {
                                expect(user.name).toBe("Arthur");
                                expect(user).toHaveProperty("username");
                                expect(user).toHaveProperty("email");
                                expect(user).toHaveProperty("avatar_url");
                            });
                        });
                });
                it("status 404: NOT FOUND -> responds with an error message if the requested user does not exist", () => {
                    return request(app)
                        .get("/api/users/999")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe("Sorry Pal, User Not Found!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if the user_id is invalid", () => {
                    return request(app)
                        .get("/api/users/notAnId")
                        .expect(400)
                        .then((response) => {
                            expect(response.body.msg).toBe("No Can Do Pal, Bad Request!");
                        });
                });
            });

            describe("PATCH", () => {
                it("status 200: responds with status 200", () => {
                    return request(app)
                        .patch("/api/users/1")
                        .send({ email: "antichrist" })
                        .expect(200);
                });
                it("status 200: responds with the specified user, with stock reduced by the specified number", () => {
                    return request(app)
                        .patch("/api/users/1")
                        .send({ email: "antichrist" })
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.user.email).toBe("antichrist");
                        });
                });
                it("status 404: NOT FOUND responds with an error message if the requested user does not exist", () => {
                    return request(app)
                        .patch("/api/users/9999")
                        .send({ email: "antichrist" })
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe("Sorry Pal, User Not Found!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if the user_id is invalid", () => {
                    return request(app)
                        .patch("/api/users/notAnId")
                        .send({ email: "antichrist" })
                        .expect(400)
                        .then((response) => {
                            expect(response.body.msg).toBe("No Can Do Pal, Bad Request!");
                        });
                });
                it("status 400: BAD REQUEST -> malformed body/ missing fields responds with an error message", () => {
                    return request(app)
                        .patch("/api/users/1")
                        .send({})
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("No Can Do Pal, Bad Request. Fix Ya Body!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if request fails schema validation", () => {
                    return request(app)
                        .patch("/api/users/1")
                        .send({
                            email: null,
                        })
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("No Can Do Pal, Bad Request. Fix Ya Body!");
                        });
                });
            });

            describe('DELETE', () => {
                it('status 204: returns 204 when delete a user', () => {
                    return request(app).delete('/api/users/3').expect(204);
                });
                it('status 204: the deleted user is no longer in users, so get returns a 404', () => {
                    return request(app)
                        .delete('/api/users/3')
                        .expect(204)
                        .then(() => {
                            return request(app)
                                .get('/api/users/3')
                                .expect(404)
                                .then((response) => {
                                    expect(response.body.msg).toBe('Sorry Pal, User Not Found!');
                                })
                        });
                });
                it('status 404: NO CONTENT responds with an error message if the user you attempt to delete does not exist (path potentially valid but no content)', () => {
                    return request(app)
                        .delete('/api/users/999999')
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe('Sorry Pal, Cannot Delete Non Existant User!')
                        });
                });
                it('status 400: INVALID PATH responds with an error message if the user you attempt to delete with an invalid id e.g. a word', () => {
                    return request(app)
                        .delete('/api/users/notAnId')
                        .expect(400)
                        .then((response) => {
                            expect(response.body.msg).toBe('No Can Do Pal, Bad Request!')
                        });
                });
            });

            describe("INVALID METHODS", () => {
                it("status 405: for invalid methods POST and PUT", () => {
                    const invalidMethods = ["post", "put"];

                    const promises = invalidMethods.map((method) => {
                        return request(app)[method]("/api/users/1")
                            .expect(405)
                            .then(({ body: { msg } }) => {
                                expect(msg).toBe("Nah Pal, Method Not Allowed!");
                            });
                    });
                    return Promise.all(promises);
                });
            });
        });

        describe("/orders", () => {
            describe("GET", () => {
                it("status 200: responds with status 200", () => {
                    return request(app).get("/api/orders").expect(200);
                });
                it("status 200: responds with an array", () => {
                    return request(app)
                        .get("/api/orders")
                        .expect(200)
                        .then(({ body: { orders } }) => {
                            expect(Array.isArray(orders)).toBe(true);
                            expect(orders).toHaveLength(4);
                        });
                });
                it("status 200: responds with the correct keys", () => {
                    return request(app)
                        .get("/api/orders")
                        .expect(200)
                        .then(({ body: { orders } }) => {
                            orders.forEach((order) => {
                                expect(order).toHaveProperty("order_id");
                                expect(order).toHaveProperty("shoe");
                                expect(order).toHaveProperty("username");
                                expect(order).toHaveProperty("price");
                                expect(order).toHaveProperty("order_date");
                                expect(order).toHaveProperty("shipped_date");
                                expect(order).toHaveProperty("returned_date");
                                expect(order).toHaveProperty("refund_date");
                            });
                        });
                });
                it("status 200: responds with an array of orders matching the username of the order specified in the request query", () => {
                    return request(app)
                        .get("/api/orders/?username=Atty")
                        .expect(200)
                        .then(({ body: { orders } }) => {
                            expect(Array.isArray(orders)).toBe(true);
                            expect(orders.length).toBe(3);
                            orders.forEach((order) => {
                                expect(order.username).toBe("Atty");
                            });
                        });
                });
                it("status 200: responds with an array of orders matching the shoe of the order specified in the request query", () => {
                    return request(app)
                        .get("/api/orders/?shoe=Bovver+Boot")
                        .expect(200)
                        .then(({ body: { orders } }) => {
                            expect(Array.isArray(orders)).toBe(true);
                            expect(orders.length).toBe(1);
                            orders.forEach((order) => {
                                expect(order.shoe).toBe("Bovver Boot");
                            });
                        });
                });
                it("status 200: sorts orders by order_date in descending order", () => {
                    return request(app)
                        .get("/api/orders/")
                        .expect(200)
                        .then(({ body: { orders } }) => {
                            expect(Array.isArray(orders)).toBe(true);
                            expect(orders).toBeSortedBy('order_date', { descending: true });
                        });
                });
                it("status 404: NOT FOUND responds with an error when username of order in query does not exist", () => {
                    return request(app)
                        .get("/api/orders/?username=wrong")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe(
                                "Sorry Pal, That Query Was Funky. Order Not Found!"
                            );
                        });
                });
                it("status 404: NOT FOUND responds with an error when shoe of order in query does not exist", () => {
                    return request(app)
                        .get("/api/orders/?shoe=wrong")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe(
                                "Sorry Pal, That Query Was Funky. Order Not Found!"
                            );
                        });
                });
                it("status 404: NOT FOUND responds with an error when number of order in query does not exist", () => {
                    return request(app)
                        .get("/api/orders/?nombre=Bovver+Boot")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe(
                                "Sorry Pal, That Query Was Funky. Order Not Found!"
                            );
                        });
                });
            });

            describe("POST", () => {
                it("status 201: responds with 201 for a successfully posted order", () => {
                    return request(app)
                        .post("/api/orders")
                        .send({
                            shoe: "Red Stiletto",
                            username: "Atty",
                            price: 50.00
                        })
                        .expect(201);
                });
                it("status 201: responds with the successfully posted order", () => {
                    return request(app)
                        .post("/api/orders")
                        .send({
                            shoe: "Red Stiletto",
                            username: "Atty",
                            price: 50.00
                        })
                        .expect(201)
                        .then(({ body }) => {
                            expect(body.order.shoe).toBe("Red Stiletto");
                            expect(body.order.username).toBe("Atty");
                            expect(body.order.price).toBe(50.00);
                            expect(body.order).toHaveProperty("order_id");
                            expect(body.order).toHaveProperty("order_date");
                            expect(body.order).toHaveProperty("shipped_date");
                            expect(body.order).toHaveProperty("returned_date");
                            expect(body.order).toHaveProperty("refund_date");
                        });
                });
                it("status 400: BAD REQUEST -> malformed body/ missing fields responds with an error message", () => {
                    return request(app)
                        .post("/api/orders")
                        .send({})
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("No Can Do Pal, Bad Request. Fix Ya Body!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if request fails schema validation", () => {
                    return request(app)
                        .post("/api/orders")
                        .send({
                            shoe: null,
                            username: null,
                            price: null,
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
                        return request(app)[method]("/api/orders")
                            .expect(405)
                            .then(({ body: { msg } }) => {
                                expect(msg).toBe("Nah Pal, Method Not Allowed!");
                            });
                    });
                    return Promise.all(promises);
                });
            });
        });

        describe("/orders/:order_id", () => {
            describe("GET", () => {
                it("status 200: responds with status 200 when an order id is given", () => {
                    return request(app).get("/api/orders/1").expect(200);
                });
                it("status 200: responds with an array containing an order when an order id is given", () => {
                    return request(app)
                        .get("/api/orders/1")
                        .expect(200)
                        .then(({ body: { orders } }) => {
                            orders.forEach((order) => {
                                expect(order.username).toBe("Atty");
                                expect(order).toHaveProperty("order_id");
                                expect(order).toHaveProperty("shoe");
                                expect(order).toHaveProperty("username");
                                expect(order).toHaveProperty("price");
                                expect(order).toHaveProperty("order_date");
                                expect(order).toHaveProperty("shipped_date");
                                expect(order).toHaveProperty("returned_date");
                                expect(order).toHaveProperty("refund_date");
                            });
                        });
                });
                it("status 404: NOT FOUND -> responds with an error message if the requested order does not exist", () => {
                    return request(app)
                        .get("/api/orders/999")
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe("Sorry Pal, Order Not Found!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if the order_id is invalid", () => {
                    return request(app)
                        .get("/api/orders/notAnId")
                        .expect(400)
                        .then((response) => {
                            expect(response.body.msg).toBe("No Can Do Pal, Bad Request!");
                        });
                });
            });

            describe("PATCH", () => {
                it("status 200: responds with status 200", () => {
                    return request(app)
                        .patch("/api/orders/1")
                        .send({ shipped_date: "2017-12-11T12:56:33.798Z" })
                        .expect(200);
                });
                it("status 200: responds with the specified order, with a patched shipped_date", () => {
                    return request(app)
                        .patch("/api/orders/1")
                        .send({ shipped_date: "2017-12-11T12:56:33.798Z" })
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.order.shipped_date).toBe("2017-12-11T12:56:33.798Z");
                            expect(body.order.returned_date).toBe("2017-12-10T12:56:33.798Z");
                            expect(body.order.refund_date).toBe("2017-12-11T12:56:33.798Z");
                        });
                });
                it("status 200: responds with the specified order, with a patched returned_date", () => {
                    return request(app)
                        .patch("/api/orders/1")
                        .send({ returned_date: "2017-12-11T12:56:33.798Z" })
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.order.returned_date).toBe("2017-12-11T12:56:33.798Z");
                            expect(body.order.shipped_date).toBe("2017-12-10T12:56:33.798Z");
                            expect(body.order.refund_date).toBe("2017-12-11T12:56:33.798Z");
                        });
                });
                it("status 200: responds with the specified order, with a patched refund_date", () => {
                    return request(app)
                        .patch("/api/orders/1")
                        .send({ refund_date: "2017-12-11T12:56:33.798Z" })
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.order.refund_date).toBe("2017-12-11T12:56:33.798Z");
                            expect(body.order.shipped_date).toBe("2017-12-10T12:56:33.798Z");
                            expect(body.order.returned_date).toBe("2017-12-10T12:56:33.798Z");
                        });
                });
                it("status 404: NOT FOUND responds with an error message if the requested order does not exist", () => {
                    return request(app)
                        .patch("/api/orders/9999")
                        .send({ shipped_date: "2017-12-11T12:56:33.798Z" })
                        .expect(404)
                        .then((response) => {
                            expect(response.body.msg).toBe("Sorry Pal, Order Not Found!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if the order_id is invalid", () => {
                    return request(app)
                        .patch("/api/orders/notAnId")
                        .send({ shipped_date: "2017-12-11T12:56:33.798Z" })
                        .expect(400)
                        .then((response) => {
                            expect(response.body.msg).toBe("No Can Do Pal, Bad Request!");
                        });
                });
                it("status 400: BAD REQUEST -> malformed body/ missing fields responds with an error message", () => {
                    return request(app)
                        .patch("/api/orders/1")
                        .send({})
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("No Can Do Pal, Bad Request. Fix Ya Body!");
                        });
                });
                it("status 400: BAD REQUEST -> responds with an error message if request fails schema validation", () => {
                    return request(app)
                        .patch("/api/orders/1")
                        .send({
                            shipped_date: null,
                        })
                        .expect(400)
                        .then(({ body: { msg } }) => {
                            expect(msg).toBe("No Can Do Pal, Bad Request. Fix Ya Body!");
                        });
                });
            });

            describe("INVALID METHODS", () => {
                it("status 405: for invalid methods POST, DELETE and PUT", () => {
                    const invalidMethods = ["post", "put", "delete"];

                    const promises = invalidMethods.map((method) => {
                        return request(app)[method]("/api/orders/1")
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