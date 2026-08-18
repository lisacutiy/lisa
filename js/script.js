/* =========================================
   ELEMENTS
========================================= */

const contactBtn = document.getElementById("contactBtn");
const navContactBtn = document.getElementById("navContactBtn");

const contactModal = document.getElementById("contactModal");
const closeModal = document.getElementById("closeModal");
const modalOverlay = document.getElementById("modalOverlay");

const scrollButton = document.getElementById("scrollButton");
const aboutSection = document.getElementById("about");

const particlesContainer =
    document.getElementById("particles");


/* =========================================
   PARTICLES
========================================= */

function createParticles() {

    const particleCount =
        window.innerWidth <= 600
            ? 25
            : 45;

    particlesContainer.innerHTML = "";

    for (let i = 0; i < particleCount; i++) {

        const particle =
            document.createElement("span");

        particle.className = "particle";

        particle.style.left =
            Math.random() * 100 + "%";

        particle.style.animationDuration =
            (8 + Math.random() * 15) + "s";

        particle.style.animationDelay =
            (-Math.random() * 15) + "s";

        const size =
            1 + Math.random() * 3;

        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";

        particlesContainer.appendChild(
            particle
        );
    }
}


createParticles();


/* =========================================
   OPEN CONTACT CARD
========================================= */

function openContactCard() {

    contactModal.classList.add("active");

    contactModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

    closeModal.focus();
}


/* =========================================
   CLOSE CONTACT CARD
========================================= */

function closeContactCard() {

    contactModal.classList.remove("active");

    contactModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


/* =========================================
   BUTTON EVENTS
========================================= */

contactBtn.addEventListener(
    "click",
    openContactCard
);


navContactBtn.addEventListener(
    "click",
    openContactCard
);


closeModal.addEventListener(
    "click",
    closeContactCard
);


modalOverlay.addEventListener(
    "click",
    closeContactCard
);


/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            contactModal.classList.contains("active")
        ) {
            closeContactCard();
        }

    }
);


/* =========================================
   SCROLL BUTTON
========================================= */

scrollButton.addEventListener(
    "click",
    function () {

        aboutSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


/* =========================================
   RESIZE PARTICLES
========================================= */

let resizeTimer;

window.addEventListener(
    "resize",
    function () {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(
            createParticles,
            250
        );

    }
);


/* =========================================
   PREVENT PLACEHOLDER WEBSITE
========================================= */

const websiteLink =
    document.getElementById("websiteLink");

websiteLink.addEventListener(
    "click",
    function (event) {

        if (websiteLink.getAttribute("href") === "#") {
            event.preventDefault();
        }

    }
);
