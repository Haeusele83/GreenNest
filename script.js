document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "greennestCart";
  const ADDRESS_KEY = "greennestAddress";
  const DELIVERY_KEY = "greennestDelivery";

  const products = {
    "monstera-easy": {
      id: "monstera-easy",
      name: "Monstera Easy",
      category: "Pflegeleicht · hell bis halbschattig",
      description: "Topfgrösse S · ca. 35 cm · Pflegekarte inklusive",
      price: 34.9,
      image: "assets/images/monstera-easy.jpg"
    },
    "sansevieria-calm": {
      id: "sansevieria-calm",
      name: "Sansevieria Calm",
      category: "Sehr pflegeleicht · wenig Wasser",
      description: "Robuste Pflanze · wenig Wasser · ideal für Büro und Schlafzimmer",
      price: 29.9,
      image: "assets/images/sansevieria-calm.jpg"
    },
    "pothos-starter": {
      id: "pothos-starter",
      name: "Pothos Starter",
      category: "Pflegeleicht · wächst schnell",
      description: "Hängepflanze · ideal für Regale und kleine Wohnungen",
      price: 24.9,
      image: "assets/images/pothos-starter.jpg"
    },
    "calathea-soft": {
      id: "calathea-soft",
      name: "Calathea Soft",
      category: "Mittel · liebt Luftfeuchtigkeit",
      description: "Dekorative Pflanze · indirektes Licht · ruhige Räume",
      price: 39.9,
      image: "assets/images/calathea-soft.jpg"
    },
    "ficus-elastica-green": {
      id: "ficus-elastica-green",
      name: "Ficus Elastica Green",
      category: "Mittel · heller Standort",
      description: "Elegante Pflanze · kräftige Blätter · moderner Look",
      price: 44.9,
      image: "assets/images/ficus-elastica-green.jpg"
    },
    "peace-lily-home": {
      id: "peace-lily-home",
      name: "Peace Lily Home",
      category: "Mittel · ruhige Räume",
      description: "Friedenslilie · halbschattig · mit weisser Blüte",
      price: 32.9,
      image: "assets/images/peace-lily-home.jpg"
    },
    "aloe-vera-pure": {
      id: "aloe-vera-pure",
      name: "Aloe Vera Pure",
      category: "Einfach · sonniger Standort",
      description: "Sukkulente · wenig Wasser · ideal für helle Fensterplätze",
      price: 22.9,
      image: "assets/images/aloe-vera-pure.jpg"
    },
    "zz-plant-robust": {
      id: "zz-plant-robust",
      name: "ZZ Plant Robust",
      category: "Einfach · wenig Licht",
      description: "Robuste Pflanze · geeignet für Büro, Flur und Schlafzimmer",
      price: 36.9,
      image: "assets/images/zz-plant-robust.jpg"
    },
    "keramiktopf-sand": {
      id: "keramiktopf-sand",
      name: "Keramiktopf Sand",
      category: "Zubehör · Keramik",
      description: "Schlichter Übertopf in Sandfarbe · passend zu vielen Pflanzen",
      price: 16.9,
      image: "assets/images/keramiktopf-sand.jpg"
    },
    "bio-pflanzenerde": {
      id: "bio-pflanzenerde",
      name: "Bio Pflanzenerde",
      category: "Zubehör · nachhaltig",
      description: "Torffreie Erde · geeignet für Zimmerpflanzen",
      price: 12.9,
      image: "assets/images/bio-pflanzenerde.jpg"
    },
    "pflege-starter-set": {
      id: "pflege-starter-set",
      name: "Pflege Starter Set",
      category: "Zubehör · für den Start",
      description: "Sprühflasche, Pflegekarte und kleine Giesshilfe",
      price: 19.9,
      image: "assets/images/pflege-starter-set.jpg"
    },
    "giesskanne-minimal": {
      id: "giesskanne-minimal",
      name: "Giesskanne Minimal",
      category: "Zubehör · Pflege",
      description: "Kleine Giesskanne mit schmaler Tülle für den Innenbereich",
      price: 21.9,
      image: "assets/images/giesskanne-minimal.jpg"
    }
  };

  const formatCHF = (value) => `CHF ${value.toFixed(2)}`;

  const slugify = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const getCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  };

  const getAddress = () => {
    try {
      return JSON.parse(localStorage.getItem(ADDRESS_KEY)) || {};
    } catch {
      return {};
    }
  };

  const saveAddress = (address) => {
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
  };

  const updateCartCount = () => {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll(".cart-count").forEach((element) => {
      element.textContent = String(count);
    });
  };

  const showToast = (message = "Produkt wurde dem Warenkorb hinzugefügt.") => {
    const toast = document.querySelector("[data-toast]");

    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.hidden = false;

    window.setTimeout(() => {
      toast.hidden = true;
    }, 2400);
  };

  const addToCart = (productId, quantity = 1) => {
    const product = products[productId];

    if (!product) {
      console.warn(`Produkt nicht gefunden: ${productId}`);
      return;
    }

    const cart = getCart();
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: productId,
        quantity
      });
    }

    saveCart(cart);
    showToast(`${product.name} wurde dem Warenkorb hinzugefügt.`);
  };

  const getProductIdFromButton = (button) => {
    if (button.dataset.productId) {
      return button.dataset.productId;
    }

    const productCard = button.closest(".product-card");

    if (productCard && productCard.dataset.name) {
      return slugify(productCard.dataset.name);
    }

    return "monstera-easy";
  };

  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = getProductIdFromButton(button);
      addToCart(productId);
    });
  });

  function setupProductListing() {
    const productGrid = document.querySelector("[data-product-grid]");
    const productCards = Array.from(document.querySelectorAll(".product-card"));
    const searchInput = document.querySelector("[data-product-search]");
    const sortSelect = document.querySelector("[data-sort-products]");
    const resultCount = document.querySelector("[data-result-count]");
    const emptyState = document.querySelector("[data-empty-state]");
    const filterInputs = Array.from(document.querySelectorAll("[data-filter]"));
    const resetButtons = document.querySelectorAll("[data-reset-filters]");

    if (!productGrid || productCards.length === 0) {
      return;
    }

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
        visibleCards = visibleCards.sort((a, b) => {
          const priceA = Number(a.dataset.price);
          const priceB = Number(b.dataset.price);

          if (sortSelect.value === "price-asc") {
            return priceA - priceB;
          }

          if (sortSelect.value === "price-desc") {
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
  }

  function setupCartPage() {
    const cartItemsContainer = document.querySelector(".cart-items");
    const subtotalElement = document.querySelector("[data-subtotal]");
    const shippingElement = document.querySelector("[data-shipping]");
    const totalElement = document.querySelector("[data-total]");
    const emptyCart = document.querySelector("[data-empty-cart]");
    const cartContent = document.querySelector("[data-cart-content]");

    if (!cartItemsContainer || !subtotalElement || !shippingElement || !totalElement) {
      return;
    }

    function renderCart() {
      const cart = getCart();

      cartItemsContainer.innerHTML = "";

      if (cart.length === 0) {
        if (emptyCart) {
          emptyCart.hidden = false;
        }

        if (cartContent) {
          cartContent.hidden = true;
        }

        subtotalElement.textContent = formatCHF(0);
        shippingElement.textContent = formatCHF(0);
        totalElement.textContent = formatCHF(0);
        updateCartCount();
        return;
      }

      if (emptyCart) {
        emptyCart.hidden = true;
      }

      if (cartContent) {
        cartContent.hidden = false;
      }

      cart.forEach((item) => {
        const product = products[item.id];

        if (!product) {
          return;
        }

        const cartItem = document.createElement("article");
        cartItem.className = "cart-item";
        cartItem.dataset.cartItem = "";
        cartItem.dataset.productId = product.id;

        cartItem.innerHTML = `
          <div class="cart-item-image">
            <img src="${product.image}" alt="${product.name}" />
          </div>

          <div class="cart-item-content">
            <div class="cart-item-main">
              <div>
                <p class="product-category">${product.category}</p>
                <h2>${product.name}</h2>
                <p class="cart-item-description">${product.description}</p>
              </div>

              <p class="cart-item-price">${formatCHF(product.price)}</p>
            </div>

            <div class="cart-item-controls">
              <label>
                Menge
                <select data-cart-qty aria-label="Menge ${product.name}">
                  <option value="1" ${item.quantity === 1 ? "selected" : ""}>1</option>
                  <option value="2" ${item.quantity === 2 ? "selected" : ""}>2</option>
                  <option value="3" ${item.quantity === 3 ? "selected" : ""}>3</option>
                  <option value="4" ${item.quantity === 4 ? "selected" : ""}>4</option>
                </select>
              </label>

              <button class="text-button danger-button" type="button" data-cart-remove>
                Entfernen
              </button>

              <p class="cart-line-total" data-cart-line-total>
                ${formatCHF(product.price * item.quantity)}
              </p>
            </div>
          </div>
        `;

        cartItemsContainer.appendChild(cartItem);
      });

      const note = document.createElement("div");
      note.className = "cart-note";
      note.innerHTML = `
        <span>🌱</span>
        <div>
          <h2>Gut zu wissen</h2>
          <p>
            Deine Pflanzen werden erst kurz vor dem Versand verpackt.
            So bleiben sie frisch und kommen geschützt bei dir an.
          </p>
        </div>
      `;

      cartItemsContainer.appendChild(note);

      updateCartSummary();
    }

    function updateCartSummary() {
      const cart = getCart();

      const subtotal = cart.reduce((sum, item) => {
        const product = products[item.id];

        if (!product) {
          return sum;
        }

        return sum + product.price * item.quantity;
      }, 0);

      const shipping = subtotal > 0 ? 6.9 : 0;
      const total = subtotal + shipping;

      subtotalElement.textContent = formatCHF(subtotal);
      shippingElement.textContent = formatCHF(shipping);
      totalElement.textContent = formatCHF(total);

      updateCartCount();
    }

    cartItemsContainer.addEventListener("change", (event) => {
      const quantitySelect = event.target.closest("[data-cart-qty]");

      if (!quantitySelect) {
        return;
      }

      const cartItem = quantitySelect.closest("[data-cart-item]");
      const productId = cartItem.dataset.productId;
      const newQuantity = Number(quantitySelect.value);

      const cart = getCart().map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            quantity: newQuantity
          };
        }

        return item;
      });

      saveCart(cart);
      renderCart();
    });

    cartItemsContainer.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-cart-remove]");

      if (!removeButton) {
        return;
      }

      const cartItem = removeButton.closest("[data-cart-item]");
      const productId = cartItem.dataset.productId;

      const cart = getCart().filter((item) => item.id !== productId);

      saveCart(cart);
      renderCart();
    });

    renderCart();
  }

  function setupAddressValidation() {
    const form = document.querySelector("[data-checkout-address-form]");

    if (!form) {
      return;
    }

    const showError = (field, message) => {
      const wrapper = field.closest(".form-field");
      const error = document.querySelector(`[data-error-for="${field.id}"]`);

      if (wrapper) {
        wrapper.classList.add("has-error");
      }

      if (error) {
        error.textContent = message;
      }
    };

    const clearError = (field) => {
      const wrapper = field.closest(".form-field");
      const error = document.querySelector(`[data-error-for="${field.id}"]`);

      if (wrapper) {
        wrapper.classList.remove("has-error");
      }

      if (error) {
        error.textContent = "";
      }
    };

    const validateField = (field) => {
      clearError(field);

      const value = field.value.trim();

      if (field.hasAttribute("data-required") && value === "") {
        showError(field, "Bitte fülle dieses Pflichtfeld aus.");
        return false;
      }

      if (field.hasAttribute("data-email") && value !== "") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
          showError(field, "Bitte gib eine gültige E-Mail-Adresse ein.");
          return false;
        }
      }

      if (field.hasAttribute("data-zip") && value !== "") {
        const zipPattern = /^[0-9]{4}$/;

        if (!zipPattern.test(value)) {
          showError(field, "Bitte gib eine gültige vierstellige Schweizer PLZ ein.");
          return false;
        }
      }

      return true;
    };

    const fields = Array.from(form.querySelectorAll("input, select, textarea"));

    fields.forEach((field) => {
      field.addEventListener("blur", () => {
        validateField(field);
      });

      field.addEventListener("input", () => {
        const wrapper = field.closest(".form-field");

        if (wrapper && wrapper.classList.contains("has-error")) {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", (event) => {
      const fieldsToValidate = fields.filter((field) => {
        return (
          field.hasAttribute("data-required") ||
          field.hasAttribute("data-email") ||
          field.hasAttribute("data-zip")
        );
      });

      let isValid = true;

      fieldsToValidate.forEach((field) => {
        const fieldIsValid = validateField(field);

        if (!fieldIsValid) {
          isValid = false;
        }
      });

      if (!isValid) {
        event.preventDefault();

        const firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");

        if (firstError) {
          firstError.focus();
        }

        return;
      }

      const formData = new FormData(form);

      saveAddress({
        firstName: formData.get("firstName") || "",
        lastName: formData.get("lastName") || "",
        email: formData.get("email") || "",
        street: formData.get("street") || "",
        additionalAddress: formData.get("additionalAddress") || "",
        zip: formData.get("zip") || "",
        city: formData.get("city") || "",
        country: formData.get("country") || "Schweiz",
        deliveryNote: formData.get("deliveryNote") || "",
        billingSame: formData.get("billingSame") === "on"
      });
    });

    const savedAddress = getAddress();

    Object.entries(savedAddress).forEach(([name, value]) => {
      const field = form.elements[name];

      if (!field) {
        return;
      }

      if (field.type === "checkbox") {
        field.checked = Boolean(value);
      } else {
        field.value = value;
      }
    });
  }
  const getDelivery = () => {
    try {
      return JSON.parse(localStorage.getItem(DELIVERY_KEY)) || {};
    } catch {
      return {};
    }
  }

  const saveDelivery = (delivery) => {
    localStorage.setItem(DELIVERY_KEY, JSON.stringify(delivery));
  };

  setupProductListing();
  setupCartPage();
  setupAddressValidation();
  setupDeliverySelection();
  updateCartCount();
});
document.addEventListener("DOMContentLoaded", () => {
  const deliveryForm = document.querySelector("[data-delivery-form]");

  if (!deliveryForm) {
    return;
  }

  const DELIVERY_KEY = "greennestDelivery";
  const titleElement = document.querySelector("[data-delivery-summary-title]");
  const priceElement = document.querySelector("[data-delivery-summary-price]");

  const formatCHF = (value) => `CHF ${Number(value).toFixed(2)}`;

  function updateDeliverySummary() {
    const selectedOption = deliveryForm.querySelector("[data-delivery-option]:checked");

    if (!selectedOption) {
      return;
    }

    const title = selectedOption.dataset.deliveryTitle;
    const price = selectedOption.dataset.deliveryPrice;

    if (titleElement) {
      titleElement.textContent = title;
    }

    if (priceElement) {
      priceElement.textContent = formatCHF(price);
    }

    localStorage.setItem(
      DELIVERY_KEY,
      JSON.stringify({
        option: selectedOption.value,
        title: title,
        price: Number(price)
      })
    );
  }

  deliveryForm.addEventListener("change", (event) => {
    if (event.target.matches("[data-delivery-option]")) {
      updateDeliverySummary();
    }
  });

  deliveryForm.addEventListener("click", () => {
    window.setTimeout(updateDeliverySummary, 0);
  });

  updateDeliverySummary();
});
document.addEventListener("DOMContentLoaded", () => {
  const paymentForm = document.querySelector("[data-payment-form]");

  if (!paymentForm) {
    return;
  }

  const PAYMENT_KEY = "greennestPayment";
  const titleElement = document.querySelector("[data-payment-summary-title]");
  const detailPanels = Array.from(document.querySelectorAll("[data-payment-detail]"));

  function updatePaymentSummary() {
    const selectedOption = paymentForm.querySelector("[data-payment-option]:checked");

    if (!selectedOption) {
      return;
    }

    const title = selectedOption.dataset.paymentTitle;

    if (titleElement) {
      titleElement.textContent = title;
    }

    detailPanels.forEach((panel) => {
      panel.hidden = panel.dataset.paymentDetail !== selectedOption.value;
    });

    localStorage.setItem(
      PAYMENT_KEY,
      JSON.stringify({
        option: selectedOption.value,
        title: title
      })
    );
  }

  paymentForm.addEventListener("change", (event) => {
    if (event.target.matches("[data-payment-option]")) {
      updatePaymentSummary();
    }
  });

  paymentForm.addEventListener("submit", () => {
    updatePaymentSummary();
  });

  updatePaymentSummary();
});
document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.querySelector("[data-review-form]");

  if (!reviewForm) {
    return;
  }

  const CART_KEY = "greennestCart";
  const ADDRESS_KEY = "greennestAddress";
  const DELIVERY_KEY = "greennestDelivery";
  const PAYMENT_KEY = "greennestPayment";
  const ORDER_KEY = "greennestOrder";

  const products = {
    "monstera-easy": {
      name: "Monstera Easy",
      category: "Pflegeleicht · hell bis halbschattig",
      price: 34.9,
      image: "assets/images/monstera-easy.jpg"
    },
    "sansevieria-calm": {
      name: "Sansevieria Calm",
      category: "Sehr pflegeleicht · wenig Wasser",
      price: 29.9,
      image: "assets/images/sansevieria-calm.jpg"
    },
    "pothos-starter": {
      name: "Pothos Starter",
      category: "Pflegeleicht · wächst schnell",
      price: 24.9,
      image: "assets/images/pothos-starter.jpg"
    },
    "calathea-soft": {
      name: "Calathea Soft",
      category: "Mittel · liebt Luftfeuchtigkeit",
      price: 39.9,
      image: "assets/images/calathea-soft.jpg"
    },
    "ficus-elastica-green": {
      name: "Ficus Elastica Green",
      category: "Mittel · heller Standort",
      price: 44.9,
      image: "assets/images/ficus-elastica-green.jpg"
    },
    "peace-lily-home": {
      name: "Peace Lily Home",
      category: "Mittel · ruhige Räume",
      price: 32.9,
      image: "assets/images/peace-lily-home.jpg"
    },
    "aloe-vera-pure": {
      name: "Aloe Vera Pure",
      category: "Einfach · sonniger Standort",
      price: 22.9,
      image: "assets/images/aloe-vera-pure.jpg"
    },
    "zz-plant-robust": {
      name: "ZZ Plant Robust",
      category: "Einfach · wenig Licht",
      price: 36.9,
      image: "assets/images/zz-plant-robust.jpg"
    },
    "keramiktopf-sand": {
      name: "Keramiktopf Sand",
      category: "Zubehör · Keramik",
      price: 16.9,
      image: "assets/images/keramiktopf-sand.jpg"
    },
    "bio-pflanzenerde": {
      name: "Bio Pflanzenerde",
      category: "Zubehör · nachhaltig",
      price: 12.9,
      image: "assets/images/bio-pflanzenerde.jpg"
    },
    "pflege-starter-set": {
      name: "Pflege Starter Set",
      category: "Zubehör · für den Start",
      price: 19.9,
      image: "assets/images/pflege-starter-set.jpg"
    },
    "giesskanne-minimal": {
      name: "Giesskanne Minimal",
      category: "Zubehör · Pflege",
      price: 21.9,
      image: "assets/images/giesskanne-minimal.jpg"
    }
  };

  const readStorage = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  };

  const formatCHF = (value) => `CHF ${Number(value).toFixed(2)}`;

  const cart = readStorage(CART_KEY, []);
  const address = readStorage(ADDRESS_KEY, {});
  const delivery = readStorage(DELIVERY_KEY, {
    option: "standard",
    title: "Standardlieferung",
    price: 6.9
  });
  const payment = readStorage(PAYMENT_KEY, {
    option: "twint",
    title: "TWINT"
  });

  const itemContainer = document.querySelector("[data-review-items]");
  const emptyState = document.querySelector("[data-review-empty]");
  const addressElement = document.querySelector("[data-review-address]");
  const deliveryTitleElement = document.querySelector("[data-review-delivery-title]");
  const deliveryPriceElement = document.querySelector("[data-review-delivery-price]");
  const paymentTitleElement = document.querySelector("[data-review-payment-title]");
  const subtotalElement = document.querySelector("[data-review-subtotal]");
  const shippingElement = document.querySelector("[data-review-shipping]");
  const totalElement = document.querySelector("[data-review-total]");
  const termsCheckbox = document.querySelector("[data-terms-checkbox]");
  const termsError = document.querySelector("[data-terms-error]");

  const validCartItems = cart.filter((item) => products[item.id]);

  const subtotal = validCartItems.reduce((sum, item) => {
    return sum + products[item.id].price * item.quantity;
  }, 0);

  const shipping = validCartItems.length > 0 ? Number(delivery.price || 0) : 0;
  const total = subtotal + shipping;

  if (itemContainer) {
    itemContainer.innerHTML = "";

    if (validCartItems.length === 0) {
      if (emptyState) {
        emptyState.hidden = false;
      }
    } else {
      if (emptyState) {
        emptyState.hidden = true;
      }

      validCartItems.forEach((item) => {
        const product = products[item.id];
        const lineTotal = product.price * item.quantity;

        const reviewItem = document.createElement("article");
        reviewItem.className = "review-item";

        reviewItem.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />

          <div>
            <p class="product-category">${product.category}</p>
            <h3>${product.name}</h3>
            <p>Menge: ${item.quantity} · Einzelpreis: ${formatCHF(product.price)}</p>
          </div>

          <strong class="review-item-price">${formatCHF(lineTotal)}</strong>
        `;

        itemContainer.appendChild(reviewItem);
      });
    }
  }

  if (addressElement) {
    if (address.firstName && address.lastName && address.street && address.zip && address.city) {
      const additionalAddress = address.additionalAddress
        ? `<br>${address.additionalAddress}`
        : "";

      const deliveryNote = address.deliveryNote
        ? `<br><br><strong>Lieferhinweis:</strong><br>${address.deliveryNote}`
        : "";

      addressElement.innerHTML = `
        ${address.firstName} ${address.lastName}<br>
        ${address.street}
        ${additionalAddress}<br>
        ${address.zip} ${address.city}<br>
        ${address.country || "Schweiz"}
        ${deliveryNote}
      `;
    } else {
      addressElement.innerHTML = `
        Noch keine vollständige Adresse erfasst.<br>
        Bitte gehe zurück zum Adressschritt.
      `;
    }
  }

  if (deliveryTitleElement) {
    deliveryTitleElement.textContent = delivery.title || "Standardlieferung";
  }

  if (deliveryPriceElement) {
    deliveryPriceElement.textContent = formatCHF(shipping);
  }

  if (paymentTitleElement) {
    paymentTitleElement.textContent = payment.title || "TWINT";
  }

  if (subtotalElement) {
    subtotalElement.textContent = formatCHF(subtotal);
  }

  if (shippingElement) {
    shippingElement.textContent = formatCHF(shipping);
  }

  if (totalElement) {
    totalElement.textContent = formatCHF(total);
  }

  if (termsCheckbox && termsError) {
    termsCheckbox.addEventListener("change", () => {
      if (termsCheckbox.checked) {
        termsError.textContent = "";
      }
    });
  }

  reviewForm.addEventListener("submit", (event) => {
    if (validCartItems.length === 0) {
      event.preventDefault();

      if (termsError) {
        termsError.textContent = "Bitte füge zuerst ein Produkt zum Warenkorb hinzu.";
      }

      return;
    }

    if (termsCheckbox && !termsCheckbox.checked) {
      event.preventDefault();

      if (termsError) {
        termsError.textContent = "Bitte akzeptiere die AGB und Datenschutzbestimmungen.";
      }

      termsCheckbox.focus();
      return;
    }

    const orderNumber = `GN-${Date.now().toString().slice(-6)}`;

    localStorage.setItem(
      ORDER_KEY,
      JSON.stringify({
        orderNumber,
        items: validCartItems,
        address,
        delivery,
        payment,
        subtotal,
        shipping,
        total,
        createdAt: new Date().toISOString()
      })
    );
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const confirmationItems = document.querySelector("[data-confirmation-items]");

  if (!confirmationItems) {
    return;
  }

  const CART_KEY = "greennestCart";
  const ORDER_KEY = "greennestOrder";

  const products = {
    "monstera-easy": {
      name: "Monstera Easy",
      category: "Pflegeleicht · hell bis halbschattig",
      price: 34.9,
      image: "assets/images/monstera-easy.jpg"
    },
    "sansevieria-calm": {
      name: "Sansevieria Calm",
      category: "Sehr pflegeleicht · wenig Wasser",
      price: 29.9,
      image: "assets/images/sansevieria-calm.jpg"
    },
    "pothos-starter": {
      name: "Pothos Starter",
      category: "Pflegeleicht · wächst schnell",
      price: 24.9,
      image: "assets/images/pothos-starter.jpg"
    },
    "calathea-soft": {
      name: "Calathea Soft",
      category: "Mittel · liebt Luftfeuchtigkeit",
      price: 39.9,
      image: "assets/images/calathea-soft.jpg"
    },
    "ficus-elastica-green": {
      name: "Ficus Elastica Green",
      category: "Mittel · heller Standort",
      price: 44.9,
      image: "assets/images/ficus-elastica-green.jpg"
    },
    "peace-lily-home": {
      name: "Peace Lily Home",
      category: "Mittel · ruhige Räume",
      price: 32.9,
      image: "assets/images/peace-lily-home.jpg"
    },
    "aloe-vera-pure": {
      name: "Aloe Vera Pure",
      category: "Einfach · sonniger Standort",
      price: 22.9,
      image: "assets/images/aloe-vera-pure.jpg"
    },
    "zz-plant-robust": {
      name: "ZZ Plant Robust",
      category: "Einfach · wenig Licht",
      price: 36.9,
      image: "assets/images/zz-plant-robust.jpg"
    },
    "keramiktopf-sand": {
      name: "Keramiktopf Sand",
      category: "Zubehör · Keramik",
      price: 16.9,
      image: "assets/images/keramiktopf-sand.jpg"
    },
    "bio-pflanzenerde": {
      name: "Bio Pflanzenerde",
      category: "Zubehör · nachhaltig",
      price: 12.9,
      image: "assets/images/bio-pflanzenerde.jpg"
    },
    "pflege-starter-set": {
      name: "Pflege Starter Set",
      category: "Zubehör · für den Start",
      price: 19.9,
      image: "assets/images/pflege-starter-set.jpg"
    },
    "giesskanne-minimal": {
      name: "Giesskanne Minimal",
      category: "Zubehör · Pflege",
      price: 21.9,
      image: "assets/images/giesskanne-minimal.jpg"
    }
  };

  const readStorage = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  };

  const formatCHF = (value) => `CHF ${Number(value).toFixed(2)}`;

  const order = readStorage(ORDER_KEY, null);
  const emptyState = document.querySelector("[data-confirmation-empty]");
  const orderNumberElement = document.querySelector("[data-confirmation-number]");
  const dateElement = document.querySelector("[data-confirmation-date]");
  const addressElement = document.querySelector("[data-confirmation-address]");
  const deliveryElement = document.querySelector("[data-confirmation-delivery]");
  const paymentElement = document.querySelector("[data-confirmation-payment]");
  const subtotalElement = document.querySelector("[data-confirmation-subtotal]");
  const shippingElement = document.querySelector("[data-confirmation-shipping]");
  const totalElement = document.querySelector("[data-confirmation-total]");

  if (!order) {
    confirmationItems.innerHTML = "";

    if (emptyState) {
      emptyState.hidden = false;
    }

    return;
  }

  const validItems = order.items.filter((item) => products[item.id]);

  confirmationItems.innerHTML = "";

  if (validItems.length === 0) {
    if (emptyState) {
      emptyState.hidden = false;
    }
  } else {
    if (emptyState) {
      emptyState.hidden = true;
    }

    validItems.forEach((item) => {
      const product = products[item.id];
      const lineTotal = product.price * item.quantity;

      const confirmationItem = document.createElement("article");
      confirmationItem.className = "review-item";

      confirmationItem.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />

        <div>
          <p class="product-category">${product.category}</p>
          <h3>${product.name}</h3>
          <p>Menge: ${item.quantity} · Einzelpreis: ${formatCHF(product.price)}</p>
        </div>

        <strong class="review-item-price">${formatCHF(lineTotal)}</strong>
      `;

      confirmationItems.appendChild(confirmationItem);
    });
  }

  if (orderNumberElement) {
    orderNumberElement.textContent = order.orderNumber || "GN-000000";
  }

  if (dateElement && order.createdAt) {
    const date = new Date(order.createdAt);

    dateElement.textContent = date.toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  if (addressElement && order.address) {
    const address = order.address;

    const additionalAddress = address.additionalAddress
      ? `<br>${address.additionalAddress}`
      : "";

    const deliveryNote = address.deliveryNote
      ? `<br><br><strong>Lieferhinweis:</strong><br>${address.deliveryNote}`
      : "";

    addressElement.innerHTML = `
      ${address.firstName || ""} ${address.lastName || ""}<br>
      ${address.street || ""}
      ${additionalAddress}<br>
      ${address.zip || ""} ${address.city || ""}<br>
      ${address.country || "Schweiz"}
      ${deliveryNote}
    `;
  }

  if (deliveryElement && order.delivery) {
    deliveryElement.textContent = order.delivery.title || "Standardlieferung";
  }

  if (paymentElement && order.payment) {
    paymentElement.textContent = order.payment.title || "TWINT";
  }

  if (subtotalElement) {
    subtotalElement.textContent = formatCHF(order.subtotal || 0);
  }

  if (shippingElement) {
    shippingElement.textContent = formatCHF(order.shipping || 0);
  }

  if (totalElement) {
    totalElement.textContent = formatCHF(order.total || 0);
  }

  localStorage.setItem(CART_KEY, JSON.stringify([]));

  document.querySelectorAll(".cart-count").forEach((element) => {
    element.textContent = "0";
  });
});