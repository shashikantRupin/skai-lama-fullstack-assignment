import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: String, 
  originalName: String, 
  fileType: String, 
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  buffer: Buffer, 
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
