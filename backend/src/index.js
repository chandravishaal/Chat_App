import express from 'express';//web framework
import dotenv from 'dotenv';//environment variables
import cookieParser from 'cookie-parser';//parse Cookie header and populate req.cookies with an object keyed by the cookie names


import authRoutes from './routes/auth.routes.js';
import {connectDB} from './lib/db.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT;


app.use(express.json());    // Parse/extract JSON bodies (as sent by API clients)
app.use(cookieParser());    // Parse Cookie header and populate req.cookies with an object keyed by the cookie names


app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  console.log('Server is running on PORT:', PORT);
  connectDB();
});






















// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send({
//     status: 'error',
//     message: 'Something went wrong!',
//     error: err.message
//   });
// });
