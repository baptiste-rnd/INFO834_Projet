import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    titre: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listeMembres: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});
// Création du modèle
const Conversation = mongoose.model('Conversation', ConversationSchema, 'conversation');

// Exportation du modèle
export default Conversation;

