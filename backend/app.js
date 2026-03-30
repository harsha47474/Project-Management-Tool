import express from 'express'
import dotenv from 'dotenv'
import connectDB from './src/lib/db.js';

connectDB();

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
    res.send("Project management tool");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});