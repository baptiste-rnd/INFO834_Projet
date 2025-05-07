# 💬 Projet de Messagerie Temps Réel

Ce projet est une application de messagerie temps réel utilisant Node.js, MongoDB en replica set (tolérance aux fautes), Redis et Socket.IO. Il permet la création de conversations, l’échange de messages, et l’interaction en direct entre utilisateurs.

---

## ⚙️ Technologies utilisées

* Node.js + Express
* MongoDB (Replica Set)
* Redis
* Socket.IO
* Docker & Docker Compose
* HTML/CSS/JS (client)

---

## 🚀 Lancement rapide

### 1. Clone du dépôt

```bash
git clone https://github.com/ton-utilisateur/nom-du-projet.git
cd nom-du-projet
```

### 2. Lancer le projet avec Docker Compose

Assurez-vous que Docker est installé, puis lancez :

```bash
docker-compose up --build -d
```

Cela démarre :

* 3 instances MongoDB configurées en replica set (`mongo1`, `mongo2`, `mongo3`)
* Redis
* L'API Node.js avec le front-end intégré


## 🌐 Accéder à l'application

Une fois les services démarrés :

🖥️ Ouvre ton navigateur sur :

```
http://localhost:3000
```

---

## 📂 Structure du projet

```
.
├── docker-compose.yml
├── mongo/
│   └── Dockerfile  # image Mongo personnalisée si besoin
├── api/
│   ├── app.js      # serveur Node.js
│   ├── routes/
│   └── models/
└── web/
    └── index.html  # fichiers statiques
```

---

## ✅ Astuces utiles

* Pour arrêter tous les services :

  ```bash
  docker-compose down
  ```

