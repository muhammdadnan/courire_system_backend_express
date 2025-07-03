import express from 'express'
import {addBookingController,getBookingController} from '../controllers/booking.controller.js'
const router = express.Router() 

router.post('/addBooking', addBookingController)
router.get("/allBooking",getBookingController)
export default router