// Import necessary modules with ES syntax
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import conversationRoutes from './routes/conversationRoute.js';
import messageRoutes from './routes/messageRoute.js';
import userRoute from './routes/userRoute.js';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir les fichiers statiques depuis /public
app.use(express.static('public'));

// Routes API
app.use('/c', conversationRoutes);
app.use('/m', messageRoutes);
app.use('/u', userRoute);

const uri = 'mongodb://tcmb:tcmb-mdp!@db:27017/messaging?authSource=admin';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
