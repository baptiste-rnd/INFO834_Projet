// Vérifie si l'utilisateur est connecté
const userId = localStorage.getItem('userId');

if (userId) {
    // Si aucun userId, redirige vers la page de connexion
    window.location.href = '/';
}

function toggleForms() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
    clearError(); 
}

  
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const username = document.getElementById('login-username').value;
    const motDePasse = document.getElementById('login-password').value;  // Utiliser motDePasse

    try {
        // Appel à l'API sur localhost
        const response = await fetch('/u/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, motDePasse })  // Changer password en motDePasse
        });

        if (response.ok) {
            const data = await response.json();
            const userId = data.id;  // Adapté à la structure de votre API

            // Enregistrer l'ID de l'utilisateur dans le localStorage
            localStorage.setItem('userId', userId);
            // Si OK, rediriger vers la page d'accueil
            window.location.href = 'index.html';
        } else {
            // Sinon afficher erreur
            const data = await response.json();
            showError(data.message || "Identifiants incorrects.");
        }
    } catch (error) {
        showError("Erreur de connexion au serveur.");
    }
});

function showError(message) {
    // Affichage du message d'erreur
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}


document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    
    const username = document.getElementById('register-username').value;
    const nom= document.getElementById('register-nom').value;
    const prenom =document.getElementById('register-prenom').value;
    const verif_password =document.getElementById('verif-register-password').value;
    const motDePasse = document.getElementById('register-password').value;
    
    if (verif_password==motDePasse){
        try {
            // Appel à l'API pour créer un nouvel utilisateur
            const response = await fetch('/u/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, motDePasse, nom, prenom })  // Vous pouvez ajouter d'autres champs ici
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Utilisateur créé avec succès:', data);
                alert('Utilisateur créé avec succès');
                // Rediriger vers la page de connexion ou autre page après la création
                window.location.href = 'connexion.html';
            } else {
                const data = await response.json();
                showError(data.message || 'Erreur lors de la création de l\'utilisateur.');
            }
        } catch (error) {
            showError('Erreur de connexion au serveur.');
        }

    }
    else{
        showError("Les mots de passe ne correspondent pas!", "register");
    }
    
});

function showError(message, form = 'login') {
    const formId = form === 'login' ? 'login-form' : 'register-form';
    const errorId = form === 'login' ? 'login-error' : 'register-error';

    let errorEl = document.getElementById(errorId);
    if (!errorEl) {
        errorEl = document.createElement('p');
        errorEl.id = errorId;
        errorEl.style.color = 'red';
        errorEl.style.textAlign = 'center';
        errorEl.style.marginTop = '10px';
        document.getElementById(formId).appendChild(errorEl);
    }
    errorEl.textContent = message;
}

function clearError() {
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    if (loginError) loginError.remove();
    if (registerError) registerError.remove();
}
