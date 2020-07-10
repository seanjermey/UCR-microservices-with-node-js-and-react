import { Message, Stan } from "node-nats-streaming";
import { EventSubjects } from "./event-subjects";

interface Event {
  subject: EventSubjects;
  data: any;
}

abstract class AbstractEventListener<T extends Event> {
  /**
   *
   */
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  protected ackWait: number = 5 * 1000;

  /**
   * Constructor
   *
   * @param client
   */
  constructor(protected client: Stan) {}

  /**
   *
   * @param data
   * @param msg
   */
  abstract onMessage(data: T["data"], msg: Message): void;

  /**
   * Configure subscription options
   */
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  /**
   * Register listener
   */
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      this.onMessage(this.parseMessage(msg), msg);
    });
  }

  /**
   * Parse message response
   *
   * @param msg
   */
  parseMessage(msg: Message) {
    const data = msg.getData();

    return JSON.parse(typeof data === "string" ? data : data.toString("utf8"));
  }
}

export { AbstractEventListener };
