import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

let swiper = null;

function initSwiper() {
  // Destroy existing swiper if it exists
  if (swiper) {
    swiper.destroy(true, true);
  }

  // Initialize new swiper
  swiper = new Swiper(".swiper_inspirations", {
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
      1200: {
        slidesPerView: 3,
        spaceBetween: 32,
        allowTouchMove: false,
      },
    },
  });
}

initSwiper();

// Reinitialize on resize with debounce
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initSwiper();
  }, 250); // Debounce resize events
});
