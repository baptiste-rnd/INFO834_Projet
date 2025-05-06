import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    contenu: {
        type: String,
        required: true
    },
    auteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    date_heure: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// Création du modèle
const Message = mongoose.model('Message', messageSchema, 'messages');

// Exportation du modèle
export default Message;