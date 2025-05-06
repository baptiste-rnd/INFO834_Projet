// Import necessary modules
import Conversation from '../models/conversationModel.js';

// Create a new conversation with owner, title, and description
export const createConversation = async (req, res) => {
    try {
        const { owner, titre, description,listeMembres } = req.body; 

        if (!owner) {
            return res.status(400).json({ message: 'Owner is required.' });
        }

        if (!titre || typeof titre !== 'string') {
            return res.status(400).json({ message: 'A valid title is required.' });
        }

        if (!description || typeof description !== 'string') {
            return res.status(400).json({ message: 'A valid description is required.' });
        }

        const newConversation = new Conversation({ owner, titre, description,listeMembres });
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
            listeMembres: { $in: [userId] }
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
        const { titre, description,listeMembres } = req.body;

        const updatedConversation = await Conversation.findByIdAndUpdate(
            conversationId,
            { titre, description,listeMembres },
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

//Supprimer une membre de la conversation
export const removeParticipant = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const { participantId } = req.body;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation non trouvée' });
        }

        // Retirer le participant
        conversation.listeMembres.pull(participantId);

        //si le participant est le propriétaire
        if (conversation.owner.toString() === participantId) {
            if (conversation.listeMembres.length > 0) {
                // Nouveau propriétaire = premier membre restant
                conversation.owner = conversation.listeMembres[0];
            } else {
                // Plus de membres : supprimer la conversation
                await Conversation.findByIdAndDelete(conversationId);
                return res.status(200).json({ message: 'Conversation supprimée car plus de membres.' });
            }
        }

        await conversation.save();

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du retrait du participant', error });
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