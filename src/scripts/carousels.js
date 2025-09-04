import EmblaCarousel from "embla-carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import Fade from "embla-carousel-fade";

// Global variables for Embla carousels
const carousels = {
  inspirations: null,
  topicsDefault: null,
  topicsReversed: null,
  tickets: null,
  location: null,
};

// Navigation cleanup functions storage
const cleanupFunctions = new Map();

// Utility: Destroy carousel and cleanup
const destroyCarousel = (name) => {
  const cleanup = cleanupFunctions.get(name);
  if (cleanup) {
    cleanup();
    cleanupFunctions.delete(name);
  }
  if (carousels[name]) {
    carousels[name].destroy();
    carousels[name] = null;
  }
};

// Utility: Setup navigation buttons
const setupNavigation = (container, carousel, isLooping = false) => {
  const prevButton = container.querySelector(".embla__button_prev");
  const nextButton = container.querySelector(".embla__button_next");

  if (!prevButton || !nextButton) return null;

  const prevHandler = () => carousel?.scrollPrev();
  const nextHandler = () => carousel?.scrollNext();
  const updateStates = () => {
    prevButton.disabled = isLooping ? false : !carousel?.canScrollPrev();
    nextButton.disabled = isLooping ? false : !carousel?.canScrollNext();
  };

  prevButton.addEventListener("click", prevHandler);
  nextButton.addEventListener("click", nextHandler);
  carousel.on("select", updateStates);
  carousel.on("init", updateStates);

  return () => {
    prevButton.removeEventListener("click", prevHandler);
    nextButton.removeEventListener("click", nextHandler);
  };
};

// Initialize Embla Carousel for Inspirations section
function initEmblaInspirations() {
  destroyCarousel("inspirations");

  if (window.innerWidth > 992) return;

  const container = document.querySelector(".embla_inspirations");
  if (!container) return;

  const options = {
    loop: false,
    align: "start",
    dragFree: false,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
    },
  };

  carousels.inspirations = EmblaCarousel(container, options);
}

// Initialize Embla Carousel for Topics section with AutoScroll plugin
function initEmblaTopics() {
  ["topicsDefault", "topicsReversed"].forEach(destroyCarousel);

  if (window.innerWidth < 768) return;

  const baseOptions = {
    loop: true,
    dragFree: false,
  };

  const autoScrollConfig = {
    startDelay: 0,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
    stopOnFocusIn: false,
  };

  // Default topics carousel (left-to-right)
  const defaultContainer = document.querySelector(".embla_topics_default");
  if (defaultContainer) {
    carousels.topicsDefault = EmblaCarousel(defaultContainer, baseOptions, [
      AutoScroll({ ...autoScrollConfig, speed: 1 }),
    ]);
  }

  // Reversed topics carousel (right-to-left)
  const reversedContainer = document.querySelector(".embla_topics_reversed");
  if (reversedContainer) {
    carousels.topicsReversed = EmblaCarousel(reversedContainer, baseOptions, [
      AutoScroll({ ...autoScrollConfig, speed: -1 }),
    ]);
  }
}

// Initialize Embla Carousel for Tickets section
function initEmblaTickets() {
  destroyCarousel("tickets");

  if (window.innerWidth < 576 || window.innerWidth > 991) return;

  const container = document.querySelector(".embla_tickets");
  if (!container) return;

  const options = {
    loop: false,
    align: "start",
    dragFree: false,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 701px)": { slidesToScroll: 2 },
    },
  };

  carousels.tickets = EmblaCarousel(container, options);
}

// Initialize Embla Carousel for Location section with fade effect
function initEmblaLocation() {
  destroyCarousel("location");

  const container = document.querySelector(".embla_location");
  if (!container) return;

  const options = {
    loop: true,
    containScroll: "trimSnaps",
    speed: 10,
  };
  carousels.location = EmblaCarousel(container, options, [Fade()]);

  const cleanup = setupNavigation(container, carousels.location, true);
  if (cleanup) cleanupFunctions.set("location", cleanup);
}

// Initialize all carousels
const initAllCarousels = () => {
  initEmblaInspirations();
  initEmblaTopics();
  initEmblaTickets();
  initEmblaLocation();
};

// Initialize
initAllCarousels();

// Debounced resize handler
let resizeTimer;
const handleResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initAllCarousels, 250);
};

window.addEventListener("resize", handleResize);
