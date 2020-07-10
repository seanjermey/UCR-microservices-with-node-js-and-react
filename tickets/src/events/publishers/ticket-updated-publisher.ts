import {
  AbstractEventPublisher,
  TicketUpdatedEvent,
  EventSubjects,
} from "@sjtickets/common";

class TicketUpdatedPublisher extends AbstractEventPublisher<
  TicketUpdatedEvent
> {
  readonly subject = EventSubjects.TicketUpdated;
}

export { TicketUpdatedPublisher };
