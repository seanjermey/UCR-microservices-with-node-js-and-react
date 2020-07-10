import { EventSubjects } from "./event-subjects";

export interface PaymentCreatedEvent {
  subject: EventSubjects.PaymentCreated;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
