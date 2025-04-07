import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    courseId:{type:mongoose.Schema.Types.ObjectId,
      ref:'Course'
      ,
      required:true
    },

    userId:{
      type:String,
      ref:'User',
      required:true
    },
    amount:{type: Number , required:true},
    status:{
      type:String,
      enum:['Pending','Completed','Failed'], default:'Pending'
    }
  },
  {
    timestamps:true
  }
);

// Export as ES6 module
const Purchase = mongoose.model("Purchase", PurchaseSchema);
export default Purchase;
