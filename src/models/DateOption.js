// models/DateOption.js
import mongoose from "mongoose";

const dateOptionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

const DateOption = mongoose.models.DateOption || mongoose.model("DateOption", dateOptionSchema);
export default DateOption;