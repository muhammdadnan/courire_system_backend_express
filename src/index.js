import mongoose from 'mongoose';
import express from 'express';
import BookingRouter from '../src/routers/booking.router.js';
import ContainerRouter from '../src/routers/container.router.js';
import WhatsappRouter from '../src/routers/whatsapp.router.js';
import TrackingRouter from '../src/routers/tracking.router.js';
import AuthRouter from '../src/routers/auth.router.js';
import UserRouter from '../src/routers/user.router.js';
import CountryRouter from '../src/routers/country.router.js';
import ContainerNumberRouter from '../src/routers/container_number.router.js';
import 'dotenv/config';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// -------------------
// ✅ MongoDB Connection (serverless-safe)
// -------------------
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
  }
}

// connect once on startup
await connectDB();

// middleware: ensure connection on any later request
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectDB();
  }
  next();
});

// -------------------
// Routes
// -------------------
app.get('/', (req, res) => {
  res.send('✅ Server is up and running! 🚀');
});

app.use('/api', BookingRouter);
app.use('/api', ContainerRouter);
app.use('/api', TrackingRouter);
app.use('/api', WhatsappRouter);
app.use('/api/auth', AuthRouter);
app.use('/api', UserRouter);
app.use('/api', CountryRouter);
app.use('/api', ContainerNumberRouter);
app.use('/uploads', express.static('uploads'));

// -------------------
// ✅ Export for Vercel
// -------------------
export default app;

// -------------------
// ✅ Local Development Mode
// -------------------
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;

  // Connect Mongo and start server
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log(`✅ Server is running on port ${port} | MongoDB Connected`);
      app.listen(port);
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err);
    });
}
