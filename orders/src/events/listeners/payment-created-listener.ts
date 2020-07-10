import { Message } from "node-nats-streaming";
import {
  AbstractEventListener,
  EventSubjects,
  PaymentCreatedEvent,
} from "@sjtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order, OrderStatus } from "../../models/order";

class PaymentCreatedListener extends AbstractEventListener<
  PaymentCreatedEvent
> {
  readonly subject = EventSubjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order
      .set({
        status: OrderStatus.Complete,
      })
      .save();

    msg.ack();
  }
}

export { PaymentCreatedListener };
