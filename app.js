
"use strict";

/* =========================================
   SMART DRIVE CAR HIRE SERVICES
   Main website functionality
========================================= */

const WHATSAPP_NUMBER = "254733920806";
const IMAGE_FOLDER = "images/";

/* VEHICLE CATALOGUE
   Keep filenames consistent with the images folder.
   Prices are in Kenyan shillings per day.
*/

const vehicles = [
  // SMALL CARS
  { name: "Mazda Demio", category: "small", image: "mazda-demio.jpeg", price: 2500 },
  { name: "Toyota Vitz", category: "small", image: "toyota-vitz.jpeg", price: 2500 },
  { name: "Honda Fit", category: "small", image: "honda-fit.jpeg", price: 2,500 },
  { name: "Nissan Note", category: "small", image: "nissan-note.jpeg", price: 2,500 },
  { name: "Toyota Passo", category: "small", image: "toyota-passo.jpeg", price: 2,000 },

  // MEDIUM CARS / SEDANS
  { name: "Toyota Axio", category: "medium", image: "toyota-axio.jpeg", price: 3,000 },
  { name: "Toyota Allion", category: "medium", image: "toyota-allion.jpeg", price: 3,000 },
  { name: "Toyota Fielder", category: "medium", image: "toyota-fielder.jpeg", price: 3,500 },
  { name: "Toyota Mark X", category: "medium", image: "toyota-mark-x.jpeg", price: 4,000 },
  { name: "Toyota Crown", category: "medium", image: "toyota-crown.jpeg", price: 3500 },
  { name: "Honda Civic", category: "medium", image: "honda-civic.jpeg", price: 3500 },
  { name: "Volkswagen Passat", category: "medium", image: "volkswagen-passat.jpeg", price: 3500 },
  { name: "Mazda Atenza", category: "medium", image: "mazda-atenza.jpeg", price: 3,500 },
  { name: "Mazda Axela", category: "medium", image: "mazda-axela.jpeg", price: 3,500 },
  { name: "Toyota Premio", category: "medium", image: "toyota-premio.jpeg", price: 3,000 },

  // MID-SIZE SUVs
  { name: "Mazda CX-3", category: "midsize-suv", image: "mazda-cx-3.jpeg", price: 4,000 },
  { name: "Mazda CX-5", category: "midsize-suv", image: "mazda-cx-5.jpeg", price: 4,500 },
  { name: "Honda CR-V", category: "midsize-suv", image: "honda-cr-v.jpeg", price: 4500 },
  { name: "Mitsubishi Outlander", category: "midsize-suv", image: "mitsubishi-outlander.jpeg", price: 4500 },
  { name: "Honda Vezel", category: "midsize-suv", image: "honda-vezel.jpeg", price: 4,000 },

  // SUVs & 4×4
  { name: "Toyota Harrier", category: "suv", image: "toyota-harrier.jpeg", price: 5,000 },
  { name: "Toyota Prado", category: "suv", image: "toyota-prado.jpeg", price: 8,000 },
  { name: "Land Cruiser V8", category: "suv", image: "land-cruiser-v8.jpeg", price: 10,000 },
  { name: "Nissan X-Trail", category: "suv", image: "nissan-x-trail.jpeg", price: 4,500 },
  { name: "Subaru Forester", category: "suv", image: "subaru-forester.jpeg", price: 5,000 },
  { name: "Mazda CX-8", category: "suv", image: "mazda-cx-8.jpeg", price: 6500 },
  { name: "Toyota Fortuner", category: "suv", image: "toyota-fortuner.jpeg", price: 4500 },

  // FAMILY VEHICLES
  { name: "Toyota Noah", category: "family", image: "toyota-noah.jpeg", price: 6,000 },
  { name: "Toyota Voxy", category: "family", image: "toyota-voxy.jpeg", price: 5,500 },
  { name: "Toyota Esquire", category: "family", image: "toyota-esquire.jpeg", price: 5000 },
  { name: "Nissan Serena", category: "family", image: "nissan-serena.jpeg", price: 5000 },
  { name: "Honda Stepwgn", category: "family", image: "honda-stepwgn.jpeg", price: 5000 },
  { name: "Mazda Biante", category: "family", image: "mazda-biante.jpeg", price: 5000 },

  // VANS & SPACIOUS VEHICLES
  { name: "Mitsubishi Delica", category: "van", image: "mitsubishi-delica.jpeg", price: 5000 },
  { name: "Nissan Elgrand", category: "van", image: "nissan-elgrand.jpeg", price: 5000 }
];

const categoryNames = {
  all: "All Vehicles",
  small: "Small Cars",
  medium: "Medium Cars",
  "midsize-suv": "Mid-Size SUVs",
  suv: "SUVs & 4×4",
  family: "Family Vehicles",
  van: "Vans & Spacious Vehicles"
};

const money = amount =>
  new Intl.NumberFormat("en-KE").format(amount);

const getPriceText = vehicle => {
  if (vehicle.price !== null) {
    return `KSh ${money(vehicle.price)} / day`;
  }

  if (vehicle.category === "small") {
    return "KSh 2,000–2,500 / day";
  }

  return "Contact us for price";
};

/* =========================================
   DOM REFERENCES AND PAGE STATE
========================================= */

const fleetGrid = document.getElementById("fleet-grid");
const similarSection = document.getElementById("similar-vehicles");
const similarGrid = document.getElementById("similar-grid");
const searchInput = document.getElementById("vehicle-search");
const filtersContainer = document.getElementById("fleet-filters");
const resultCount = document.getElementById("fleet-result-count");
const emptyMessage = document.getElementById("fleet-empty-message");
const vehicleSelect = document.getElementById("booking-vehicle");
const bookingForm = document.getElementById("booking-form");
const bookingStatus = document.getElementById("booking-status");

let activeCategory = "all";
let selectedVehicle = null;
let lightbox = null;

/* =========================================
   VEHICLE CARD CREATION
========================================= */

function createVehicleCard(vehicle, index) {
  const card = document.createElement("article");
  card.className = "vehicle-card";

  const imageButton = document.createElement("button");
  imageButton.type = "button";
  imageButton.className = "vehicle-image-button";
  imageButton.setAttribute("aria-label", `View larger photo of ${vehicle.name}`);

  const image = document.createElement("img");
  image.src = IMAGE_FOLDER + vehicle.image;
  image.alt = vehicle.name;
  image.loading = index < 6 ? "eager" : "lazy";
  image.decoding = "async";

  image.addEventListener("error", () => {
    imageButton.classList.add("image-unavailable");
    image.alt = `${vehicle.name} photo unavailable`;
    imageButton.title = `Image not found: ${vehicle.image}`;
  });

  imageButton.appendChild(image);
  imageButton.addEventListener("click", () => openLightbox(vehicle));

  const details = document.createElement("div");
  details.className = "vehicle-card-content";

  const category = document.createElement("p");
  category.className = "vehicle-category";
  category.textContent = categoryNames[vehicle.category];

  const title = document.createElement("h3");
  title.textContent = vehicle.name;

  const price = document.createElement("p");
  price.className = "vehicle-price";
  price.textContent = getPriceText(vehicle);

  const actions = document.createElement("div");
  actions.className = "vehicle-card-actions";

  const chooseButton = document.createElement("button");
  chooseButton.type = "button";
  chooseButton.className = "button button-gold";
  chooseButton.textContent = "Enquire Now";
  chooseButton.addEventListener("click", () => selectVehicle(vehicle));

  const similarButton = document.createElement("button");
  similarButton.type = "button";
  similarButton.className = "similar-link";
  similarButton.textContent = "Or Similar";
  similarButton.addEventListener("click", () => showSimilarVehicles(vehicle));

  actions.append(chooseButton, similarButton);
  details.append(category, title, price, actions);
  card.append(imageButton, details);

  return card;
}

function renderVehicles() {
  if (!fleetGrid) return;

  const query = (searchInput?.value || "").trim().toLowerCase();

  const filtered = vehicles.filter(vehicle => {
    const matchesCategory =
      activeCategory === "all" || vehicle.category === activeCategory;

    const matchesSearch =
      vehicle.name.toLowerCase().includes(query) ||
      categoryNames[vehicle.category].toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  fleetGrid.replaceChildren();

  filtered.forEach((vehicle, index) => {
    fleetGrid.appendChild(createVehicleCard(vehicle, index));
  });

  if (resultCount) {
    resultCount.textContent =
      `${filtered.length} vehicle${filtered.length === 1 ? "" : "s"} found`;
  }

  if (emptyMessage) {
    emptyMessage.hidden = filtered.length !== 0;
  }
}

/* =========================================
   FILTERS AND SEARCH
========================================= */

function setCategory(category) {
  if (!Object.hasOwn(categoryNames, category)) return;

  activeCategory = category;

  filtersContainer?.querySelectorAll("[data-filter]").forEach(button => {
    const isActive = button.dataset.filter === category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderVehicles();
}

filtersContainer?.addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  setCategory(button.dataset.filter);
});

searchInput?.addEventListener("input", renderVehicles);

document.querySelectorAll("[data-category-link]").forEach(link => {
  link.addEventListener("click", () => {
    setCategory(link.dataset.categoryLink);
  });
});

/* =========================================
   SIMILAR VEHICLES
========================================= */

function showSimilarVehicles(vehicle) {
  if (!similarSection || !similarGrid) return;

  const alternatives = vehicles
    .filter(item =>
      item.category === vehicle.category && item.name !== vehicle.name
    )
    .slice(0, 4);

  similarGrid.replaceChildren();

  alternatives.forEach((item, index) => {
    similarGrid.appendChild(createVehicleCard(item, index));
  });

  similarSection.hidden = alternatives.length === 0;

  if (alternatives.length > 0) {
    similarSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* =========================================
   BOOKING VEHICLE SELECTOR
========================================= */

function populateVehicleSelect() {
  if (!vehicleSelect) return;

  const previousValue = vehicleSelect.value;

  const options = vehicles.map(vehicle => {
    const option = document.createElement("option");
    option.value = vehicle.name;
    option.textContent = `${vehicle.name} — ${getPriceText(vehicle)}`;
    return option;
  });

  vehicleSelect.replaceChildren(
    new Option("Select a vehicle", ""),
    ...options
  );

  if (previousValue && vehicles.some(v => v.name === previousValue)) {
    vehicleSelect.value = previousValue;
  }
}

function selectVehicle(vehicle) {
  selectedVehicle = vehicle;

  if (vehicleSelect) {
    vehicleSelect.value = vehicle.name;
  }

  if (bookingStatus) {
    bookingStatus.textContent = `${vehicle.name} selected. Complete the form to continue.`;
  }

  document.getElementById("booking")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* =========================================
   VEHICLE QUANTITY CONTROLS
========================================= */

const quantityInput = document.getElementById("vehicle-quantity");

function updateQuantity(change) {
  if (!quantityInput) return;

  const current = Number.parseInt(quantityInput.value, 10) || 1;
  const min = Number(quantityInput.min) || 1;
  const max = Number(quantityInput.max) || 20;

  quantityInput.value = Math.max(min, Math.min(max, current + change));
}

document.getElementById("quantity-minus")?.addEventListener("click", () => {
  updateQuantity(-1);
});

document.getElementById("quantity-plus")?.addEventListener("click", () => {
  updateQuantity(1);
});

quantityInput?.addEventListener("change", () => {
  const min = Number.parseInt(quantityInput.min, 10) || 1;
  const max = Number.parseInt(quantityInput.max, 10) || 20;
  const value = Number.parseInt(quantityInput.value, 10) || min;

  quantityInput.value = Math.max(min, Math.min(max, value));
});

/* =========================================
   RENTAL DATE VALIDATION
========================================= */

const startDateInput = document.getElementById("rental-start");
const endDateInput = document.getElementById("rental-end");

function setMinimumReturnDate() {
  if (!startDateInput || !endDateInput) return;

  endDateInput.min = startDateInput.value || startDateInput.min;

  if (endDateInput.value && startDateInput.value &&
      endDateInput.value < startDateInput.value) {
    endDateInput.value = "";
  }
}

if (startDateInput) {
  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  startDateInput.min = localToday;
  endDateInput && (endDateInput.min = localToday);

  startDateInput.addEventListener("change", setMinimumReturnDate);
}

/* =========================================
   WHATSAPP BOOKING ENQUIRY
========================================= */

bookingForm?.addEventListener("submit", event => {
  event.preventDefault();

  if (!bookingForm.reportValidity()) return;

  const customerName = document.getElementById("customer-name").value.trim();
  const customerPhone = document.getElementById("customer-phone").value.trim();
  const customerEmail = document.getElementById("customer-email").value.trim();
  const vehicleName = vehicleSelect.value;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const quantity = Number.parseInt(quantityInput.value, 10) || 1;
  const service = document.getElementById("rental-service").value;
  const pickup = document.getElementById("pickup-location").value.trim();
  const delivery = document.getElementById("delivery-required").value;
  const extraMessage = document.getElementById("booking-message").value.trim();

  if (!vehicleName) {
    if (bookingStatus) bookingStatus.textContent = "Please select a vehicle.";
    vehicleSelect?.focus();
    return;
  }

  if (endDate < startDate) {
    if (bookingStatus) {
      bookingStatus.textContent = "The return date cannot be before the pickup date.";
    }
    endDateInput?.focus();
    return;
  }

  const chosen = vehicles.find(vehicle => vehicle.name === vehicleName);
  const priceText = chosen ? getPriceText(chosen) : "Contact us for price";

  const message = [
    "HELLO SMART DRIVE CAR HIRE SERVICES,",
    "",
    "I would like to enquire about a vehicle rental.",
    "",
    `Full name: ${customerName}`,
    `Phone number: ${customerPhone}`,
    `Email: ${customerEmail || "Not provided"}`,
    `Preferred vehicle: ${vehicleName}`,
    `Listed rate: ${priceText}`,
    `Number of vehicles: ${quantity}`,
    `Pickup date: ${startDate}`,
    `Return date: ${endDate}`,
    `Rental service: ${service}`,
    `Pickup location: ${pickup}`,
    `Vehicle delivery required: ${delivery}`,
    `Additional requests: ${extraMessage || "None"}`,
    "",
    "Please confirm availability and provide the applicable quotation and next steps.",
    "",
    "Thank you."
  ].join("\n");

  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  if (bookingStatus) {
    bookingStatus.textContent =
      "WhatsApp will open with your enquiry. Review the message and tap Send.";
  }

  const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  if (!newWindow) {
    window.location.href = whatsappUrl;
  }
});

/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("primary-navigation");

function closeNavigation() {
  if (!menuToggle || !navigation) return;

  navigation.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle?.addEventListener("click", () => {
  if (!navigation) return;

  const isOpen = navigation.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

navigation?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeNavigation);
});

/* =========================================
   HERO SLIDESHOW
========================================= */

const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroIndicators = document.getElementById("hero-indicators");
let currentSlide = 0;
let slideshowTimer;

function showSlide(index) {
  if (!heroSlides.length) return;

  currentSlide = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === currentSlide);
  });

  heroIndicators?.querySelectorAll("[data-slide]").forEach((button, i) => {
    button.classList.toggle("is-active", i === currentSlide);
    button.setAttribute("aria-pressed", String(i === currentSlide));
  });
}

function startSlideshow() {
  if (heroSlides.length < 2) return;

  clearInterval(slideshowTimer);
  slideshowTimer = setInterval(() => showSlide(currentSlide + 1), 10000);
}

heroIndicators?.addEventListener("click", event => {
  const button = event.target.closest("[data-slide]");
  if (!button) return;

  showSlide(Number(button.dataset.slide));
  startSlideshow();
});

/* =========================================
   PHOTO LIGHTBOX
========================================= */

function openLightbox(vehicle) {
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.className = "vehicle-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Vehicle photo");

    Object.assign(lightbox.style, {
      position: "fixed",
      inset: "0",
      zIndex: "9999",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "rgba(0,0,0,0.92)"
    });

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close photo");
    Object.assign(closeButton.style, {
      position: "absolute",
      top: "12px",
      right: "20px",
      border: "0",
      background: "transparent",
      color: "#fff",
      fontSize: "42px",
      cursor: "pointer"
    });

    const enlargedImage = document.createElement("img");
    enlargedImage.className = "lightbox-image";
    Object.assign(enlargedImage.style, {
      display: "block",
      maxWidth: "95vw",
      maxHeight: "85vh",
      objectFit: "contain"
    });

    const caption = document.createElement("p");
    caption.className = "lightbox-caption";
    Object.assign(caption.style, {
      position: "absolute",
      bottom: "8px",
      left: "12px",
      right: "12px",
      textAlign: "center",
      color: "#fff"
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.append(closeButton, enlargedImage, caption);
    document.body.appendChild(lightbox);

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeLightbox();
    });
  }

  lightbox.querySelector(".lightbox-image").src = IMAGE_FOLDER + vehicle.image;
  lightbox.querySelector(".lightbox-image").alt = vehicle.name;
  lightbox.querySelector(".lightbox-caption").textContent = vehicle.name;
  lightbox.style.display = "flex";
  document.body.style.overflow = "hidden";
  lightbox.querySelector("button").focus();
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.style.display = "none";
  document.body.style.overflow = "";
}

/* =========================================
   FOOTER AND INITIAL PAGE SETUP
========================================= */

const yearElement = document.getElementById("current-year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

populateVehicleSelect();
renderVehicles();
showSlide(0);
startSlideshow();

/* Helpful console check while developing. */
console.info(`Smart Drive: ${vehicles.length} vehicles loaded.`);
