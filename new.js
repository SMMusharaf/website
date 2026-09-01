/* =========================================================
   WILD FERN ESTATE — SCRIPT
   Beginner-friendly notes: each block below does ONE job.
   Read them top to bottom, in order.
   ========================================================= */

/* ---------- CONFIG: change this to your real WhatsApp number ----------
   Format: country code + number, NO "+", NO spaces, NO leading zero.
   Example for Sri Lanka: 94771234567
   Example for India:     919876543210            */
const WHATSAPP_NUMBER = "94771234567";


/* ---------- 1. HEADER: turn solid once the user scrolls down ---------- */
const siteHeader = document.getElementById("siteHeader");

function updateHeaderOnScroll() {
  if (window.scrollY > 60) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }
}
window.addEventListener("scroll", updateHeaderOnScroll);
updateHeaderOnScroll(); // run once in case the page loads already scrolled


/* ---------- 2. MOBILE MENU: hamburger opens/closes the nav ---------- */
const hamburger = document.getElementById("hamburger");
const mainNav = document.getElementById("mainNav");

hamburger.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

// Close the mobile menu automatically when a link is tapped
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});


/* ---------- 3. SCROLL REVEAL: fade/slide elements in as they appear ---------- */
// Every element with class "reveal" starts hidden (see CSS) and gets
// ".in-view" added the first time it scrolls into the viewport.
const revealTargets = document.querySelectorAll(".reveal");
const galleryTargets = document.querySelectorAll(".gallery-item");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target); // only animate once
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach((el) => revealObserver.observe(el));
galleryTargets.forEach((el) => revealObserver.observe(el));


/* ---------- 4. STAT COUNTER: numbers count up when the About section appears ---------- */
const statNumbers = document.querySelectorAll(".stat-number");

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400; // ms
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    // ease-out so the count slows down near the end
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

const countObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
statNumbers.forEach((el) => countObserver.observe(el));


/* ---------- 5. ROOM CARDS: "Select" button jumps to the form and pre-fills the room ---------- */
const roomButtons = document.querySelectorAll(".select-room");
const roomTypeField = document.getElementById("roomType");

roomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".room-card");
    const roomName = card.dataset.room;

    // Set the dropdown in the booking form to match the chosen room
    if (roomTypeField) {
      roomTypeField.value = roomName;
    }

    document.getElementById("book").scrollIntoView({ behavior: "smooth" });
  });
});


/* ---------- 6. BOOKING FORM: build a WhatsApp message and open it ---------- */
const bookingForm = document.getElementById("bookingForm");
const formNote = document.getElementById("formNote");

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the browser from trying to submit anywhere

  const name = document.getElementById("guestName").value.trim();
  const phone = document.getElementById("guestPhone").value.trim();
  const checkIn = document.getElementById("checkIn").value;
  const checkOut = document.getElementById("checkOut").value;
  const guests = document.getElementById("guestCount").value;
  const room = document.getElementById("roomType").value;
  const message = document.getElementById("guestMessage").value.trim();

  // Simple validation: make sure the required fields are filled in
  const requiredFields = [
    { value: name, id: "guestName" },
    { value: phone, id: "guestPhone" },
    { value: checkIn, id: "checkIn" },
    { value: checkOut, id: "checkOut" },
  ];

  let hasError = false;
  requiredFields.forEach((field) => {
    const row = document.getElementById(field.id).closest(".form-row");
    if (!field.value) {
      hasError = true;
      row.classList.add("shake");
      setTimeout(() => row.classList.remove("shake"), 400);
    }
  });

  if (hasError) {
    formNote.textContent = "Please fill in your name, phone and dates.";
    formNote.className = "form-note error";
    return;
  }

  if (checkOut && checkIn && checkOut <= checkIn) {
    formNote.textContent = "Check-out date should be after check-in.";
    formNote.className = "form-note error";
    return;
  }

  // Build a readable, pre-filled WhatsApp message
  const lines = [
    `Hi Wild Fern Estate, I'd like to check availability.`,
    ``,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Check-in: ${checkIn}`,
    `Check-out: ${checkOut}`,
    `Guests: ${guests}`,
    `Room: ${room}`,
  ];
  if (message) {
    lines.push(`Note: ${message}`);
  }

  const whatsappText = encodeURIComponent(lines.join("\n"));
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

  formNote.textContent = "Opening WhatsApp…";
  formNote.className = "form-note success";

  window.open(whatsappUrl, "_blank");
});


/* ---------- 7. FLOATING WHATSAPP BUTTON: send straight to WhatsApp if the form is already filled ---------- */
// If the user taps the floating button before opening the form, it just
// scrolls to the booking section (handled by the href="#book" in HTML).
// No extra JS needed for that — kept simple on purpose.


/* ---------- 8. FOOTER YEAR: always show the current year automatically ---------- */
document.getElementById("year").textContent = new Date().getFullYear();