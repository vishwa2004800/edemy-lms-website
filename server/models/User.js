import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true }, // Custom ID (e.g., from Clerk)
        name: { type: String, required:true }, // Optional field with default value
        email: { type: String, required:true }, // Optional field with default value
        imageUrl: { type: String, required:true}, // Optional field with default value
        enrolledCourses: [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Course'
            }
        ],
    }, 
    { 
        timestamps: true
     } // Automatically add createdAt and updatedAt fields
);

const User = mongoose.model('User', userSchema);

export default User;