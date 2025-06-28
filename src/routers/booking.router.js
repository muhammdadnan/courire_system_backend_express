import express from 'express'
import {addBookingController,getSingleBooking} from '../controllers/booking.controller.js'
const router = express.Router() 

router.post('/addBooking', addBookingController)
router.get('/singleBooking',getSingleBooking)

export default router