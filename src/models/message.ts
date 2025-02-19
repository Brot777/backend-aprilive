import mongoose, { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    value: {
      type: String,
      default: "",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    discriminatorKey: "type",
    collection: "messages",
  }
);

const messageModel = model("Message", messageSchema);

// quote schema
const quoteSchema = new mongoose.Schema({
  totalAmount: {
    type: String,
    default: "",
  },

  estimatedDeliveryDate: {
    type: Date,
    default: new Date(),
  },
});
const quoteModel = messageModel.discriminator("Quote", quoteSchema);
export { quoteModel, messageModel };
