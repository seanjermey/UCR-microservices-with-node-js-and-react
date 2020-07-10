import { Message } from "node-nats-streaming";
import {
  AbstractEventListener,
  EventSubjects,
  TicketCreatedEvent,
} from "@sjtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

class TicketCreatedListener extends AbstractEventListener<TicketCreatedEvent> {
  readonly subject = EventSubjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    await new Ticket({
      id,
      title,
      price,
    }).save();

    msg.ack();
  }
}

export { TicketCreatedListener };
