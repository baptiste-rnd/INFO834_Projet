db = db.getSiblingDB('messaging');

db.createCollection('user');
db.createCollection('message');
db.createCollection('conversation');

db.user.insertMany([
    {
      id: "1",
      nom: "Degouey",
      prenom: "Corentin",
      motDePasse: "mdp",
      username: "corentin.degouey"
    },
    {
      id: "2",
      nom: "Soldan",
      prenom: "Maxens",
      motDePasse: "mdp",
      username: "maxens.soldan"
    },
    {
      id: "3",
      nom: "Renand",
      prenom: "Baptiste",
      motDePasse: "mdp",
      username: "baptiste.renand"
    },
    {
      id: "4",
      nom: "Bercier",
      prenom: "Thomas",
      motDePasse: "mdp",
      username: "thomas.bercier"
    }
  ]);
  