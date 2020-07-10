import request from "supertest";
import { app } from "../../app";

const CURRENT_URL = "/api/users/current";
const VALID_EMAIL = "test@test.com";
const VALID_PASSWORD = "password";

it("returns current user if authenticated", async () => {
  const cookie = (await global.register(VALID_EMAIL, VALID_PASSWORD)).get(
    "Set-Cookie"
  );

  const response = await request(app)
    .get(CURRENT_URL)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual(VALID_EMAIL);
});

it("returns null if not authenticated", async () => {
  const response = await request(app).get(CURRENT_URL).send().expect(200);

  expect(response.body.currentUser).toEqual(null);
});
