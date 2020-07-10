import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async (done) => {
  const ticket = await new Ticket({
    title: "title",
    price: 20,
    userId: "123",
  }).save();

  const instanceOne = await Ticket.findById(ticket.id);
  const instanceTwo = await Ticket.findById(ticket.id);

  instanceOne!.set({ price: 10 });
  instanceTwo!.set({ price: 15 });

  await instanceOne!.save();

  try {
    await instanceTwo!.save();
  } catch (err) {
    return done();
  }

  throw new Error("Should not react this point");
});

it("increments the version number on multiple saves", async () => {
  const ticket = new Ticket({
    title: "title",
    price: 20,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
