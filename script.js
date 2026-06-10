document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.querySelector(".cart-count");
  const addToCartButtons = document.querySelectorAll("[data-add-to-cart]");
  const toast = document.querySelector("[data-toast]");

  if (cartCount) {
    cartCount.textContent = "1";
  }

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (cartCount) {
        const currentCount = Number(cartCount.textContent) || 0;
        cartCount.textContent = String(currentCount + 1);
      }

      if (toast) {
        toast.hidden = false;

        window.setTimeout(() => {
          toast.hidden = true;
        }, 2400);
      }
    });
  });

  const productGrid = document.querySelector("[data-product-grid]");
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const searchInput = document.querySelector("[data-product-search]");
  const sortSelect = document.querySelector("[data-sort-products]");
  const resultCount = document.querySelector("[data-result-count]");
  const emptyState = document.querySelector("[data-empty-state]");
  const filterInputs = Array.from(document.querySelectorAll("[data-filter]"));
  const resetButtons = document.querySelectorAll("[data-reset-filters]");

  function getCheckedValues(filterName) {
    return filterInputs
      .filter((input) => input.dataset.filter === filterName && input.checked)
      .map((input) => input.value);
  }

  function matchesAnyFilter(cardValue, selectedValues) {
    if (selectedValues.length === 0) {
      return true;
    }

    return selectedValues.some((value) => cardValue.includes(value));
  }

  function updateProducts() {
    if (!productGrid || productCards.length === 0) {
      return;
    }

    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const selectedLevels = getCheckedValues("level");
    const selectedLights = getCheckedValues("light");
    const selectedRooms = getCheckedValues("room");

    let visibleCards = productCards.filter((card) => {
      const name = card.dataset.name.toLowerCase();
      const level = card.dataset.level || "";
      const light = card.dataset.light || "";
      const room = card.dataset.room || "";

      const matchesSearch = name.includes(searchTerm);
      const matchesLevel = matchesAnyFilter(level, selectedLevels);
      const matchesLight = matchesAnyFilter(light, selectedLights);
      const matchesRoom = matchesAnyFilter(room, selectedRooms);

      return matchesSearch && matchesLevel && matchesLight && matchesRoom;
    });

    if (sortSelect) {
      const sortValue = sortSelect.value;

      visibleCards = visibleCards.sort((a, b) => {
        const priceA = Number(a.dataset.price);
        const priceB = Number(b.dataset.price);

        if (sortValue === "price-asc") {
          return priceA - priceB;
        }

        if (sortValue === "price-desc") {
          return priceB - priceA;
        }

        return 0;
      });
    }

    productCards.forEach((card) => {
      card.hidden = true;
    });

    visibleCards.forEach((card) => {
      card.hidden = false;
      productGrid.appendChild(card);
    });

    if (resultCount) {
      resultCount.textContent = String(visibleCards.length);
    }

    if (emptyState) {
      emptyState.hidden = visibleCards.length > 0;
    }
  }

  filterInputs.forEach((input) => {
    input.addEventListener("change", updateProducts);
  });

  if (searchInput) {
    searchInput.addEventListener("input", updateProducts);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", updateProducts);
  }

  resetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterInputs.forEach((input) => {
        input.checked = false;
      });

      if (searchInput) {
        searchInput.value = "";
      }

      if (sortSelect) {
        sortSelect.value = "recommended";
      }

      updateProducts();
    });
  });

  updateProducts();
});