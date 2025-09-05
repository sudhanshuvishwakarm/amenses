import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  question: {
    type: String,
    required: true,
    default: "Choose a suitable date"
  },
  options: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "PollOption"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Poll = mongoose.models.Poll || mongoose.model("Poll", pollSchema);
export default Poll;