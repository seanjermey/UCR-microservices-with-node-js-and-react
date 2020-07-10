import { Message } from "node-nats-streaming";
import {
  AbstractEventListener,
  EventSubjects,
  OrderCancelledEvent,
} from "@sjtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

class OrderCancelledListener extends AbstractEventListener<
  OrderCancelledEvent
> {
  readonly subject = EventSubjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // set orderId and save ticket
    await ticket.set({ orderId: undefined }).save();

    // publish ticket updated event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}

export { OrderCancelledListener };
