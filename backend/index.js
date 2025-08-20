import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import cookieParser from 'cookie-parser';
import ConnectDB from './db/db.js';
import analysisRoute from './routes/analysis.js';
import authRoute from './routes/auth.js';
import { serve } from 'inngest/express';
import { inngest } from './inngest/client.js';
import { OnRequestMail } from './inngest/functions/on-request-mail.js';
import { OnRequestOtp } from './inngest/functions/on-otp-request.js';


const app = express();



app.use(cors({
  origin: '*', 
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 8000;


app.use('/api/analysis', analysisRoute);
app.use('/api/auth', authRoute);
app.get('/test', (req, res) => {
    res.send("Test endpoint");
});


app.use('/api/inngest', (req, res, next) => {
  console.log('Inngest request origin:', req.headers.origin);
  next();
});

app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions: [OnRequestMail, OnRequestOtp] 
    }),
)



ConnectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port : ${PORT}`);
        })
    })
    .catch((err)=> {
        console.error("MongoDB error: ", err)
    })




