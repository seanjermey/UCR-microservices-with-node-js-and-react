import {
  AbstractEventPublisher,
  ExpirationCompleteEvent,
  EventSubjects,
} from "@sjtickets/common";

class ExpirationCompletePublisher extends AbstractEventPublisher<
  ExpirationCompleteEvent
> {
  readonly subject = EventSubjects.ExpirationComplete;
}

export { ExpirationCompletePublisher };
