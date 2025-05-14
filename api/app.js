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

const mongoUri = 'mongodb://mongo1:27017,mongo2:27017,mongo3:27017/messaging?replicaSet=rs0&directConnection=false';

async function connectWithRetry() {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 20000, // attends 20s au lieu de 10s
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected (ReplicaSet)');
  } catch (err) {
    console.error('❌ MongoDB connection failed, retrying in 5 seconds...', err);
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();

// Socket.IO : écouter les événements
io.on('connection', (socket) => {
    socket.on('newMessage', (message) => {
        io.emit('messageReceived', message);
    });

    socket.on('userConnected', (user) => {
        console.log(`User connected : ${user.username}`);
        io.emit('onlineUsersUpdated');
    });

    socket.on('userCreated', (user) => {
        console.log(`User created : ${user.username}`);
        io.emit('UsersUpdated');
    });

    socket.on('userDisconnected', (user) => {
        console.log(`User disconnected : ${user.username}`);
        io.emit('onlineUsersUpdated');
    }); 

    // Quand une conv est modifiée ou créée
    socket.on('NewupdateConv', () => {
        io.emit('updateConv');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
