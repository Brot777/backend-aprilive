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

// service conversation schema
const serviceConversationSchema = new mongoose.Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    ServiceProviderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  options
);

const serviceConversationModel = conversationModel.discriminator(
  "ServiceConversation",
  serviceConversationSchema
);

export { conversationModel, serviceConversationModel };
