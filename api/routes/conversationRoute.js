// Importation des modules nécessaires
import express from 'express';
import {createConversation,getUserConversations,getConversationDetails,updateConversation,removeParticipant} from '../controllers/conversationController.js';

const router = express.Router();

// Route pour créer une nouvelle conversation
router.post('/create', createConversation);

// Route pour récupérer toutes les conversations d'un utilisateur
router.get('/getConvUser/:userId', getUserConversations);

// Route pour récupérer une conversation spécifique
router.get('/details:conversationId', getConversationDetails);

// Route pour mettre à jour une conversation
router.put('/update/:conversationId', updateConversation);

// Route pour ajouter un participant à une conversation
router.put('/removeParticipant/:conversationId', removeParticipant);

export default router;