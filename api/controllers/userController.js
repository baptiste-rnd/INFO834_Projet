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

        const now = Date.now();
        await redisClient.set(`login:${user._id}`, now); // pour savoir qu'il est connecté
        await redisClient.set(`login:start:${user._id}`, now); // pour mesurer le temps


        res.status(200).json({ success: true, id: user._id, username: user.username });
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

        const start = await redisClient.get(`login:start:${userId}`);
        if (start) {
            const now = Date.now();
            const duration = now - parseInt(start); // durée en ms

            // Ajouter à la somme cumulée
            await redisClient.incrBy(`stats:totalTime:${userId}`, duration);

            // Incrémenter le nombre de sessions
            await redisClient.incr(`stats:sessions:${userId}`);
        }

        // Nettoyage
        await redisClient.del(`login:${userId}`);
        await redisClient.del(`login:start:${userId}`);

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la tentative de déconnexion', error });
    }
};

export const getOnlineUsers = async (req, res) => {
    try {
        // Récupérer toutes les clés de type "login:<userId>"
        const keys = await redisClient.keys('login:*');

        // Filtrer les clés pour ne garder que celles des utilisateurs connectés
        const userIds = keys
            .filter(key => !key.includes('start')) // Exclure les clés "login:start"
            .map(key => key.split(':')[1]); // Extraire les userIds

        // Récupérer les infos des utilisateurs depuis MongoDB
        const users = await User.find({ _id: { $in: userIds } }, { motDePasse: 0 });

        res.status(200).json({ onlineUsers: users });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs en ligne', error });
    }
};


export const getAverageConnectionTime = async (req, res) => {
    try {
        const userId = req.params.id;

        const totalTime = await redisClient.get(`stats:totalTime:${userId}`);
        const sessionCount = await redisClient.get(`stats:sessions:${userId}`);

        if (!totalTime || !sessionCount || sessionCount === '0') {
            return res.status(200).json({ average: 0, unit: 'milliseconds' });
        }

        const average = parseInt(totalTime) / parseInt(sessionCount);

        res.status(200).json({ average, unit: 'milliseconds' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du calcul du temps moyen", error });
    }
};
