document.addEventListener("DOMContentLoaded", () => {
  console.log("GreenNest Prototyp geladen");

  const cartCount = document.querySelector(".cart-count");

  if (cartCount) {
    cartCount.textContent = "1";
  }
});