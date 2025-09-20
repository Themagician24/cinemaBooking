import express from 'express';
import { clerkMiddleware } from '@clerk/express'
import { inngest, functions } from './inngest/index.js'
import { serve } from 'inngest/express'

import 'dotenv/config';

import cors from 'cors';
import connectDB from './configs/db.js';

const app = express();
const port = 3000;

await connectDB();


// Middleware

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

// Routes

app.get('/', (req, res) => {
  res.send('Server is Live!');
});


app.use('/api/inngest', serve({
  client: inngest, functions
}))

app.listen(port, () => 
  console.log(`Server is running on http://localhost:${port}`)
);