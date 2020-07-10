import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { nats } from "../nats-client";

interface QueuePayload {
  orderId: string;
}

const expirationQueue = new Queue<QueuePayload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(nats.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
