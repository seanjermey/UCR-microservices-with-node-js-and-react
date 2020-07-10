import { EventSubjects } from "./event-subjects";

export interface ExpirationCompleteEvent {
  subject: EventSubjects.ExpirationComplete;
  data: {
    orderId: string;
  };
}
