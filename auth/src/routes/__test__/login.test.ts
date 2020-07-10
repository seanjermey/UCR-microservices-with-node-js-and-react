import request from "supertest";
import { app } from "../../app";

const REGISTER_URL = "/api/users/register";
const LOGIN_URL = "/api/users/login";
const VALID_EMAIL = "test@test.com";
const INVALID_EMAIL = "invalid";
const INCORRECT_EMAIL = "incorrect@test.com";
const VALID_PASSWORD = "password";
const INVALID_PASSWORD = "1";
const INCORRECT_PASSWORD = "incorrect";

it("returns a 400 on login attempt with no account", async () => {
  await request(app)
    .post(LOGIN_URL)
    .send({
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
    })
    .expect(400);
});

it("returns a 400 with an invalid email or password", async () => {
  await request(app)
    .post(LOGIN_URL)
    .send({
      email: INVALID_EMAIL,
      password: VALID_PASSWORD,
    })
    .expect(400);

  await request(app)
    .post(LOGIN_URL)
    .send({
      email: VALID_EMAIL,
      password: INVALID_PASSWORD,
    })
    .expect(400);
});

it("returns a 400 with missing email or password", async () => {
  await request(app)
    .post(LOGIN_URL)
    .send({
      email: VALID_EMAIL,
    })
    .expect(400);

  await request(app)
    .post(LOGIN_URL)
    .send({
      password: VALID_PASSWORD,
    })
    .expect(400);
});

it("returns a 400 on login attempt with invalid credentials", async () => {
  await global.register(VALID_EMAIL, VALID_PASSWORD);

  await request(app)
    .post(LOGIN_URL)
    .send({
      email: INCORRECT_EMAIL,
      password: VALID_PASSWORD,
    })
    .expect(400);

  await request(app)
    .post(LOGIN_URL)
    .send({
      email: VALID_EMAIL,
      password: INCORRECT_PASSWORD,
    })
    .expect(400);
});

it("returns a 200 on successful login", async () => {
  await global.register(VALID_EMAIL, VALID_PASSWORD);

  await request(app)
    .post(LOGIN_URL)
    .send({
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
    })
    .expect(200);
});

it("returns a cookie on successful login", async () => {
  await global.register(VALID_EMAIL, VALID_PASSWORD);

  const response = await request(app).post(LOGIN_URL).send({
    email: VALID_EMAIL,
    password: VALID_PASSWORD,
  });

  expect(response.get("Set-Cookie")).toBeDefined();
});
