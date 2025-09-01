import Swiper from "swiper";
import { Navigation, Autoplay, FreeMode, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

let swiperInspirations = null;
let swiperTopics = null;
let swiperTopicsReverse = null;
let swiperLocation = null;

function initSwiperInspirations() {
  // Destroy existing swiper if it exists
  if (swiperInspirations) {
    swiperInspirations.destroy(true, true);
    swiperInspirations = null;
  }

  if (window.innerWidth > 1200) return;

  // Check if inspirations swiper container exists
  const inspirationsContainer = document.querySelector(".swiper_inspirations");
  if (!inspirationsContainer) return;

  // Initialize new swiper
  swiperInspirations = new Swiper(inspirationsContainer, {
    modules: [Navigation],
    slidesPerView: 1,
    spaceBetween: 18,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 22,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 22,
        allowTouchMove: false,
      },
    },
  });
}

function initSwiperTopics(selector, reverseDirection = false) {
  const swiperInstance =
    selector === ".swiper_topics_ltr" ? swiperTopics : swiperTopicsReverse;

  // Destroy existing swiper if it exists and width < 768px
  if (swiperInstance && window.innerWidth < 768) {
    swiperInstance.destroy(true, true);
    if (selector === ".swiper_topics_ltr") {
      swiperTopics = null;
    } else {
      swiperTopicsReverse = null;
    }
    return;
  }

  // Initialize or reinitialize swiper if width >= 768px
  if (!swiperInstance && window.innerWidth >= 768) {
    // Calculate offset for RTL slider
    let offsetBefore = 0;
    if (selector === ".swiper_topics_rtl") {
      const swiperContainer = document.querySelector(selector);
      const slide = swiperContainer?.querySelector(".swiper-slide");
      if (slide) {
        const computedStyle = window.getComputedStyle(slide);
        const slideWidth = parseFloat(computedStyle.width);
        const spaceBetween = window.innerWidth >= 1200 ? 28 : 22;
        offsetBefore = (slideWidth + spaceBetween) / 2;
      }
    }

    const newSwiper = new Swiper(selector, {
      modules: [Autoplay, FreeMode],
      loop: true,
      autoplay: {
        delay: 1500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        reverseDirection: reverseDirection,
      },
      speed: 3000,
      freeMode: true,
      freeModeMomentum: false,
      centeredSlides: true,
      slidesPerView: "auto",
      spaceBetween: 22,
      slidesOffsetBefore: offsetBefore,
      effect: "slide",
      grabCursor: true,
      breakpoints: {
        768: {
          spaceBetween: 22,
        },
        1200: {
          spaceBetween: 28,
        },
      },
    });

    // Store the instance in the appropriate variable
    if (selector === ".swiper_topics_ltr") {
      swiperTopics = newSwiper;
    } else {
      swiperTopicsReverse = newSwiper;
    }
  }
}

function initSwiperLocation() {
  // Destroy existing swiper if it exists
  if (swiperLocation) {
    swiperLocation.destroy(true, true);
  }

  // Check if location swiper container exists
  const locationContainer = document.querySelector(".swiper_location");
  if (!locationContainer) return;

  // Initialize new swiper
  swiperLocation = new Swiper(locationContainer, {
    modules: [Navigation, EffectFade],
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    speed: 600,
    loop: true,
    navigation: {
      nextEl: ".location__arrow_next",
      prevEl: ".location__arrow_prev",
    },
    allowTouchMove: true,
    grabCursor: true,
  });
}

initSwiperInspirations();
initSwiperTopics(".swiper_topics_ltr", false);
initSwiperTopics(".swiper_topics_rtl", true);
initSwiperLocation();

// Reinitialize on resize with debounce
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initSwiperInspirations();
    initSwiperTopics(".swiper_topics_ltr", false);
    initSwiperTopics(".swiper_topics_rtl", true);
    initSwiperLocation();
  }, 250); // Debounce resize events
});
