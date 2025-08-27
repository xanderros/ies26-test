// Initialize sticky header
function initStickyHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  let isSticky = false;

  const toggleStickyHeader = () => {
    const shouldBeSticky = window.scrollY > 0;
    if (shouldBeSticky !== isSticky) {
      isSticky = shouldBeSticky;
      header.classList.toggle("is-sticky", shouldBeSticky);
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      requestAnimationFrame(toggleStickyHeader);
    },
    { passive: true }
  );

  toggleStickyHeader();
}

initStickyHeader();
