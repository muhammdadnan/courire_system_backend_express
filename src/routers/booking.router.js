import express from 'express'
import {addBookingController,getBookingInvoicesController,getAllBookingController} from '../controllers/booking.controller.js'
const router = express.Router() 

router.post('/addBooking', addBookingController)
router.get("/allBookingInvoiceNo",getBookingInvoicesController)
router.get("/bookings",getAllBookingController)
export default router