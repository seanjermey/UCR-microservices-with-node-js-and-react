import mongoose, { Schema, Document } from "mongoose";

export interface PaymentAttributes {
  orderId: string;
  stripeId: string;
}

export interface PaymentDocument extends Document, PaymentAttributes {}

const PaymentSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

const PaymentModel = mongoose.model<PaymentDocument>("Payment", PaymentSchema);

class Payment extends PaymentModel {
  constructor(attrs: PaymentAttributes) {
    super(attrs);
  }
}

export { Payment };
