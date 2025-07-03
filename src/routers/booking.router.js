import express from 'express'
import {addBookingController,getBookingController,getAllBookingController} from '../controllers/booking.controller.js'
const router = express.Router() 

router.post('/addBooking', addBookingController)
router.get("/allBooking",getBookingController)
router.get("/bookings",getAllBookingController)
export default router