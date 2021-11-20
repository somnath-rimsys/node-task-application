const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../src/app");
const User = require("../src/app/models/user");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Somnath Sardar",
  email: "somnath96sardar@gmail.com",
  password: "somnath@123",
  age: 25,
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};
const userTwo = {
  name: "Rabin Sardar",
  email: "somsardar96@gmail.com",
  password: "rabin@123",
  age: 27,
};

beforeAll(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

// test("Should upload user profile image", async () => {
//   await request(app)
//     .post("/user/profile/avatar")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .attach("avatar", "test/fixtues/profile-pic.jpg")
//     .expect(200);
// });

test("Should create a new user", async () => {
  await request(app).post("/user/create").send(userTwo).expect(201);
});

test("Should login exiting user", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/user/login")
    .send({
      email: userOne.email,
      password: "ldjnfekfbkubib",
    })
    .expect(400);
});

test("Should get user profile.", async () => {
  await request(app)
    .get("/user/profile")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get user profile not authenticated", async () => {
  await request(app).get("/user/profile").send().expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/user/delete")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not delete account for user", async () => {
  await request(app).delete("/user/delete").send().expect(401);
});
