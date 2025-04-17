const mongoose = require('mongoose');

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
        type: String,
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

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;