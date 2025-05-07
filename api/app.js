// Import necessary modules with ES syntax
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import http from 'http';  // Importer http pour créer un serveur HTTP
import { Server } from 'socket.io'; // Importer socket.io

import conversationRoutes from './routes/conversationRoute.js';
import messageRoutes from './routes/messageRoute.js';
import userRoute from './routes/userRoute.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir les fichiers statiques depuis /public
app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));

// Routes API
app.use('/c', conversationRoutes);
app.use('/m', messageRoutes);
app.use('/u', userRoute);

const uri = 'mongodb://tcmb:tcmb-mdp!@db:27017/messaging?authSource=admin';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Socket.IO : écouter les événements
io.on('connection', (socket) => {
    console.log('Client connecté');

    // Quand un nouveau message est reçu du client
    socket.on('newMessage', (message) => {
        console.log('Nouveau message reçu du client:', message);
        // Envoyer à TOUS les clients (y compris celui qui l’a émis)
        io.emit('messageReceived', message);
    });

    // Quand une conv est modifiée ou créée
    socket.on('NewupdateConv', () => {
        console.log('Modifications sur les conv:');
        // Envoyer à TOUS les clients (y compris celui qui l’a émis)
        io.emit('updateConv');
    });

    socket.on('disconnect', () => {
        console.log('Client déconnecté');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
