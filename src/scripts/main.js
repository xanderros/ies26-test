// Initialize all modules after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  import("./nav.js");
  import("./sticky-header.js");
  import("./carousels.js");
});
