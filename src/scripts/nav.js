// Initialize navigation
function initNavigation() {
  const header = document.querySelector(".header");
  if (!header) return;

  const burger = header.querySelector(".header__burger");

  function closeMenu() {
    document.body.classList.remove("is-nav-opened");
    burger.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    document.body.classList.add("is-nav-opened");
    burger.setAttribute("aria-expanded", "true");
  }

  burger.addEventListener("click", function () {
    const isExpanded = burger.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking on link
  const navLinks = document.querySelectorAll(
    ".header__nav-link, .header__nav-btn"
  );
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu on escape key
  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      document.body.classList.contains("is-nav-opened")
    ) {
      closeMenu();
    }
  });
}

initNavigation();
