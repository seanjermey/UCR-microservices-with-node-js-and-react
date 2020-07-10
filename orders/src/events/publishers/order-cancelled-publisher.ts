import {
  AbstractEventPublisher,
  OrderCancelledEvent,
  EventSubjects,
} from "@sjtickets/common";

class OrderCancelledPublisher extends AbstractEventPublisher<
  OrderCancelledEvent
> {
  readonly subject = EventSubjects.OrderCancelled;
}

export { OrderCancelledPublisher };
