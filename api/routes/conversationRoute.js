const express = require('express');
const conversationController = require('../controllers/conversationController');

const router = express.Router();

// Route pour créer une nouvelle conversation
router.post('/', conversationController.createConversation);

// Route pour récupérer toutes les conversations d'un utilisateur
router.get('/:userId', conversationController.getUserConversations);

// Route pour récupérer une conversation spécifique
router.get('/:conversationId/details', conversationController.getConversationDetails);

module.exports = router;