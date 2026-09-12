const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".header nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    nav.classList.toggle("open");
    menuButton.textContent = nav.classList.contains("open") ? "close" : "menu";
  });
}

const interestText = {
  planning: "how places grow and change.",
  communities: "how people shape and experience places.",
  environment: "what we can do to protect our Earth.",
  reading: "what i’m reading right now."
};

const interestNote = document.querySelector("#interest-note");
const readingCard = document.querySelector("#reading-card");

document.querySelectorAll(".interest").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".interest").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    if (interestNote) {
      interestNote.textContent = interestText[button.dataset.interest];
    }

    if (readingCard) {
      readingCard.hidden = button.dataset.interest !== "reading";
    }
  });
});

const starToggle = document.querySelector(".star-toggle");

if (starToggle) {
  const dimmer = document.createElement("div");
  dimmer.className = "page-dimmer";
  document.body.appendChild(dimmer);

  starToggle.addEventListener("click", () => {
    const isOn = document.body.classList.toggle("stars-on");
    starToggle.setAttribute("aria-pressed", String(isOn));
  });
}

const emailCopy = document.querySelector(".email-copy");

if (emailCopy) {
  emailCopy.addEventListener("click", async () => {
    const email = emailCopy.dataset.email;
    const status = emailCopy.querySelector(".copy-status");

    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    emailCopy.classList.add("copied");
    status.textContent = "copied!";

    setTimeout(() => {
      emailCopy.classList.remove("copied");
      status.textContent = "copy";
    }, 1600);
  });
}

// Tiny periodic clue near the secret door.
const doorSqueak = document.querySelector("#door-squeak");

if (doorSqueak) {
  const squeaks = ["squeak squeak", "squeak?", "*rustle*", "tiny footsteps"];
  let squeakIndex = 0;

  function showDoorClue() {
    doorSqueak.textContent = squeaks[squeakIndex % squeaks.length];
    squeakIndex += 1;
    doorSqueak.classList.add("show");

    setTimeout(() => {
      doorSqueak.classList.remove("show");
    }, 2200);
  }

  setTimeout(showDoorClue, 4500);
  setInterval(showDoorClue, 13000);
}

// Fade out when entering Butters' Domain.
document.querySelectorAll('a[href="butters-domain.html"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.add("page-leaving");
    setTimeout(() => {
      window.location.href = link.href;
    }, 300);
  });
});
