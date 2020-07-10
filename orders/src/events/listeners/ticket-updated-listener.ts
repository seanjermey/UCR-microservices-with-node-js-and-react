import { Message } from "node-nats-streaming";
import {
  AbstractEventListener,
  EventSubjects,
  TicketUpdatedEvent,
} from "@sjtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

class TicketUpdatedListener extends AbstractEventListener<TicketUpdatedEvent> {
  readonly subject = EventSubjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent({
      id: data.id,
      version: data.version,
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    await ticket
      .set({
        title: data.title,
        price: data.price,
      })
      .save();

    msg.ack();
  }
}

export { TicketUpdatedListener };
