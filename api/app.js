const express = require('express');
const bodyParser = require('body-parser');
import conversationRoutes from './routes/conversationRoute.js';
import messageRoutes from './routes/messageRoute.js';
import userRoute from './routes/userRoute.js';   

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/c', conversationRoutes);
app.use('/m', messageRoutes);
app.use('/u', userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});