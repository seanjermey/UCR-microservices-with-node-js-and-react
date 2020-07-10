import mongoose, { Schema, Document } from "mongoose";

interface UserAttributes {
  email: string;
  password: string;
}

interface UserDocument extends Document, UserAttributes {}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

const UserModel = mongoose.model<UserDocument>("User", UserSchema);

class User extends UserModel {
  constructor(attrs: UserAttributes) {
    super(attrs);
  }
}

export { User };
