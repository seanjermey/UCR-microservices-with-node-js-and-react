import request from "supertest";
import { app } from "../../app";

const LOGOUT_URL = "/api/users/logout";
const VALID_EMAIL = "test@test.com";
const VALID_PASSWORD = "password";

it("returns a 200 on logout attempt", async () => {
  await global.register(VALID_EMAIL, VALID_PASSWORD);

  await request(app).post(LOGOUT_URL).send().expect(200);
});

it("removes the cookie on logout", async () => {
  await global.register(VALID_EMAIL, VALID_PASSWORD);

  const response = await request(app).post(LOGOUT_URL).send({});
  expect(response.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
