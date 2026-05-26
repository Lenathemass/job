import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pins: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        height: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const Board = mongoose.model('Board', boardSchema);
export default Board;
