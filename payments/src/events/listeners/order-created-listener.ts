import { Message } from "node-nats-streaming";
import {
  AbstractEventListener,
  EventSubjects,
  OrderCreatedEvent,
} from "@sjtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

class OrderCreatedListener extends AbstractEventListener<OrderCreatedEvent> {
  readonly subject = EventSubjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await new Order({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    }).save();

    msg.ack();
  }
}

export { OrderCreatedListener };
