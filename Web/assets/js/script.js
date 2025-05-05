// Données fictives
const user = {
    prenom: "AD",
    nom: "Laurent",
    photo: "assets/img/profil.jpg",
    username: "pupuce"
};
const conversations = [
    { id: 1, title: "Projet A", messages: [
      { sender: "Alice", text: "Salut, on commence ?" },
      { sender: "Bob", text: "Oui, go !" },
      { sender: "Alice", text: "Ca va ou quoi " },
      { sender: "Alice", text: " t'as snap?" },
      { sender: "Bob", text: "Chui marié" },
      { sender: "Thomas", text: " t'as snap?" },
      { sender: "Baptiste", text: " t'as snap?" },
      { sender: "Bob", text: "Vos gueules" },

    ]},
    { id: 2, title: "Equipe Tech", messages: [
      { sender: "Eve", text: "Bug corrigé ?" },
      { sender: "David", text: "Presque !" }
    ]},
];
  
const connectedUsers = ["Alice", "Bob", "Eve", "David"];
const allUsers= [
    {
    prenom: "AD",
    nom: "Laurent",
    photo: "assets/img/profil.jpg",
    username: "pupuce"
    },
    {
        prenom: "Alice",
        nom: "Lejeune",
        photo: "assets/img/profil.jpg",
        username: "louloute"
    },
    {
        prenom: "Lelouche",
        nom: "Bob",
        photo: "assets/img/profil.jpg",
        username: "pupuce"
    },
    {
        prenom: "AD",
        nom: "David",
        photo: "assets/img/profil.jpg",
        username: "pupuce"
    },
    {
        prenom: "AD",
        nom: "Eve",
        photo: "assets/img/profil.jpg",
        username: "pupuce"
    }
]

//Conversation
const inputWrapper = document.getElementById("input-wrapper");
const input = document.getElementById("write-bar");
const sendButton = document.getElementById("send-button");

// Variable pour garder une référence de la conversation active
let activeConversation = null;

// Remplir les conversations
const conversationList = document.getElementById("conversation-list");
conversations.forEach(conv => {
    const li = document.createElement("li");
    li.textContent = conv.title;
    li.onclick = () => showConversation(conv); // Afficher la conversation lorsque cliquée
    conversationList.appendChild(li);
});

// Remplir les utilisateurs connectés
const usersList = document.getElementById("users-list");
connectedUsers.forEach(user => {
    const span = document.createElement("span");
    span.textContent = user;
    usersList.appendChild(span);
});

// Afficher une conversation
function showConversation(conversation) {
    // Mettre à jour la conversation active
    activeConversation = conversation;

    // Afficher le champ de saisie et le bouton "Envoyer" uniquement pour cette conversation
    inputWrapper.classList.remove("hidden");

    document.getElementById("conversation-title").textContent = conversation.title;
    scrollToBottom();

    const container = document.getElementById("messages-container");
    container.innerHTML = "";

    // Extraire les participants uniques de la conversation
    const participants = [...new Set(conversation.messages.map(msg => msg.sender))];
    const predefinedColors = [
        "#FF6347", "#2ecc71", "#3498db", "#f39c12", "#9b59b6", "#e74c3c", "#1abc9c", "#f1c40f"
    ];
    
    // Générer la couleur en fonction de l'index
    const userColors = {};
    participants.forEach((name, index) => {
        userColors[name] = predefinedColors[index % predefinedColors.length]; // Répète la palette si nécessaire
    });

    // Afficher les messages
    conversation.messages.forEach(msg => {
        const msgDiv = document.createElement("div");
        const msgDiv_texte = document.createElement("div");
        const senderColor = userColors[msg.sender] || "#3498db"; // Défaut si non trouvé
        if (msg.sender == user.nom) {
            msgDiv.classList.add("message-own");
            msgDiv_texte.classList.add("message-texte-own");
            msgDiv_texte.innerHTML = `<p><strong> Moi</strong></p><p>${msg.text}</p>`;
        } else {
            msgDiv.classList.add("message");
            msgDiv_texte.classList.add("message-texte");
            msgDiv_texte.innerHTML = `<p><strong style="color: ${senderColor}">${msg.sender}</strong></p><p>${msg.text}</p>`;
        }
        
        msgDiv.appendChild(msgDiv_texte);
        container.appendChild(msgDiv);
    });

    // Ajouter un événement pour le bouton "Envoyer"
    sendButton.removeEventListener("click", handleSendMessage); // Retirer les anciens événements
    sendButton.addEventListener("click", handleSendMessage); // Ajouter un événement pour la conversation active

    // Ajouter un événement pour la touche "Entrée"
    input.removeEventListener("keydown", handleSendMessageOnEnter);
    input.addEventListener("keydown", handleSendMessageOnEnter);

    // Fonction pour envoyer le message
    function handleSendMessage() {
        sendMessage(activeConversation, input);
    }

    // Fonction pour envoyer le message avec "Enter"
    function handleSendMessageOnEnter(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage(activeConversation, input);
        }
    }

    // S'assurer que l'écran défile en bas
    setTimeout(() => { scrollToBottom(); }, 0);
}

// Fonction pour envoyer un message
function sendMessage(conversation, input) {
    const messageText = input.value.trim();
    if (messageText !== "") {
        conversation.messages.push({
            sender: user.nom,
            text: messageText
        });
        console.log("Le message est envoyé à la conversation : ", conversation);

        // Rafraîchir la vue de la conversation active
        showConversation(conversation);

        // Vider l'input
        input.value = "";
    }
}

// Fonction pour faire défiler jusqu'en bas
function scrollToBottom() {
    const container = document.getElementById("messages-container");
    container.scrollTop = container.scrollHeight;
}
  


function display_user_info(){
    const userInfoDiv = document.getElementById("user-info-texte");
    userInfoDiv.innerHTML = `
    <img src="${user.photo}" alt="Photo de profil" class="profile-pic">
    <div class="user-details">
        <p class="user-name">${user.prenom} ${user.nom}</p>
    </div>
    `;
}


//Modifier les infos de l'utilisateur
display_user_info();

// Modifier le profil de l'utilisateur
document.getElementById("toggle-settings").addEventListener("click", () => {
    document.getElementById("input-nom").value = user.nom;
    document.getElementById("input-prenom").value = user.prenom;
    document.getElementById("input-username").value = user.username || "";
    document.getElementById("settings-panel").classList.toggle("hidden");
});

// Fermer avec la croix
document.getElementById("close-settings").addEventListener("click", () => {
    document.getElementById("settings-panel").classList.add("hidden");
});

// Sauvegarde
document.getElementById("save-settings").addEventListener("click", () => {
    const nom = document.getElementById("input-nom").value.trim();
    const prenom = document.getElementById("input-prenom").value.trim();
    const username = document.getElementById("input-username").value.trim();

     // Mise à jour de l'objet user
    user.nom = nom;
    user.prenom = prenom;
    user.username = username;

    display_user_info();
    // TODO : envoyer à l'API ou mettre à jour l'objet `user`
    document.getElementById("settings-panel").classList.add("hidden");
});


document.getElementById("toggle-conversation").addEventListener("click", () => {
    const membersDiv = document.getElementById("members-list");
    membersDiv.innerHTML = ""; // reset

    //a remplacer par tous les users
    allUsers.forEach(user => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("member-item");
        wrapper.innerHTML = `
        <label>
            <input type="checkbox" value="${user.username}">
            ${user.prenom} ${user.nom}
        </label>
        `;
        membersDiv.appendChild(wrapper);
    });

    document.getElementById("conversation-panel").classList.toggle("hidden");
});

// Fermer avec la croix
document.getElementById("close-conversation").addEventListener("click", () => {
    document.getElementById("conversation-panel").classList.add("hidden");
});



// Creer la conversation
document.getElementById("save-conversation").addEventListener("click", () => {
    const nom = document.getElementById("input-nom").value;
    const description = document.getElementById("input-prenom").value;

    const selectedIds = Array.from(
        document.querySelectorAll("#members-list input[type='checkbox']:checked")
    ).map(checkbox => parseInt(checkbox.value));

    // TODO : envoyer à l'API ou mettre à jour l'objet `user`

    document.getElementById("conversation-panel").classList.add("hidden");
});


document.getElementById("logout-button").addEventListener("click", () => {
    //appelle api
    // Simule une déconnexion
    window.location.href = 'connexion.html';
});

