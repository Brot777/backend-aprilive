import mongoose, { model, Schema } from "mongoose";

const options = {
  timestamps: true,
  versionKey: false,
  discriminatorKey: "type",
  collection: "messages",
};

// message schema
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
  options
);

const messageModel = model("Message", messageSchema);

//  request quote schema
const requestQuoteSchema = new mongoose.Schema(
  {
    serviceTitle: {
      type: String,
      default: "",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  },
  options
);
const requestQuoteModel = messageModel.discriminator(
  "RequestQuote",
  requestQuoteSchema
);

// quote schema
const quoteSchema = new mongoose.Schema(
  {
    serviceTitle: {
      type: String,
      default: "",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    totalHours: {
      type: String,
    },
    pricePerHour: {
      type: String,
    },
    totalAmount: {
      type: String,
    },
    estimatedDeliveryDate: {
      type: Date,
      default: null,
      required: true,
    },
  },
  options
);
const quoteModel = messageModel.discriminator("Quote", quoteSchema);
export { quoteModel, messageModel, requestQuoteModel };
