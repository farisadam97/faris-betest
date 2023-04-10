const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const { faker } = require("@faker-js/faker");
const accountModel = require("../../Model/Account.model");
const userInfoModel = require("../../Model/UserInfo.model");

const mockAccount = {
  userName: `test${Date.now()}`,
  password: "testingg",
  fullName: faker.name.fullName(),
  accountNumber: faker.random.numeric(8),
  emailAddress: faker.internet.email(),
};

describe("Account route function with protected jwt to access", () => {
  let token, account, userInfo;

  beforeAll(async () => {
    // Create a account and generate JWT token

    const userInfoBody = {
      fullName: mockAccount.fullName,
      accountNumber: mockAccount.accountNumber,
      emailAddress: mockAccount.emailAddress,
      registrationNumber: Math.floor(
        new Date().getTime() / 10 + Math.random() * 10
      ).toString(),
    };

    userInfo = await userInfoModel.create(userInfoBody);

    account = await accountModel.create({
      userName: mockAccount.userName,
      password: mockAccount.password,
      userId: userInfo.id,
    });
    token = jwt.sign(
      {
        id: account.__id,
        userName: account.userName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
  });

  afterAll(async () => {
    // Remove the account
    await accountModel.findByIdAndRemove(account._id);
    await mongoose.connection.close();
  });

  it("should return Unauthorized if no token is provided", async () => {
    const res = await request(app).get("/api/account/").expect(401);
    expect(res.body).toEqual({ message: "Unauthorized" });
  });
  it("should get all account", async () => {
    const res = await request(app)
      .get("/api/account/")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty("data");
  });
  it("should get account by id", async () => {
    const res = await request(app)
      .get(`/api/account/${account.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty("data");
  });
  it("should get account by registration number", async () => {
    const res = await request(app)
      .get(`/api/account/search/registration/${userInfo.registrationNumber}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty("data");
  });
});
