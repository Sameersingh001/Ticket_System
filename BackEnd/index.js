import express from 'express';
import connectDB from './config/DB.js';
import cors from 'cors';



import authRoutes from './routes/authRoutes.js';
import seatRoutes from './routes/seatRoutes.js';


const app = express();



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', authRoutes);
app.use('/api', seatRoutes);


connectDB().then(() => {
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
});





