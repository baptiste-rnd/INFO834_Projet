// Données fictives
const conversations = [
    { id: 1, title: "Projet A", messages: [
      { sender: "Alice", text: "Salut, on commence ?" },
      { sender: "Bob", text: "Oui, go !" },
      { sender: "Alice", text: "Sca va ou quoi " },
      { sender: "Alice", text: " t'as snap?" },
      { sender: "Bob", text: "Chui marié" },
    ]},
    { id: 2, title: "Equipe Tech", messages: [
      { sender: "Eve", text: "Bug corrigé ?" },
      { sender: "David", text: "Presque !" }
    ]},
];
  
const connectedUsers = ["Alice", "Bob", "Eve", "David"];

// Remplir les conversations
const conversationList = document.getElementById("conversation-list");
conversations.forEach(conv => {
    const li = document.createElement("li");
    li.textContent = conv.title;
    li.onclick = () => showConversation(conv);
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
    document.getElementById("conversation-title").textContent = conversation.title;
    const container = document.getElementById("messages-container");
    container.innerHTML = "";
    conversation.messages.forEach(msg => {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message");
        msgDiv.innerHTML = `<strong>${msg.sender}</strong> : ${msg.text}`;
        container.appendChild(msgDiv);
    });
}

const user = {
    prenom: "AD",
    nom: "Laurent",
    photo: "assets/img/profil.jpg"
};
  
const userInfoDiv = document.getElementById("user-info");
userInfoDiv.innerHTML = `
<img src="${user.photo}" alt="Photo de profil" class="profile-pic">
<div class="user-details">
    <p class="user-name">${user.prenom} ${user.nom}</p>
</div>
`;
  
document.getElementById("logout-button").addEventListener("click", () => {
    
    //appelle api
    // Simule une déconnexion
    window.location.href = 'connexion.html';
  });
  