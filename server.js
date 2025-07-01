import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './Database/Database.js';
import authRouter from "./Routers/authroutes.js"; 
import UserRouter from "./Routers/Userroutes.js";


dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));

const PORT = process.env.PORT || 5000;

// Test SQL Server connection on startup
connectDB();

// Routes
app.use('/auth', authRouter);

app.use('/user', UserRouter);


// Root route
app.get('/', (req, res) => {
  res.send('Hello, World! SQL Server is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
