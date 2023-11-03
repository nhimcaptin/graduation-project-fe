import mongoose from "mongoose";
const DentalKnowledgeSchema = new mongoose.Schema(
  {  
    name: { 
      type: String, 
      required: true 
    },
    descreption: { 
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
