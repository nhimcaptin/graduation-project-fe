import mongoose from "mongoose";
const DentalKnowledgeSchema = new mongoose.Schema(
  {  
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String,
      require: true
    },
    image:{
        type: String
    },
  },
  { timestamps: true }
);

export default mongoose.model("DentalKnowledge", DentalKnowledgeSchema);
