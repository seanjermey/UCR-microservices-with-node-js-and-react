import { Message } from "node-nats-streaming";
import {
  AbstractEventListener,
  EventSubjects,
  OrderCreatedEvent,
} from "@sjtickets/common";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

class OrderCreatedListener extends AbstractEventListener<OrderCreatedEvent> {
  readonly subject = EventSubjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: new Date(data.expiresAt).getTime() - new Date().getTime(),
      }
    );

    msg.ack();
  }
}

export { OrderCreatedListener };
