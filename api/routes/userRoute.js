// Importation des modules nécessaires
import express from 'express';
import {getAllUsers,getUserById,createUser,updateUser,deleteUser,loginUser,logoutUser,getOnlineUsers,getAverageConnectionTime} from '../controllers/userController.js';

const router = express.Router();

// Route pour obtenir tous les utilisateurs
router.get('/', getAllUsers);

// Route pour les utilisateurs connectés
router.get('/online', getOnlineUsers);

//Avoir le temps de connexion moyen 
router.get('/stats/average/:id', getAverageConnectionTime);

// Route pour obtenir un utilisateur par ID
router.get('/:id', getUserById);

// Route pour créer un nouvel utilisateur
router.post('/create', createUser);

// Route pour mettre à jour un utilisateur par ID
router.put('/update/:id', updateUser);

// Route pour supprimer un utilisateur par ID
router.delete('/:id', deleteUser);

// Route pour le login d'un utilisateur
router.post('/login', loginUser);

// Route pour le logout d'un utilisateur
router.post('/logout', logoutUser);



export default router;