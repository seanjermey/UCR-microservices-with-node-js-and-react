import mongoose, { Schema, Document } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocument extends Document, TicketAttributes {
  version: number;
  orderId?: string;
}

const TicketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
TicketSchema.set("versionKey", "version");
TicketSchema.plugin(updateIfCurrentPlugin);

const TicketModel = mongoose.model<TicketDocument>("Ticket", TicketSchema);

class Ticket extends TicketModel {
  constructor(attrs: TicketAttributes) {
    super(attrs);
  }
}

export { Ticket };
