
import mongoose from "mongoose"
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected'))
        mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err))
        
        await mongoose.connect(`${process.env.MONGODB_URI}/EdemyLMS`)
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection failed:', error)
        process.exit(1)
    }
}

export default connectDB