// models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  dateOptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "DateOption"
  }],
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending"
    }
  }],
  pollQuestion: {
    type: String,
    default: "Choose a suitable date"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default Event;