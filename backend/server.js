import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { logger, logEvents } from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import connectDB from './config/dbConn.js';
import userRoutes from './routes/userRoutes.js';
import codeRoutes from './routes/codeRoutes.js';
import authRoutes from './routes/authRoutes.js'
import emailRoutes from './routes/emailRoutes.js'
import eventRoutes from "./routes/eventRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import wishlistItemRoutes from "./routes/wishlistItemRoutes.js";
import paymentItemRoutes from "./routes/paymentItemRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/codes', codeRoutes)
app.use('/api/emails', emailRoutes)
app.use("/api/payment", paymentRoutes)
app.use('/api/events', eventRoutes);
app.use("/api/applications",applicationRoutes)
app.use("/api/documents",documentRoutes)
app.use("/api/wishlist",wishlistItemRoutes)
app.use("/api/paymentItems", paymentItemRoutes)
app.use("/api/messages",messageRoutes)

app.all('*', (req, res) => {
    res.status(404).json({ message: 'Unknown URL' })
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})

