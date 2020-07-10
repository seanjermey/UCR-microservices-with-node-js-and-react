import { Stan } from "node-nats-streaming";
import { EventSubjects } from "./event-subjects";

interface Event {
  subject: EventSubjects;
  data: any;
}

abstract class AbstractEventPublisher<T extends Event> {
  /**
   *
   */
  abstract subject: T["subject"];

  /**
   * Constructor
   *
   * @param client
   */
  constructor(protected client: Stan) {}

  /**
   *
   * @param data
   */
  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }

        console.log("Event Published to subject", this.subject);

        resolve();
      });
    });
  }
}

export { AbstractEventPublisher };
