function toggleForms() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
    clearError(); 
}

  
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // try {
    //   // Appel à l'API
    //   const response = await fetch('https://ton-api.com/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ username, password })
    //   });

    //   if (response.ok) {
    //     // Si OK, rediriger
    //     window.location.href = 'index.html';
    //   } else {
    //     // Sinon afficher erreur
    //     const data = await response.json();
    //     showError(data.message || "Identifiants incorrects.");
    //   }
    // } catch (error) {
    //   showError("Erreur de connexion au serveur.");
    // }
    window.location.href = 'index.html';
});

document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    
    const username = document.getElementById('register-username').value;
    const nom= document.getElementById('register-nom').value;
    const prenom =document.getElementById('register-prenom').value;
    const verif_password =document.getElementById('verif-register-password').value;
    const password = document.getElementById('register-password').value;
    
    if (verif_password==password){
        //try {
        //   // Appel à l'API
        //   const response = await fetch('https://ton-api.com/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ username, nom, prenom, password })
        //   });
    
        //   if (response.ok) {
        //     // Si OK, rediriger
        //     window.location.href = 'index.html';
        //   } else {
        //     // Sinon afficher erreur
        //     const data = await response.json();
        //     showError(data.message || "Identifiants incorrects.");
        //   }
        // } catch (error) {
        //   showError("Erreur de connexion au serveur.");
        // }
        window.location.href = 'index.html';

    }
    else{
        showError("Les mots de passe ne correspondent pas!", "register");
    }

    // try {
    //   // Appel à l'API
    //   const response = await fetch('https://ton-api.com/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ username, password })
    //   });

    //   if (response.ok) {
    //     // Si OK, rediriger
    //     window.location.href = 'index.html';
    //   } else {
    //     // Sinon afficher erreur
    //     const data = await response.json();
    //     showError(data.message || "Identifiants incorrects.");
    //   }
    // } catch (error) {
    //   showError("Erreur de connexion au serveur.");
    // }
    
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
