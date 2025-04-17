const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Route pour obtenir tous les utilisateurs
router.get('/', userController.getAllUsers);

// Route pour obtenir un utilisateur par ID
router.get('/:id', userController.getUserById);

// Route pour créer un nouvel utilisateur
router.post('/login', userController.loginUser);

// Route pour mettre à jour un utilisateur par ID
router.put('/:id', userController.updateUser);

// Route pour supprimer un utilisateur par ID
router.delete('/:id', userController.deleteUser);

module.exports = router;