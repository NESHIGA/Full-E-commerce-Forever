import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRouter.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000

connectCloudinary()

// Middlewares
app.use(express.json())

const allowedOrigins = [
    'https://e-commerce-forever-frontend-new.vercel.app',
    'https://e-commerce-forever-admin-silk.vercel.app',
    'https://backend-full-e-commerce-forever.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
]

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'token'
    ],
    exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 86400
}))

// MongoDB connection
app.use(async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (error) {
        console.error("❌ Database connection failed:", error.message)

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        })
    }
})

app.use(express.urlencoded({ extended: true }))

// API endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

// Test route
app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
    console.log('Server started on PORT : ' + port)
})