import mongoose from "mongoose";


const ChatSchema = new mongoose.Schema(
  {
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, 
    receiverId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    messages: [
      {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
        message: { type: String, required: true, trim: true },
      },
    ],
  },
  { timestamps: true }
);
    const chatModel = mongoose.models.Chat || mongoose.model('Chat',ChatSchema )
    export default chatModel;


