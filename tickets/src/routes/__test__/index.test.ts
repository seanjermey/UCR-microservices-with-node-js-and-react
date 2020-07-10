import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
  return request(app).post("/api/tickets").set("Cookie", global.login()).send({
    title: "ticket",
    price: 20,
  });
};

it("can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  let response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
