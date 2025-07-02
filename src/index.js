import mongoose from 'mongoose'
import express from 'express'
import BookingRouter from '../src/routers/booking.router.js'
import ContainerRouter from '../src/routers/container.router.js'
import WhatsappRouter from '../src/routers/whatsapp.router.js'
import 'dotenv/config'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cors())
app.get('/', (req,res) => {
    res.send('Hello World')
})

// console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('db connected succesfully')
    app.use('/api',BookingRouter)
    app.use('/api',ContainerRouter)
    app.use('/api', WhatsappRouter)
    app.use('/uploads', express.static('uploads'));

    app.listen(5000, () => {
        console.log(`Server is running on port ${5000}`);
        
    })
    
}).catch((e) => {
        console.log("err=>",e);
        
    });
