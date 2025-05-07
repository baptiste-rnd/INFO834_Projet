document.addEventListener("DOMContentLoaded", () => {
    const sidebarItems = document.querySelectorAll(".sidebar li");

    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            // Réinitialise la couleur de fond de toutes les conversations
            sidebarItems.forEach(li => {
                li.style.backgroundColor = "";
            });

            // Applique un fond bleu foncé à la conversation sélectionnée
            item.style.backgroundColor = "#003366"; // Bleu foncé
            item.style.color = "white"; // Texte en blanc pour la lisibilité
        });
    });
});
