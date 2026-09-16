/* =========================================
   MOT DE PASSE
========================================= */

const BON_MOT_DE_PASSE = "KX";

const passwordScreen =
  document.getElementById("password-screen");

const passwordInput =
  document.getElementById("password-input");

const passwordButton =
  document.getElementById("password-button");

const passwordError =
  document.getElementById("password-error");


function verifierMotDePasse() {

  const valeur =
    passwordInput.value
      .trim()
      .toUpperCase();


  if (valeur === BON_MOT_DE_PASSE) {

    passwordError.classList.remove("show");

    passwordScreen.classList.add("hidden");

    document.body.style.overflow = "";

  } else {

    passwordError.classList.add("show");

    passwordInput.value = "";

    passwordInput.focus();


    passwordInput.animate(
      [
        {
          transform: "translateX(0)"
        },
        {
          transform: "translateX(-7px)"
        },
        {
          transform: "translateX(7px)"
        },
        {
          transform: "translateX(-5px)"
        },
        {
          transform: "translateX(5px)"
        },
        {
          transform: "translateX(0)"
        }
      ],
      {
        duration: 280
      }
    );

  }

}


passwordButton.addEventListener(
  "click",
  verifierMotDePasse
);


passwordInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {
      verifierMotDePasse();
    }

  }
);


/* =========================================
   CARROUSEL
========================================= */

const carousel =
  document.getElementById("carousel");

const track =
  document.getElementById("film-track");

const groups =
  document.querySelectorAll(".film-group");

const films =
  document.querySelectorAll(".film");

const arrowLeft =
  document.getElementById("arrow-left");

const arrowRight =
  document.getElementById("arrow-right");


/*
  Position actuelle du carrousel.
*/

let position = 0;


/*
  Vitesse automatique.

  Plus le nombre est petit,
  plus le défilement est lent.
*/

let autoSpeed = 0.35;


/*
  Animation frame.
*/

let animationFrame;


/*
  État du carrousel.
*/

let isDragging = false;

let isPointerDown = false;

let pointerId = null;

let startPointerX = 0;

let startPosition = 0;

let movedDuringDrag = false;

let pauseUntil = 0;


/*
  Taille exacte du premier groupe.

  Elle sera calculée après le chargement
  des images.
*/

let groupWidth = 0;


/*
  Largeur totale d'un groupe + son gap.
*/

let loopDistance = 0;


/* =========================================
   DÉTECTION MOBILE / DESKTOP
========================================= */

function estMobile() {

  return window.matchMedia(
    "(max-width: 899px)"
  ).matches;

}


/* =========================================
   CALCUL DE LA BOUCLE
========================================= */

function calculerDimensions() {

  if (!groups.length) {
    return;
  }


  const premierGroupe =
    groups[0];


  groupWidth =
    premierGroupe.getBoundingClientRect().width;


  const style =
    window.getComputedStyle(track);


  const gap =
    parseFloat(style.columnGap) || 0;


  loopDistance =
    groupWidth + gap;


  /*
    On garde la position dans une zone
    raisonnable lorsque l'écran change
    de taille ou tourne.
  */

  normaliserPosition();

  appliquerPosition();

}


/* =========================================
   NORMALISATION
========================================= */

function normaliserPosition() {

  if (!loopDistance) {
    return;
  }


  /*
    Le premier groupe est à 0.
    Le deuxième commence à loopDistance.

    On garde toujours la position dans
    [-loopDistance, 0].
  */

  while (position <= -loopDistance) {
    position += loopDistance;
  }


  while (position > 0) {
    position -= loopDistance;
  }

}


/* =========================================
   APPLICATION DE LA POSITION
========================================= */

function appliquerPosition() {

  track.style.transform =
    `translate3d(${position}px, 0, 0)`;

}


/* =========================================
   ANIMATION AUTOMATIQUE
========================================= */

function animationAutomatique(timestamp) {

  /*
    Sur ordinateur :
    le carrousel avance tout le temps,
    sauf quand la souris est dessus.

    Sur mobile :
    il avance tout le temps,
    sauf pendant une interaction tactile.
  */


  if (!isDragging && timestamp >= pauseUntil) {

    position -= autoSpeed;

    normaliserPosition();

    appliquerPosition();

  }


  animationFrame =
    requestAnimationFrame(
      animationAutomatique
    );

}


/* =========================================
   PAUSE TEMPORAIRE
========================================= */

function pauseQuelquesSecondes(
  duree = 1500
) {

  pauseUntil =
    performance.now() + duree;

}


/* =========================================
   PAUSE SOURIS SUR ORDINATEUR
========================================= */

carousel.addEventListener(
  "mouseenter",
  function() {

    /*
      Sur mobile il n'y a normalement
      pas de hover.
    */

    if (!estMobile()) {

      pauseUntil =
        Number.POSITIVE_INFINITY;

    }

  }
);


carousel.addEventListener(
  "mouseleave",
  function() {

    if (!estMobile()) {

      pauseUntil =
        performance.now() + 500;

    }

  }
);


/* =========================================
   GLISSEMENT TACTILE / POINTER
========================================= */

carousel.addEventListener(
  "pointerdown",
  function(event) {

    /*
      On ne traite que le bouton principal
      de la souris ou le toucher.
    */

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }


    isPointerDown = true;

    isDragging = true;

    pointerId = event.pointerId;

    startPointerX = event.clientX;

    startPosition = position;

    movedDuringDrag = false;

    carousel.classList.add("dragging");


    /*
      Permet de continuer à recevoir
      les mouvements même si le doigt
      sort légèrement du carrousel.
    */

    try {

      carousel.setPointerCapture(
        event.pointerId
      );

    } catch (error) {
      // Certains anciens navigateurs
      // peuvent ne pas le supporter.
    }


    pauseUntil =
      Number.POSITIVE_INFINITY;

  }
);


/* =========================================
   MOUVEMENT
========================================= */

carousel.addEventListener(
  "pointermove",
  function(event) {

    if (
      !isPointerDown ||
      event.pointerId !== pointerId
    ) {
      return;
    }


    const difference =
      event.clientX - startPointerX;


    /*
      Si le doigt bouge suffisamment,
      on considère que c'est un vrai drag
      et non un simple clic.
    */

    if (Math.abs(difference) > 7) {
      movedDuringDrag = true;
    }


    position =
      startPosition + difference;


    normaliserPosition();

    appliquerPosition();

  }
);


/* =========================================
   FIN DU GLISSEMENT
========================================= */

function terminerGlissement(event) {

  if (
    !isPointerDown ||
    event.pointerId !== pointerId
  ) {
    return;
  }


  isPointerDown = false;

  isDragging = false;

  pointerId = null;

  carousel.classList.remove("dragging");


  try {

    carousel.releasePointerCapture(
      event.pointerId
    );

  } catch (error) {
    // Rien à faire.
  }


  /*
    Le carrousel reste immobile un petit
    moment après le geste, puis reprend.
  */

  pauseQuelquesSecondes(900);

}


carousel.addEventListener(
  "pointerup",
  terminerGlissement
);


carousel.addEventListener(
  "pointercancel",
  terminerGlissement
);


carousel.addEventListener(
  "lostpointercapture",
  function() {

    if (isPointerDown) {

      isPointerDown = false;

      isDragging = false;

      pointerId = null;

      carousel.classList.remove("dragging");

      pauseQuelquesSecondes(900);

    }

  }
);


/* =========================================
   BOUTONS GAUCHE / DROITE
========================================= */

function deplacerManuellement(
  direction
) {

  /*
    Sur mobile on déplace d'environ
    une carte.
  */

  const firstFilm =
    document.querySelector(".film");


  if (!firstFilm) {
    return;
  }


  const filmWidth =
    firstFilm.getBoundingClientRect().width;


  const gap =
    parseFloat(
      window.getComputedStyle(
        groups[0]
      ).columnGap
    ) || 0;


  const distance =
    filmWidth + gap;


  position +=
    direction * distance;


  normaliserPosition();

  appliquerPosition();


  pauseQuelquesSecondes(1800);

}


/*
  Gauche :
  on va vers les films précédents.
*/

arrowLeft.addEventListener(
  "click",
  function() {

    deplacerManuellement(1);

  }
);


/*
  Droite :
  on va vers les films suivants.
*/

arrowRight.addEventListener(
  "click",
  function() {

    deplacerManuellement(-1);

  }
);


/* =========================================
   EMPÊCHER UN CLIC APRÈS UN DRAG
========================================= */

films.forEach(
  function(film) {

    film.addEventListener(
      "click",
      function(event) {

        /*
          Si l'utilisateur vient de glisser
          le carrousel, on ne doit surtout pas
          ouvrir le film.
        */

        if (movedDuringDrag) {

          event.preventDefault();

          event.stopPropagation();

          movedDuringDrag = false;

          return;

        }


        const url =
          film.dataset.url;


        if (url) {
          ouvrirFilm(url);
        }

      }
    );

  }
);


/* =========================================
   OUVRIR LE FILM
========================================= */

const lecteur =
  document.getElementById("lecteur");

const video =
  document.getElementById("video");

const fermer =
  document.getElementById("fermer");


function ouvrirFilm(url) {

  /*
    On arrête temporairement le mouvement
    lorsque le lecteur est ouvert.
  */

  pauseUntil =
    Number.POSITIVE_INFINITY;


  video.src = url;

  lecteur.classList.add("active");

  lecteur.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

}


/* =========================================
   FERMER LE FILM
========================================= */

function fermerFilm() {

  video.src = "";

  lecteur.classList.remove("active");

  lecteur.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";


  /*
    Le carrousel reprend après fermeture.
  */

  pauseQuelquesSecondes(800);

}


fermer.addEventListener(
  "click",
  fermerFilm
);


/* =========================================
   CLIQUER EN DEHORS DE LA VIDÉO
========================================= */

lecteur.addEventListener(
  "click",
  function(event) {

    if (event.target === lecteur) {
      fermerFilm();
    }

  }
);


/* =========================================
   TOUCHE ESC
========================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {
      fermerFilm();
    }

  }
);


/* =========================================
   REDIMENSIONNEMENT
========================================= */

let resizeTimer;


window.addEventListener(
  "resize",
  function() {

    clearTimeout(resizeTimer);


    resizeTimer =
      setTimeout(
        function() {

          calculerDimensions();

        },
        100
      );

  }
);


/* =========================================
   ROTATION MOBILE
========================================= */

window.addEventListener(
  "orientationchange",
  function() {

    setTimeout(
      function() {

        calculerDimensions();

      },
      250
    );

  }
);


/* =========================================
   INITIALISATION
========================================= */

function initialiser() {

  /*
    On attend que les images aient commencé
    à se calculer avant de mesurer les cartes.
  */

  requestAnimationFrame(
    function() {

      calculerDimensions();


      /*
        Petit deuxième calcul pour les images
        qui terminent leur chargement.
      */

      setTimeout(
        calculerDimensions,
        500
      );


      /*
        Lancement du défilement.
      */

      animationFrame =
        requestAnimationFrame(
          animationAutomatique
        );

    }
  );

}


/* =========================================
   LANCEMENT
========================================= */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initialiser
  );

} else {

  initialiser();

}