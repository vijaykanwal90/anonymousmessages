import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
  _id:string;
}
const MessageScehma: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  // verifyCode: string;
  // verifyCodeExpiry: Date;
  // isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}
const UserScehma: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  // verifyCode: {
  //   type: String,
  //   // required: [true, "verify code is required"],
  // },
  // verifyCodeExpiry: {
  //   type: Date,
  //   // required: [true, "verify code expirey is required"],
  // },
  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  isAcceptingMessages: {
    default: true,
    type: Boolean,
  },
  messages: [MessageScehma],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserScehma);

  export default UserModel;