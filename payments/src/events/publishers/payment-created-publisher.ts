import {
  AbstractEventPublisher,
  PaymentCreatedEvent,
  EventSubjects,
} from "@sjtickets/common";

class PaymentCreatedPublisher extends AbstractEventPublisher<
  PaymentCreatedEvent
> {
  readonly subject = EventSubjects.PaymentCreated;
}

export { PaymentCreatedPublisher };
