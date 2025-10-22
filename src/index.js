import mongoose from 'mongoose'
import express from 'express'
import BookingRouter from '../src/routers/booking.router.js'
import ContainerRouter from '../src/routers/container.router.js'
import WhatsappRouter from '../src/routers/whatsapp.router.js'
import TrackingRouter from '../src/routers/tracking.router.js'
import AuthRouter from '../src/routers/auth.router.js'
import UserRouter from '../src/routers/user.router.js'
import CountryRouter from '../src/routers/country.router.js'
import ContainerNumberRouter from '../src/routers/container_number.router.js'
import 'dotenv/config'
import cors from 'cors'
//import { use } from 'react'
const app = express()
app.use(express.json())
app.use(cors())
app.get('/', (req,res) => {
    res.send('Server is up and running!!!!')
})
 app.use('/api',BookingRouter)
    app.use('/api',ContainerRouter)
    app.use('/api', TrackingRouter)
    app.use('/api', WhatsappRouter)
     app.use('/api/auth',AuthRouter)
     app.use('/api',UserRouter)
     app.use('/api',CountryRouter)
     app.use('/api',ContainerNumberRouter)
    app.use('/uploads', express.static('uploads'));
// console.log(process.env.MONGO_URI);
// mongoose.connect(process.env.MONGO_URI).then(() => {
//     console.log('db connected succesfully')
   
    
//     const port = process.env.PORT || 5000
//     app.listen(port, () => {
//         console.log(`Server is running on port ${5000}`);
        
//     })
    
// }).catch((e) => {
//         console.log("err=>",e);
        
//     });


let isConnected = false;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;
    console.log('DB Connected');
  } catch (error) {
   console.log("DB Connection Error:", error);
    console.error("DB Connection Error:", error);
  }
}

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectDB();
  }
  next();
});
connectDB()
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
   
});
