import mongoose, { model, Schema } from "mongoose";

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
    typeConversation: {
      type: {
        type: String,
        default: "",
      },
      referenceId: {
        type: Schema.Types.ObjectId,
      },
      senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Conversation", conversationSchema);
