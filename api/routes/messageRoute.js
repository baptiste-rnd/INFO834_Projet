const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

// Route pour récupérer tous les messages
router.get('/', messageController.getAllMessages);

// Route pour récupérer un message par ID
router.get('/:id', messageController.getMessageById);

// Route pour créer un nouveau message
router.post('/', messageController.createMessage);

// Route pour mettre à jour un message existant
router.put('/:id', messageController.updateMessage);

// Route pour supprimer un message
router.delete('/:id', messageController.deleteMessage);

// Route pour récupérer tous les messages selon l'ID de la conversation
router.get('/conversation/:conversationId', messageController.getMessagesByConversationId);

module.exports = router;