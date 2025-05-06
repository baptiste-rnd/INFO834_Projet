import express from 'express';
import {getAllMessages,getMessageById,createMessage,updateMessage,deleteMessage,getMessagesByConversationId} from '../controllers/messageController.js';

const router = express.Router();

// Route pour récupérer tous les messages
router.get('/', getAllMessages);

// Route pour récupérer un message par ID
router.get('/:id', getMessageById);

// Route pour créer un nouveau message
router.post('/createMessage', createMessage);

// Route pour mettre à jour un message existant
router.put('/:id', updateMessage);

// Route pour supprimer un message
router.delete('/:id', deleteMessage);

// Route pour récupérer tous les messages selon l'ID de la conversation
router.get('/conversation/:conversationId', getMessagesByConversationId);


export default router;