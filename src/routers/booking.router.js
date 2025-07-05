import express from 'express'
import {addBookingController,getBookingInvoicesController,getAllBookingController,deleteBookingController} from '../controllers/booking.controller.js'
const router = express.Router() 

router.post('/addBooking', addBookingController)
router.get("/allBookingInvoiceNo",getBookingInvoicesController)
router.get("/bookings",getAllBookingController)
router.delete("/deleteBooking",deleteBookingController)
export default router