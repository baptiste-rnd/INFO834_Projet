const userId = localStorage.getItem('userId');

async function checkUser() {
    if (!userId) {
        // Pas d'userId en local → redirection
        window.location.href = 'connexion.html';
        return;
    }

    try {
        const response = await fetch(`/u/${userId}`);

        if (!response.ok) {
            // Utilisateur non trouvé → redirection
            throw new Error('Utilisateur non trouvé');
        }

        const data = await response.json();

        // Optionnel : tu peux vérifier d'autres infos dans "data" ici

    } catch (error) {
        console.error('Erreur lors de la vérification :', error);
        localStorage.removeItem('userId'); // Nettoyage
        window.location.href = 'connexion.html';
    }
}

checkUser();

const socket = io();
// Réception d'un message en temps réel
socket.on('messageReceived', async (message) => {
    try {
        const conversation = await fetchConversationById(message.conversation);

        if (!conversation) {
            console.error('Conversation non trouvée');
            return;
        }

        // Si la conversation active est affichée à l'écran
        if (activeConversation && activeConversation._id === conversation._id) {
            showConversation(conversation);  // Actualiser la vue
        } else {
            const convDiv = document.querySelector(`[data-conversation-id="${conversation._id}"]`);
            if (convDiv) {
                convDiv.classList.add("unread");
            }
        }

    } catch (error) {
        console.error('Erreur lors de la récupération de la conversation:', error);
    }
});


async function fetchConversationById(conversationId) {
    const response = await fetch(`/c/${conversationId}`);
    const data = await response.json();
    return data;
}


// Réception d'un message en temps réel
socket.on('updateConv', async () => {
    try {
        getUserConversations(userId);

    } catch (error) {
        console.error('Erreur lors de la récupération de la conversation:', error);
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////    Utilisateur connecté Redis               /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fonction pour récupérer les utilisateurs en ligne depuis l'API
async function fetchOnlineUsers() {
    try {
        const response = await fetch('/u/online'); 
        const data = await response.json();
        if (response.ok) {
            displayOnlineUsers(data.onlineUsers);
        } else {
            console.error('Erreur API:', data.message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs en ligne:', error);
    }
}

// Fonction pour afficher les utilisateurs dans le DOM
function displayOnlineUsers(users) {
    const usersList = document.getElementById("users-list");
    usersList.innerHTML = ""; 
    users.forEach(user => {
        const userContainer = document.createElement("div");
        userContainer.classList.add("user-item");

        const span = document.createElement("span");
        span.textContent = user.username; 

        const onlineDot = document.createElement("span");
        onlineDot.classList.add("online-dot");

        userContainer.appendChild(onlineDot);
        userContainer.appendChild(span);
        usersList.appendChild(userContainer);
    });
}

// Appel initial au chargement de la page
fetchOnlineUsers();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////    Utilisateur                   ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Récupération des infos de l'utilisateurs.
let user={};

//récupérer les infos de l'utilisateurs
async function getUserInfo() {
  if (userId) {
    try {
      const response = await fetch(`/u/${userId}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'utilisateur");
      }
      const data = await response.json();
      user = {
        nom: data.nom,
        prenom: data.prenom,
        username: data.username
      };
      display_user_info(); // Appel ici après que user soit rempli
    } catch (error) {
      console.error("Erreur :", error.message);
    }
  } else {
    console.error("Aucun ID utilisateur trouvé dans le localStorage");
  }
}

//afficher les infos de l'utilisateur
function display_user_info() {
    getUserInfo()
    const userInfoDiv = document.getElementById("user-info-texte");
    userInfoDiv.innerHTML = `
        <img src="assets/img/profil.png" alt="Photo de profil" class="profile-pic">
        <div class="user-details">
            <p class="user-name">${user.prenom} ${user.nom}</p>
        </div>
    `;
}

// Appel de la fonction async au chargement
getUserInfo();

//Modifier les infos de l'utilisateur
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

    // Envoi à l'API
    const userId = localStorage.getItem("userId");
    if (userId) {
        fetch(`/u/update/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nom: nom,
                prenom: prenom,
                username: username
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Échec de la mise à jour de l'utilisateur");
            }
            return response.json();
        })
        .then(updatedUser => {
            console.log("Utilisateur mis à jour :", updatedUser);
            display_user_info();
            document.getElementById("settings-panel").classList.add("hidden");
        })
        .catch(error => {
            console.error("Erreur lors de la mise à jour :", error);
        });
    } 
    else {
        console.error("ID utilisateur non trouvé dans le localStorage");
    }
});

//Creation de la liste avec tous les utilisateurs
let allUsers = [];

async function getAllUsers(){
    fetch("/u").then(response => {
        if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
        }
        return response.json();
    })
    .then(data => {
        allUsers = data;
        // Tu peux ici appeler une fonction pour afficher la liste, etc.
    })
    .catch(error => {
        console.error("Erreur API :", error);
});
}
getAllUsers();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////      Conversation                  ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Conversation
const inputWrapper = document.getElementById("input-wrapper");
const input = document.getElementById("write-bar");
const sendButton = document.getElementById("send-button");
let conversations = [];

async function getUserConversations(userId) {
  if (!userId) {
    console.error("Aucun ID utilisateur fourni");
    return;
  }

  try {
    const response = await fetch(`/c/getConvUser/${userId}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des conversations");
    }
    const data = await response.json();

    conversations = data.map(conv => {
        const ownerUser = allUsers.find(user => user._id === conv.owner);
        const membresUsernames = conv.listeMembres.map(memberId => {
          const user = allUsers.find(u => u._id === memberId);
          return user ? user.username : "Inconnu";
        });
  
        return {
          ...conv,
          owner: ownerUser ? ownerUser.username : "Inconnu",
          listeMembres: membresUsernames
        };
    });

    console.log("Conversations récupérées :", conversations);
    displayConversation();
  } catch (error) {
    console.error("Erreur :", error.message);
  }
}

//recuperer toutes les conv d'un utilisateurs
getUserConversations(userId);

//afficher les conversations 
function displayConversation(){
    // Remplir les conversations
    const conversationList = document.getElementById("conversation-list");
    conversationList.innerHTML="";
    conversations.forEach(conv => {
        const li = document.createElement("li");

        const wrapper = document.createElement("div");
        wrapper.classList.add("conversation-item");
        wrapper.setAttribute("data-conversation-id", conv._id);

        const title = document.createElement("span");
        title.textContent = conv.titre;
        title.classList.add("conversation-title");
        title.onclick = () => showConversation(conv);

        const settingsBtn = document.createElement("button");
        settingsBtn.classList.add("conv-settings-btn");

        const img = document.createElement("img");
        img.src = "assets/img/settings.png"; 
        img.alt = "Paramètres";
        img.classList.add("settings-img");

        settingsBtn.appendChild(img);
        settingsBtn.onclick = (e) => {
            e.stopPropagation(); // Empêche le déclenchement de l'ouverture de la conv
            openConversationSettings(conv);
        };

        wrapper.appendChild(title);
        wrapper.appendChild(settingsBtn);
        li.appendChild(wrapper);
        conversationList.appendChild(li);
    });
}

// Variable pour garder une référence de la conversation active
let activeConversation = null;
let messages = [];

//recuperer les messages et les assigners a une conversation
async function getMessagesByConversation(conversation,conversationId) {
  try {
    const response = await fetch(`m/conversation/${conversationId}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des messages");
    }
    let data = await response.json();
    data = data.filter(msg => msg.conversation === conversationId).map(msg => ({
        auteur: getSenderNameById(msg.auteur), 
        contenu: msg.contenu
      }));

    conversation.messages=data;
  } catch (error) {
    console.error("Erreur :", error.message);
  }
}

//recuperer les username par rapport aux id
function getSenderNameById(auteurId) {

    const temp_user = allUsers.find(u => u._id === auteurId);
    return temp_user ? `${temp_user.username}` : "Inconnu";
}

// Afficher une conversation
async function showConversation(conversation) {
    await getMessagesByConversation(conversation,conversation._id);
    (conversation.messages)

    //enleve la notif
    const convDiv = document.querySelector(`[data-conversation-id="${conversation._id}"]`);
    if (convDiv) {
        convDiv.classList.remove("unread");
    }

    // Mettre à jour la conversation active
    activeConversation = conversation;

    // Afficher le champ de saisie et le bouton "Envoyer" uniquement pour cette conversation
    inputWrapper.classList.remove("hidden");

    // Cible le conteneur où afficher le header de conversation
    const headerContainer = document.getElementById("conversation-header");
    headerContainer.innerHTML = ""; // Reset du contenu précédent

    // Crée la div principale du header
    const headerDiv = document.createElement("div");
    headerDiv.classList.add("conversation-header");

    // Titre de la conversation
    const title = document.createElement("h3");
    title.textContent = conversation.titre;
    title.classList.add("conversation-title");

    // Bouton pour quitter avec une icône
    const leaveButton = document.createElement("button");
    leaveButton.classList.add("leave-button");
    leaveButton.title = "Quitter la conversation";
    leaveButton.innerHTML = `<img src="assets/img/leave.png" alt="Quitter" class="leave-icon">`;
    leaveButton.addEventListener("click", () => {
        if (confirm("Voulez-vous vraiment quitter cette conversation ?")) {
            leaveConversation(conversation._id);
        }
    });

    // Assembler le header
    headerDiv.appendChild(title);
    headerDiv.appendChild(leaveButton);

    // L'injecter dans la page
    headerContainer.appendChild(headerDiv);

    scrollToBottom();

    const container = document.getElementById("messages-container");
    container.innerHTML = "";

    // Extraire les participants uniques de la conversation
    const participants = [...new Set(conversation.messages.map(msg => msg.auteur))];
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
        const senderColor = userColors[msg.auteur] || "#3498db"; // Défaut si non trouvé
        if (msg.auteur == user.username) {
            msgDiv.classList.add("message-own");
            msgDiv_texte.classList.add("message-texte-own");
            msgDiv_texte.innerHTML = `<p><strong> Moi</strong></p><p>${msg.contenu}</p>`;
        } else {
            msgDiv.classList.add("message");
            msgDiv_texte.classList.add("message-texte");
            msgDiv_texte.innerHTML = `<p><strong style="color: ${senderColor}">${msg.auteur}</strong></p><p>${msg.contenu}</p>`;
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
        const nouveauMessage = {
            auteur: userId, // suppose que user a un champ `_id`
            contenu: messageText,
            conversation: conversation._id
        };
        conversation.messages.push({
            auteur: user.nom,
            contenu: messageText
        });
       
        fetch("/m/createMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nouveauMessage)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de l'envoi du message");
            }
            return response.json();
        })
        .then(data => {
            console.log("Message envoyé et enregistré :", data);
            socket.emit('newMessage', data);
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi à l'API :", error);
        });

        // Vider l'input
        input.value = "";
    }
}

//quitter une conversation
async function leaveConversation(conversationId) {
    try {
        const response = await fetch(`/c/removeParticipant/${conversationId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                participantId: userId
            })
        });

        if (!response.ok) {
            const errMsg = await response.text();
            throw new Error("Erreur lors du départ : " + errMsg);
        }

        const result = await response.json();
        console.log("Départ confirmé :", result);

        alert("Vous avez quitté la conversation.");
        socket.emit('NewupdateConv');    
    } catch (error) {
        console.error("Erreur :", error.message);
        alert("Impossible de quitter la conversation.");
    }
}


// Fonction pour faire défiler jusqu'en bas
function scrollToBottom() {
    const container = document.getElementById("messages-container");
    container.scrollTop = container.scrollHeight;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////    Création et modification d'infos     ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// modifier une conversation
function openConversationSettings(conv) {
    const panel = document.getElementById("conv-settings-panel");
    panel.classList.remove("hidden");

    const nameInput = document.getElementById("conv-name");
    const descInput = document.getElementById("conv-description");
    const saveBtn = document.getElementById("save-conv-settings");
    const membersList = document.getElementById("members-list-edit-conv");

    nameInput.value = conv.titre || "";
    descInput.value = conv.description || "undefined";

    const isOwner = conv.owner === user.username;

    // Activer / désactiver les champs
    nameInput.disabled = !isOwner;
    descInput.disabled = !isOwner;
    saveBtn.classList.toggle("hidden", !isOwner);

    // Nettoyer la liste des membres
    membersList.innerHTML = "";

    // Message d’info si non-owner
    if (!isOwner) {
        const info = document.createElement("p");
        info.textContent = "Vous n'êtes pas propriétaire de cette conversation. Vous ne pouvez que consulter les membres.";
        info.style.fontStyle = "italic";
        info.style.color = "gray";
        membersList.appendChild(info, membersList);
    }

    // Remplir la liste des membres avec cases à cocher
    allUsers.forEach(u => {
        if (u.username !== user.username) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("member-item");

            const isChecked = conv.listeMembres.includes(u.username);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = u.username;
            
            if (isChecked) {
                checkbox.checked = true;
            }
            if (!isOwner) {
                checkbox.disabled = true;
            }
            
            const label = document.createElement("label");
            label.classList.add("member-label");
            label.appendChild(checkbox);
            label.append(` ${u.prenom} ${u.nom}`);
        
            wrapper.appendChild(label);
            membersList.appendChild(wrapper);
        }
    });

    // Sauvegarde des modifications (seulement si owner)
    saveBtn.onclick = async() => {
        if (!isOwner) return;

        const checkedBoxes = membersList.querySelectorAll("input[type='checkbox']:checked");
        const selectedMembers = Array.from(checkedBoxes).map(cb => cb.value);

        // Map les usernames vers les _id correspondants
        const selectedIds = selectedMembers.map(username => {
            const user = allUsers.find(u => u.username === username);
            return user ? user._id : null;
        }).filter(id => id !== null); 

        selectedIds.push(userId);//ajout automatique de l'utilisateur 

        conv.title = nameInput.value;
        conv.description = descInput.value;
        conv.listeMembres = selectedIds;

        panel.classList.add("hidden");

        try {
            const response = await fetch(`/c/update/${conv._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    titre: conv.title,
                    description: conv.description,
                    listeMembres: conv.listeMembres
                })
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de la conversation");
            }

            const updatedConv = await response.json();
            console.log("Conversation mise à jour :", updatedConv);
            socket.emit('NewupdateConv');    

        } catch (error) {
            console.error("Erreur :", error.message);
        }
    };
}

// Fermeture du panneau
document.getElementById("close-conv-settings").addEventListener("click", () => {
    document.getElementById("conv-settings-panel").classList.add("hidden");
});


//Créér une conversation
document.getElementById("save-conversation").addEventListener("click", async () => {
    const nom = document.getElementById("input-titre").value.trim();
    const description = document.getElementById("input-description").value.trim();

    const selectedUsernames = Array.from(
        document.querySelectorAll("#members-list input[type='checkbox']:checked")
    ).map(checkbox => checkbox.value); // usernames

    // Convertir les usernames en _id
    let selectedIds = selectedUsernames.map(username => {
        const userObj = allUsers.find(u => u.username === username);
        return userObj ? userObj._id : null;
    }).filter(id => id !== null);

    selectedIds.push(userId);//ajout automatique de l'utilisateur 

    const conversationData = {
        owner: userId,
        titre: nom,
        description: description,
        listeMembres: selectedIds
    };

    try {
        const response = await fetch("/c/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(conversationData)
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la création de la conversation");
        }

        const newConv = await response.json();
        console.log("Conversation créée :", newConv);
        socket.emit('NewupdateConv');    
        document.getElementById("conversation-panel").classList.add("hidden");
    } catch (error) {
        console.error("Erreur :", error.message);
    }
});


document.getElementById("toggle-conversation").addEventListener("click", () => {
    const membersDiv = document.getElementById("members-list");
    membersDiv.innerHTML = ""; // reset
    allUsers.forEach(u => {
        if (u.username !== user.username) { // Exclure l'utilisateur connecté
            const wrapper = document.createElement("div");
            wrapper.classList.add("member-item");
            wrapper.innerHTML = `
            <label>
                <input type="checkbox" value="${u.username}">
                ${u.prenom} ${u.nom}
            </label>
            `;  
            membersDiv.appendChild(wrapper);
        }
    });

    document.getElementById("conversation-panel").classList.toggle("hidden");
});


// Fermer avec la croix
document.getElementById("close-conversation").addEventListener("click", () => {
    document.getElementById("conversation-panel").classList.add("hidden");
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////    Statistiques Redis            ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function updateStats() {
    const list = document.getElementById("statistiques-list");
    list.innerHTML = "";

    try {
        const response = await fetch("/m");
        if (!response.ok) throw new Error("Erreur lors de la récupération des messages");

        const messages = await response.json();

        const messageCounts = {};
        messages.forEach(msg => {
            const auteur = msg.auteur;
            messageCounts[auteur] = (messageCounts[auteur] || 0) + 1;
        });

        let maxUser = null, minUser = null;
        let maxCount = -Infinity, minCount = Infinity;

        for (const [userId, count] of Object.entries(messageCounts)) {
            if (count > maxCount) {
                maxCount = count;
                maxUser = userId;
            }
            if (count < minCount) {
                minCount = count;
                minUser = userId;
            }
        }

        const totalMessages = messages.length;

        const mostActiveUsername = getSenderNameById(maxUser);
        const leastActiveUsername = getSenderNameById(minUser);

        // Remplissage du HTML avec les vraies stats
        list.innerHTML = `
            <li><strong>Utilisateur le plus actif :</strong> ${mostActiveUsername}</li>
            <li><strong>Utilisateur le moins actif :</strong> ${leastActiveUsername}</li>
            <li><strong>Total des messages :</strong> ${totalMessages}</li>
        `;

    } catch (error) {
        console.error("Erreur dans updateStats :", error.message);
        list.innerHTML = `<li>Erreur lors du chargement des statistiques.</li>`;
    }
}
async function fetchAverageConnectionTime(userId) {
    try {
        const response = await fetch(`/u/stats/average/${userId}`);
        const data = await response.json();

        if (response.ok) {
            const durationMs = data.average;
            const formatted = formatDuration(durationMs);
            const list = document.getElementById("statistiques-list");
            // Créer un élément de liste
            const item = document.createElement("li");
            item.classList.add("stat-item");

            // Ajouter le texte avec le temps moyen en gras
            item.innerHTML = `<strong> Mon temps moyen de connexion : </strong>${formatted}`;

            list.appendChild(item);

            
        } else {
            console.error('Erreur API :', data.message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du temps moyen de connexion :', error);
    }
}

function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
        return `${minutes} min ${seconds} s`;
    } else {
        return `${seconds} s`;
    }
}


  


document.getElementById("logout-button").addEventListener("click", async () => {
    try {
        // Appel à l'API sur localhost
        const response = await fetch('/u/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })  // Changer password en motDePasse
        });

        if (response.ok) {
            localStorage.removeItem("userId");
            if (!localStorage.getItem("userId")) {
                window.location.href = 'connexion.html';
            } else {
                console.error("Échec de la suppression du userId.");
            }
        } else {
            console.log("Erreur.");
        }
    } catch (error) {
        console.log(error);
    }
});

updateStats();
fetchAverageConnectionTime(userId);




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////    User experience               ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function makeDraggable(panelId) {
    const panel = document.getElementById(panelId);
    let isDragging = false;
    let offsetX, offsetY;
  
    panel.addEventListener('mousedown', startDrag);
    panel.addEventListener('touchstart', startDrag, { passive: false });
  
    function startDrag(e) {
      isDragging = true;
      const rect = panel.getBoundingClientRect();
      offsetX = (e.clientX || e.touches[0].clientX) - rect.left;
      offsetY = (e.clientY || e.touches[0].clientY) - rect.top;
  
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
    }
  
    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();
  
      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;
  
      panel.style.left = `${clientX - offsetX}px`;
      panel.style.top = `${clientY - offsetY}px`;
    }
  
    function stopDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    }
  }
  
  // Appelle la fonction pour rendre les panneaux déplaçables
  makeDraggable("settings-panel");
  makeDraggable("conversation-panel");
  makeDraggable("conv-settings-panel");
  