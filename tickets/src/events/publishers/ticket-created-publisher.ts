import {
  AbstractEventPublisher,
  TicketCreatedEvent,
  EventSubjects,
} from "@sjtickets/common";

class TicketCreatedPublisher extends AbstractEventPublisher<
  TicketCreatedEvent
> {
  readonly subject = EventSubjects.TicketCreated;
}

export { TicketCreatedPublisher };
