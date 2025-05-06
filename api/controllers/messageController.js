import Message from '../models/messageModel.js';

// Récupérer tous les messages
export const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un message par ID
export const getMessageById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Créer un nouveau message
export const createMessage = async (req, res) => {
    try {
        const { auteur, contenu, conversation } = req.body;

        if (!auteur || !contenu || !conversation) {
            return res.status(400).json({ error: 'Author, content, and conversationId are required' });
        }

        const newMessage = new Message({ auteur, contenu, conversation });
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour un message
export const updateMessage = async (req, res) => {
    try {
        const updatedMessage = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.status(200).json(updatedMessage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un message
export const deleteMessage = async (req, res) => {
    try {
        const deletedMessage = await Message.findByIdAndDelete(req.params.id);
        if (!deletedMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Récupérer tous les messages par ID de conversation
export const getMessagesByConversationId = async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.conversation });
        if (!messages || messages.length === 0) {
            return res.status(404).json({ error: 'No messages found for this conversation' });
        }
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};