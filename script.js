/* =========================
   OUVRIR LE FILM
========================= */

function ouvrirFilm(url) {

    const lecteur =
        document.getElementById("lecteur");

    const video =
        document.getElementById("video");


    /* Charger le film */

    video.src = url;


    /* Afficher le lecteur */

    lecteur.classList.add("active");


    /* Bloquer le scroll */

    document.body.style.overflow = "hidden";
}


/* =========================
   FERMER LE FILM
========================= */

function fermerFilm() {

    const lecteur =
        document.getElementById("lecteur");

    const video =
        document.getElementById("video");


    /* Arrêter complètement le film */

    video.src = "";


    /* Fermer le lecteur */

    lecteur.classList.remove("active");


    /* Remettre le scroll */

    document.body.style.overflow = "auto";
}


/* =========================
   TOUCHE ESC
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            fermerFilm();

        }

    }
);