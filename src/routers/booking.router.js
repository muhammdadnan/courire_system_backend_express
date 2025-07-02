import express from 'express'
import {addBookingController,getSingleBooking,getBookingController} from '../controllers/booking.controller.js'
const router = express.Router() 

router.post('/addBooking', addBookingController)
router.get('/singleBooking',getSingleBooking)

router.get("/allBooking",getBookingController)
export default router