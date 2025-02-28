import mongoose, { model, Schema } from "mongoose";

const options = {
  timestamps: true,
  versionKey: false,
  discriminatorKey: "type",
  collection: "conversations",
};

// conversation schema
const conversationSchema = new Schema(
  {
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: mongoose.Types.ObjectId,
    },
  },
  options
);
const conversationModel = model("Conversation", conversationSchema);


export { conversationModel};
