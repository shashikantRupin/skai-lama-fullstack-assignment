import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  buffer: {
    type: Buffer,
    required: true,
  },
});

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    files: [fileSchema], 
    status: {
      type: String,
      enum: ["active", "completed", "processing"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);
