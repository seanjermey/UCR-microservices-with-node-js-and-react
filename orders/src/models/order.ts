import mongoose, { Schema, Document } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TicketDocument } from "./ticket";
import { OrderStatus } from "@sjtickets/common";

export { OrderStatus };

export interface OrderAttributes {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

export interface OrderDocument extends Document, OrderAttributes {
  version: number;
}

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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
OrderSchema.set("versionKey", "version");
OrderSchema.plugin(updateIfCurrentPlugin);

const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);

class Order extends OrderModel {
  constructor(attrs: OrderAttributes) {
    super(attrs);
  }
}

export { Order };
