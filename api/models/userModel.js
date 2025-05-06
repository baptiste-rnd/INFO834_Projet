import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    motDePasse: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
}, {
    timestamps: true 
});

// Création du modèle
const User = mongoose.model('User', userSchema, 'user');

// Exportation du modèle
export default User;