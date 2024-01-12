const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const backgroundImage = new Image();
backgroundImage.src = 'background.png'; // Remplacez par le chemin de votre image de fond

const groundImage = new Image();
groundImage.src = 'ground.png'; // Remplacez par le chemin de votre image pour le sol

const personnageArret = new Image();
const personnageDeplacementDroite1 = new Image();
const personnageDeplacementDroite2 = new Image();
const personnageDeplacementGauche1 = new Image();
const personnageDeplacementGauche2 = new Image();
const personnageSautDroite = new Image();
const personnageSautGauche = new Image();
const personnageAir = new Image();

personnageArret.src = '8bit_mario_arret.png';
personnageDeplacementDroite1.src = '8bit_mario_deplacement1.png';
personnageDeplacementDroite2.src = '8bit_mario_deplacement2.png';
personnageDeplacementGauche1.src = '8bit_mario_deplacement_gauche1.png';
personnageDeplacementGauche2.src = '8bit_mario_deplacement_gauche2.png';
personnageSautDroite.src = '8bit_mario_saut.png';
personnageSautGauche.src = '8bit_mario_saut_gauche.png';
personnageAir.src = '8bit_mario_saut.png';

const personnageLargeur = 50;
const personnageHauteur = 50;
let personnageX = 50;
let personnageY = canvas.height - personnageHauteur;
const personnageVitesse = 5;
let saut = false;
let sautCompteur = 17;
let gravite = 20;
const vitesseSaut = 0.08;
let enLair = false;
let enDeplacementDroite = false;
let enDeplacementGauche = false;
const touches = {};

backgroundImage.onload = function () {
    // Une fois que l'image de fond est chargée, démarrez le jeu
    update();
};

window.addEventListener("keydown", (e) => {
    touches[e.code] = true;
});

window.addEventListener("keyup", (e) => {
    touches[e.code] = false;
});

// Tableau d'objets définissant les répétitions du sol
const groundRepetitions = [];

function initGround() {
    const groundHeight = 60;
    const groundWidths = [210, 210, 210, 210]; // Ajustez les largeurs comme nécessaire

    let x = 0;
    for (const width of groundWidths) {
        groundRepetitions.push({
            x,
            y: canvas.height - groundHeight,
            width,
            height: groundHeight,
        });

        x += width;
    }
}

initGround(); // Initialise les répétitions du sol

function update() {
    // Dessinez l'image de fond
    const scale = Math.max(canvas.width / backgroundImage.width, canvas.height / backgroundImage.height);
    const bgWidth = backgroundImage.width * scale;
    const bgHeight = backgroundImage.height * scale;
    const bgX = (canvas.width - bgWidth) / 2;
    const bgY = (canvas.height - bgHeight) / 2;
    ctx.drawImage(backgroundImage, bgX, bgY, bgWidth, bgHeight);

    // Dessinez le sol
    for (const repetition of groundRepetitions) {
        ctx.drawImage(groundImage, repetition.x, repetition.y, repetition.width, repetition.height);
    }

    if (touches["ArrowLeft"] && personnageX > 0) {
        personnageX -= personnageVitesse;
        enDeplacementGauche = true;
        enDeplacementDroite = false;
    } else if (touches["ArrowRight"] && personnageX < canvas.width - personnageLargeur) {
        personnageX += personnageVitesse;
        enDeplacementDroite = true;
        enDeplacementGauche = false;
    } else {
        enDeplacementDroite = false;
        enDeplacementGauche = false;
    }

    if (!saut) {
        if (touches["Space"]) {
            saut = true;
            enLair = true;
        }
    } else {
        if (sautCompteur >= -10) {
            const neg = sautCompteur < 0 ? -1 : 1;
            personnageY -= (sautCompteur ** 2) * vitesseSaut * neg;
            sautCompteur -= 1;
        } else {
            saut = false;
            sautCompteur = 17;
            enLair = false;
        }
    }

    // Ajustez la hauteur du sol selon vos besoins
    const distanceToGround = 5;

    if (!enLair) {
        if (personnageY < canvas.height - personnageHauteur - groundRepetitions[0].height + distanceToGround - 5) {
            personnageY += gravite * 0.5;
        } else {
            personnageY = canvas.height - personnageHauteur - groundRepetitions[0].height + distanceToGround - 5;
        }
    }

    // Dessinez le personnage
    if (enLair) {
        if (enDeplacementDroite) {
            ctx.drawImage(personnageSautDroite, personnageX, personnageY, personnageLargeur, personnageHauteur);
        } else if (enDeplacementGauche) {
            ctx.drawImage(personnageSautGauche, personnageX, personnageY, personnageLargeur, personnageHauteur);
        } else {
            ctx.drawImage(personnageAir, personnageX, personnageY, personnageLargeur, personnageHauteur);
        }
    } else if (enDeplacementDroite) {
        const deplacementDroiteImage = (Math.floor(Date.now() / 100) % 2 === 0) ? personnageDeplacementDroite1 : personnageDeplacementDroite2;
        ctx.drawImage(deplacementDroiteImage, personnageX, personnageY, personnageLargeur, personnageHauteur);
    } else if (enDeplacementGauche) {
        const deplacementGaucheImage = (Math.floor(Date.now() / 100) % 2 === 0) ? personnageDeplacementGauche1 : personnageDeplacementGauche2;
        ctx.drawImage(deplacementGaucheImage, personnageX, personnageY, personnageLargeur, personnageHauteur);
    } else {
        ctx.drawImage(personnageArret, personnageX, personnageY, personnageLargeur, personnageHauteur);
    }

    requestAnimationFrame(update);
}
