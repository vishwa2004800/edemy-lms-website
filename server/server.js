import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks} from './controllers/webhooks.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoutes.js'
import userRouter from './routes/userRoutes.js'
import noteRoutes from "./routes/noteRoutes.js"



const app = express()

await connectDB()
await connectCloudinary()

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))
app.use(clerkMiddleware())

app.post('/stripe', express.raw({type:'application/json'}), stripeWebhooks)


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(clerkMiddleware())


app.get('/', (req, res) => res.send("API Working"))
// app.post('/stripe', express.raw({type:'application/json'}), stripeWebhooks)

app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator',express.json(),educatorRouter)
app.use('/api/course', express.json(),courseRouter)
app.use('/api/user', express.json(), userRouter)
app.use("/api/notes", express.json(),noteRoutes)





// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: err.message 
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})