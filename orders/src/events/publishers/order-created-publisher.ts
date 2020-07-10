import {
  AbstractEventPublisher,
  OrderCreatedEvent,
  EventSubjects,
} from "@sjtickets/common";

class OrderCreatedPublisher extends AbstractEventPublisher<
  OrderCreatedEvent
> {
  readonly subject = EventSubjects.OrderCreated;
}

export { OrderCreatedPublisher };
