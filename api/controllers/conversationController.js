// Import necessary modules
import Conversation from '../models/conversationModel.js';
// Create a new conversation with owner, title, and description

export const createConversation = async (req, res) => {
    try {
        const { owner, title, description } = req.body; 

        if (!owner) {
            return res.status(400).json({ message: 'Owner is required.' });
        }

        if (!title || typeof title !== 'string') {
            return res.status(400).json({ message: 'A valid title is required.' });
        }

        if (!description || typeof description !== 'string') {
            return res.status(400).json({ message: 'A valid description is required.' });
        }

        const newConversation = new Conversation({ owner, title, description });
        const savedConversation = await newConversation.save();

        res.status(201).json(savedConversation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating conversation', error });
    }
};
// Get all conversations for a user
export const getUserConversations = async (req, res) => {
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
export const getConversationById = async (req, res) => {
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
export const deleteConversation = async (req, res) => {
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

// Update a conversation
export const updateConversation = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const { title, description } = req.body;

        const updatedConversation = await Conversation.findByIdAndUpdate(
            conversationId,
            { title, description },
            { new: true }
        );

        if (!updatedConversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.status(200).json(updatedConversation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating conversation', error });
    }
};

// Add a participant to a conversation
export const addParticipant = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const { participantId } = req.body;

        const updatedConversation = await Conversation.findByIdAndUpdate(
            conversationId,
            { $addToSet: { participants: participantId } },
            { new: true }
        );

        if (!updatedConversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.status(200).json(updatedConversation);
    } catch (error) {
        res.status(500).json({ message: 'Error adding participant', error });
    }
};

// get conversations details by ID
export const getConversationDetails = async (req, res) => {
    try {
        const conversationId = req.params.id;

        const conversation = await Conversation.findById(conversationId).populate('participants', 'name email');

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversation details', error });
    }
};