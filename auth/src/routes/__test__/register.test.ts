const VALID_EMAIL = "test@test.com";
const INVALID_EMAIL = "invalid";
const VALID_PASSWORD = "password";
const INVALID_PASSWORD = "1";

it("returns a 400 with an invalid email or password", async () => {
  await global.register(INVALID_EMAIL, VALID_PASSWORD, 400);
  await global.register(VALID_EMAIL, INVALID_PASSWORD, 400);
});

it("returns a 400 with missing email or password", async () => {
  await global.register(VALID_EMAIL, undefined, 400);
  await global.register(undefined, VALID_PASSWORD, 400);
});

it("returns a 400 when email already registered", async () => {
  await global.register(VALID_EMAIL, VALID_PASSWORD);
  await global.register(VALID_EMAIL, VALID_PASSWORD, 400);
});

it("returns a 201 on successful registration", async () => {
  await global.register(VALID_EMAIL, VALID_PASSWORD);
});

it("returns a cookie on successful registration", async () => {
  const response = await global.register(VALID_EMAIL, VALID_PASSWORD);

  expect(response.get("Set-Cookie")).toBeDefined();
});
