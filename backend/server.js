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
const app= express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
//middlewares
app.use(express.json())
const allowedOrigins = [
    'https://e-commerce-forever-frontend-new.vercel.app',  // Your new frontend URL
    'https://backend-full-e-commerce-forever.vercel.app',   // Backend itself
    'http://localhost:5173',   // Local Vite
    'http://localhost:3000',   // Local React
    'http://localhost:4000'    // Local Backend
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('❌ CORS blocked for origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 86400 // 24 hours
}))

// api endpoints
app.use('/api/user',userRouter)

app.use(express.urlencoded({ extended: true }));
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port));
