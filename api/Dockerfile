# Utiliser l'image officielle de Node.js comme image de base
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json (s'il existe) dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet dans le conteneur
COPY . .

# Exposer le port sur lequel l'application écoute (par défaut Express écoute sur le port 3000)
EXPOSE 3000

# Définir la commande pour démarrer l'application
CMD ["npm", "start"]
