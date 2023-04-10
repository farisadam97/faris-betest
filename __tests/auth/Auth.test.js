const mongoose = require("mongoose");
const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../../app");

require("dotenv").config();

const mockAccount = {
  userName: `test${Date.now()}`,
  password: "testingg",
  fullName: faker.name.fullName(),
  accountNumber: faker.random.numeric(8),
  emailAddress: faker.internet.email(),
};

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URL);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("first", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(mockAccount);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Account has been created");
  });
  it("should login user to server", async () => {
    const res = await request(app).post("/api/auth/login").send({
      userName: mockAccount.userName,
      password: mockAccount.password,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Login success");
  });
});
