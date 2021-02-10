const mongoose = require("mongoose");

const Task = mongoose.model("Tasks", {
  description: {
    type: String,
    trim: true,
    required: true,
    validate(value) {
      if (!value) {
        throw new Error("You need to enter a description");
      }
    },
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = Task;
