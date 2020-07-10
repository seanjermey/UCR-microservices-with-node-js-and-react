import mongoose, { Schema, Document } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@sjtickets/common";

export { OrderStatus };

export interface OrderAttributes {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

export interface OrderDocument extends Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<OrderDocument | null>;
}

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
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
    super(
      attrs && {
        _id: attrs.id,
        ...attrs,
      }
    );
  }

  static async findByEvent(event: {
    id: string;
    version: number;
  }): Promise<OrderDocument | null> {
    return OrderModel.findOne({
      _id: event.id,
      version: event.version - 1,
    });
  }
}

export { Order };
