const mongoose = require('mongoose');

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
    }
}, {
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;