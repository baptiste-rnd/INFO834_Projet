const Conversation = require('../models/conversationModel');

// Create a new conversation
exports.createConversation = async (req, res) => {
    try {
        const { participants, title } = req.body;

        if (!participants || participants.length < 2) {
            return res.status(400).json({ message: 'At least two participants are required.' });
        }

        if (!title || typeof title !== 'string') {
            return res.status(400).json({ message: 'A valid title is required.' });
        }

        const newConversation = new Conversation({ participants, title });
        const savedConversation = await newConversation.save();

        res.status(201).json(savedConversation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating conversation', error });
    }
};

// Get all conversations for a user
exports.getUserConversations = async (req, res) => {
    try {
        const userId = req.params.userId;

        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        });

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversations', error });
    }
};

// Get a specific conversation by ID
exports.getConversationById = async (req, res) => {
    try {
        const conversationId = req.params.id;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversation', error });
    }
};

// Delete a conversation
exports.deleteConversation = async (req, res) => {
    try {
        const conversationId = req.params.id;

        const deletedConversation = await Conversation.findByIdAndDelete(conversationId);

        if (!deletedConversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting conversation', error });
    }
};