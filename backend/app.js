import express from 'express'
import connectDB from './src/lib/db.js';
import authRoutes from './src/routes/authRoutes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorMiddleware } from './src/middlewares/error.handler.js';
import projectRoutes from './src/routes/projectRoutes.js'
import taskRoutes from './src/routes/taskRoutes.js'

import dotenv from 'dotenv'
dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 5001;
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", taskRoutes)

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

app.use(errorMiddleware);