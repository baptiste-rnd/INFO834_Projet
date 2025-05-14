db = db.getSiblingDB('messaging');

// Création des collections
db.createCollection('user');
db.createCollection('message');
db.createCollection('conversation');

// Fonction pour récupérer l'ObjectId à partir du username
function getUserIdByUsername(username) {
    const user = db.user.findOne({ username: username });
    return user ? user._id : null;
}

// Fonction pour récupérer l'ID de la conversation par titre
function getConversationIdByTitle(title) {
    const conversation = db.conversation.findOne({ titre: title });
    return conversation ? conversation._id : null;
}

// Insertion des utilisateurs
db.user.insertMany([
    {
      nom: "Degouey",
      prenom: "Corentin",
      motDePasse: "mdp",
      username: "corentin.degouey"
    },
    {
      nom: "Soldan",
      prenom: "Maxens",
      motDePasse: "mdp",
      username: "maxens.soldan"
    },
    {
      nom: "Renand",
      prenom: "Baptiste",
      motDePasse: "mdp",
      username: "baptiste.renand"
    },
    {
      nom: "Bercier",
      prenom: "Thomas",
      motDePasse: "mdp",
      username: "thomas.bercier"
    }
]);

print('Utilisateurs créés avec succès!');

// Récupération des ObjectIds des utilisateurs en utilisant leurs usernames
const corentinId = getUserIdByUsername('corentin.degouey');
const maxensId = getUserIdByUsername('maxens.soldan');
const baptisteId = getUserIdByUsername('baptiste.renand');
const thomasId = getUserIdByUsername('thomas.bercier');

// Vérification que tous les utilisateurs ont été trouvés
if (!corentinId || !maxensId || !baptisteId || !thomasId) {
    print('Erreur : un ou plusieurs utilisateurs n\'ont pas été trouvés.');
    exit();
}

// Création des conversations en utilisant les ObjectIds récupérés
const conversations = [
    {
        titre: 'Développeurs Web',
        description: 'Discussion sur les technologies de développement web.',
        owner: corentinId, // Corentin est l'owner
        listeMembres: [maxensId, baptisteId, thomasId,corentinId] // Maxens, Baptiste, et Thomas sont membres
    },
    {
        titre: 'Club Foot',
        description: 'Groupe pour les membres du club',
        owner: corentinId, // Corentin est l'owner
        listeMembres: [maxensId, baptisteId, thomasId,corentinId] // Maxens, Baptiste, et Thomas sont membres
    },
    {
        titre: 'Voyage à Paris',
        description: 'Préparons notre voyage à Paris.',
        owner: maxensId, // Maxens est l'owner
        listeMembres: [corentinId, thomasId,maxensId] // Corentin et Thomas sont membres
    }
];

// Insertion des conversations dans la base de données
const result = db.conversation.insertMany(conversations);
print('Conversations créées avec succès:', result);

const c1 = getConversationIdByTitle('Développeurs Web');
const c3 = getConversationIdByTitle('Club Foot');
const c2 = getConversationIdByTitle('Voyage à Paris');

// Création des messages pour différentes conversations
const messages = [
    {
        contenu: 'Quelles technologies de développement web utilisez-vous ?',
        auteur: corentinId, // L'auteur du message est Corentin
        conversation: c1, // L'ID de la conversation 'Développeurs Web'
        date_heure: new Date() // La date et l'heure actuelles
    },
    {
        contenu: 'Quel est le programme pour notre voyage à Paris ?',
        auteur: maxensId, // L'auteur du message est Maxens
        conversation: c2, // L'ID de la conversation 'Voyage à Paris'
        date_heure: new Date() // La date et l'heure actuelles
    },
    {
        contenu: 'Quelles technologies front-end préférez-vous ?',
        auteur: baptisteId, // L'auteur du message est Baptiste
        conversation: c1, // L'ID de la conversation 'Développeurs Web'
        date_heure: new Date() // La date et l'heure actuelles
    },
    {
        contenu: 'Est-ce que tout est prêt pour notre départ ?',
        auteur: thomasId, // L'auteur du message est Thomas
        conversation: c2, // L'ID de la conversation 'Voyage à Paris'
        date_heure: new Date() // La date et l'heure actuelles
    },
    {
        contenu: 'Le match est à quelle heure ce soir?',
        auteur: corentinId, // L'auteur du message est Corentin
        conversation: c3, // L'ID de la conversation 'Développeurs Web'
        date_heure: new Date() // La date et l'heure actuelles
    },
     {
        contenu: 'On joue a 19h30',
        auteur: thomasId, // L'auteur du message est Corentin
        conversation: c3, // L'ID de la conversation 'Développeurs Web'
        date_heure: new Date() // La date et l'heure actuelles
    },
     {
        contenu: 'Quelqu un a l adresse? ',
        auteur: maxensId, // L'auteur du message est Corentin
        conversation: c3, // L'ID de la conversation 'Développeurs Web'
        date_heure: new Date() // La date et l'heure actuelles
    },
     {
        contenu: 'Annecy le Vieux au stade',
        auteur: thomasId, // L'auteur du message est Corentin
        conversation: c3, // L'ID de la conversation 'Développeurs Web'
        date_heure: new Date() // La date et l'heure actuelles
    },
     {
        contenu: 'Chaud de zinzin ca va jouer fort!',
        auteur: baptisteId, // L'auteur du message est Corentin
        conversation: c3, // L'ID de la conversation 'Développeurs Web'
        date_heure: new Date() // La date et l'heure actuelles
    },
     {
        contenu: 'Le big 4 4 2 des légendes',
        auteur: corentinId, // L'auteur du message est Corentin
        conversation: c3, // L'ID de la conversation 'Développeurs Web'
        date_heure: new Date() // La date et l'heure actuelles
    }, {
        contenu: 'Rodrygo (24 ans) et le Real Madrid, cest bientôt fini. Malgré des statistiques proches de ses saisons précédentes (14 buts et 9 passes décisives en 50 matchs), lattaquant brésilien a fini par se lasser. En effet, lancien joueur de Santos estime ne pas être traité à sa juste valeur, lui qui malgré larrivée de Kylian Mbappé, - Source: Maxifoot, https://www.maxifoot.fr/football/article-61239.htm#footref',
        auteur: baptisteId, // L'auteur du message est Corentin
        conversation: c3, // L'ID de la conversation 'Développeurs Web'
        date_heure: new Date() // La date et l'heure actuelles
    }
];

// Insertion des conversations dans la base de données
const result2 = db.message.insertMany(messages);
print('Messages créées avec succès:', result2);