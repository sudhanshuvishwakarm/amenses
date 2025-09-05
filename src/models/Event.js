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
    date: {
      type: Date,
      required: true
    },
    voters: [{
      type: String, // Store emails instead of ObjectId
      trim: true,
      lowercase: true
    }]
  }],
  participants: [{
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
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

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default Event;