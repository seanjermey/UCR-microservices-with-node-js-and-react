import { Message } from "node-nats-streaming";
import {
  AbstractEventListener,
  EventSubjects,
  OrderCancelledEvent,
} from "@sjtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order, OrderStatus } from "../../models/order";

class OrderCancelledListener extends AbstractEventListener<
  OrderCancelledEvent
> {
  readonly subject = EventSubjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findByEvent(data);

    if (!order) {
      throw new Error("Order not found");
    }

    await order
      .set({
        status: OrderStatus.Cancelled,
      })
      .save();

    msg.ack();
  }
}

export { OrderCancelledListener };
