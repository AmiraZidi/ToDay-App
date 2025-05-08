const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    responsables: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    status: {
      type: String,
      enum: ["En attente", "En cours", "Complétée"],
      default: "En attente",
    },
    priority: {
      type: Number,
      enum: [1, 2, 3], // 1: Basse, 2: Moyenne, 3: Haute
      default: 1,
    },
    end_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
