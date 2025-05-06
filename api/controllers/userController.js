import User from '../models/userModel.js';

import { createClient } from 'redis';

// Créer un client Redis
const redisClient = createClient({
    url: 'redis://redis:6379'
  });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connexion à Redis
await redisClient.connect();

// Obtenir tous les utilisateurs
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
    }
};

// Obtenir un utilisateur par ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error });
    }
};

// Créer un nouvel utilisateur
export const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
    }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error });
    }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
    }
};

// Méthode de connexion
export const loginUser = async (req, res) => {
    try {
        const { username, motDePasse } = req.body;
        const user = await User.findOne({ username, motDePasse });
        if (!user) {
            return res.status(401).json({ message: 'username ou mot de passe incorrect' });
        }

        // Enregistrer dans Redis
        const dateConnexion = new Date().toISOString();
        await redisClient.set(`login:${user._id}`, dateConnexion);

        res.status(200).json({ success: true, id: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la tentative de connexion', error });
    }
};

// Méthode de deconnexion
export const logoutUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(401).json();
        }

        // Supprimer dans Redis
        await redisClient.del(`login:${userId}`);

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la tentative de déconnexion', error });
    }
};