import express from 'express'
import orderController from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter=express.Router()

// Admin Feature 
orderRouter.post('/list',adminAuth,orderController.allOrders)
orderRouter.post('/status',adminAuth,orderController.updateStatus)

// Payment Features
orderRouter.post('/place',authUser,orderController.placeOrder)
orderRouter.post('/stripe',authUser,orderController.placeOrderStripe)

// User Feature
orderRouter.post('/userorders',authUser,orderController.userOrders)

// verify payment
orderRouter.post('/verifyStripe',authUser,orderController.verifyStripe)
export default orderRouter;