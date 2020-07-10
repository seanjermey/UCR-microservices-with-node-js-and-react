import mongoose, { Schema, Document } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

export interface TicketAttributes {
  id?: any;
  title: string;
  price: number;
}

export interface TicketDocument extends Document, TicketAttributes {
  version: number;
  isReserved(): Promise<boolean>;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDocument | null>;
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
      min: 0,
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
    super(
      attrs && {
        _id: attrs.id,
        ...attrs,
      }
    );
  }

  async isReserved(): Promise<boolean> {
    const existingOrder = await Order.findOne({
      ticket: this,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });

    return !!existingOrder;
  }

  static async findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDocument | null> {
    return TicketModel.findOne({
      _id: event.id,
      version: event.version - 1,
    });
  }
}

export { Ticket };
