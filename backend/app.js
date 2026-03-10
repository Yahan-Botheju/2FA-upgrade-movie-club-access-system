import express from 'express';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import userRouter from './routers/user.route.js';
import cors from 'cors';

const app = express();
connectDB();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

//user cors
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));

//user route
app.use('/api/users', userRouter);


export default app;