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
document.addEventListener("DOMContentLoaded", () => {
  const WISHLIST_KEY = "greennestWishlist";
  const CART_KEY = "greennestCart";

  const wishlistProducts = {
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

  const formatCHF = (value) => `CHF ${Number(value).toFixed(2)}`;

  const readStorage = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  };

  const writeStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const slugifyWishlist = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const getWishlist = () => readStorage(WISHLIST_KEY, []);

  const saveWishlist = (wishlist) => {
    writeStorage(WISHLIST_KEY, wishlist);
    updateWishlistCount();
    updateWishlistButtons();
  };

  const getCart = () => readStorage(CART_KEY, []);

  const saveCart = (cart) => {
    writeStorage(CART_KEY, cart);
    updateCartCounterFromWishlistBlock();
  };

  function ensureLiveRegion() {
    let region = document.querySelector("[data-live-region]");

    if (!region) {
      region = document.createElement("div");
      region.className = "sr-only";
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-atomic", "true");
      region.dataset.liveRegion = "";
      document.body.appendChild(region);
    }

    return region;
  }

  function announce(message) {
    const toast = document.querySelector("[data-toast]");
    const region = ensureLiveRegion();

    region.textContent = message;

    if (toast) {
      toast.textContent = message;
      toast.hidden = false;

      window.setTimeout(() => {
        toast.hidden = true;
      }, 2400);
    }
  }

  function ensureWishlistHeaderLink() {
    document.querySelectorAll(".header-actions").forEach((actions) => {
      if (actions.querySelector(".wishlist-pill")) {
        return;
      }

      const wishlistLink = document.createElement("a");
      wishlistLink.className = "wishlist-pill";
      wishlistLink.href = "wunschliste.html";
      wishlistLink.setAttribute("aria-label", "Wunschliste öffnen");
      wishlistLink.innerHTML = `
        Wunschliste
        <span class="wishlist-count">0</span>
      `;

      const cartLink = actions.querySelector(".cart-pill");

      if (cartLink) {
        actions.insertBefore(wishlistLink, cartLink);
      } else {
        actions.appendChild(wishlistLink);
      }
    });
  }

  function updateWishlistCount() {
    const wishlist = getWishlist();

    document.querySelectorAll(".wishlist-count").forEach((count) => {
      count.textContent = String(wishlist.length);
    });
  }

  function updateCartCounterFromWishlistBlock() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll(".cart-count").forEach((element) => {
      element.textContent = String(count);
    });
  }

  function getProductIdFromCard(card) {
    if (card.dataset.productId) {
      return card.dataset.productId;
    }

    if (card.dataset.name) {
      return slugifyWishlist(card.dataset.name);
    }

    return null;
  }

  function createWishlistButton(productId) {
    const button = document.createElement("button");
    button.className = "wishlist-toggle";
    button.type = "button";
    button.dataset.wishlistToggle = productId;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "Produkt zur Wunschliste hinzufügen");
    button.innerHTML = `
      <span aria-hidden="true">♡</span>
      <span class="sr-only">Zur Wunschliste hinzufügen</span>
    `;

    return button;
  }

  function injectWishlistButtons() {
    document.querySelectorAll(".product-card").forEach((card) => {
      const productId = getProductIdFromCard(card);

      if (!productId || !wishlistProducts[productId]) {
        return;
      }

      const imageArea = card.querySelector(".product-image-card") || card;

      if (imageArea.querySelector("[data-wishlist-toggle]")) {
        return;
      }

      imageArea.appendChild(createWishlistButton(productId));
    });

    const detailImage = document.querySelector(".product-main-image");

    if (detailImage && !detailImage.querySelector("[data-wishlist-toggle]")) {
      detailImage.appendChild(createWishlistButton("monstera-easy"));
    }
  }

  function updateWishlistButtons() {
    const wishlist = getWishlist();

    document.querySelectorAll("[data-wishlist-toggle]").forEach((button) => {
      const productId = button.dataset.wishlistToggle;
      const isActive = wishlist.includes(productId);

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      button.setAttribute(
        "aria-label",
        isActive
          ? "Produkt aus Wunschliste entfernen"
          : "Produkt zur Wunschliste hinzufügen"
      );

      button.innerHTML = `
        <span aria-hidden="true">${isActive ? "♥" : "♡"}</span>
        <span class="sr-only">
          ${isActive ? "Aus Wunschliste entfernen" : "Zur Wunschliste hinzufügen"}
        </span>
      `;
    });
  }

  function toggleWishlist(productId) {
    const product = wishlistProducts[productId];

    if (!product) {
      return;
    }

    const wishlist = getWishlist();
    const isActive = wishlist.includes(productId);

    const nextWishlist = isActive
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    saveWishlist(nextWishlist);

    announce(
      isActive
        ? `${product.name} wurde aus der Wunschliste entfernt.`
        : `${product.name} wurde zur Wunschliste hinzugefügt.`
    );

    renderWishlistPage();
  }

  function addWishlistProductToCart(productId) {
    const product = wishlistProducts[productId];

    if (!product) {
      return;
    }

    const cart = getCart();
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        quantity: 1
      });
    }

    saveCart(cart);
    announce(`${product.name} wurde dem Warenkorb hinzugefügt.`);
  }

  function renderWishlistPage() {
    const container = document.querySelector("[data-wishlist-items]");
    const emptyState = document.querySelector("[data-wishlist-empty]");

    if (!container) {
      return;
    }

    const wishlist = getWishlist().filter((id) => wishlistProducts[id]);

    container.innerHTML = "";

    if (wishlist.length === 0) {
      container.hidden = true;

      if (emptyState) {
        emptyState.hidden = false;
      }

      return;
    }

    container.hidden = false;

    if (emptyState) {
      emptyState.hidden = true;
    }

    wishlist.forEach((productId) => {
      const product = wishlistProducts[productId];

      const card = document.createElement("article");
      card.className = "wishlist-item-card";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />

        <div>
          <p class="product-category">${product.category}</p>
          <h2>${product.name}</h2>
          <p>${product.description}</p>

          <div class="wishlist-actions">
            <button class="btn btn-primary" type="button" data-wishlist-add-cart="${product.id}">
              In Warenkorb
            </button>

            <button class="btn btn-secondary" type="button" data-wishlist-remove="${product.id}">
              Entfernen
            </button>
          </div>
        </div>

        <strong class="wishlist-item-price">${formatCHF(product.price)}</strong>
      `;

      container.appendChild(card);
    });
  }

  document.addEventListener("click", (event) => {
    const wishlistButton = event.target.closest("[data-wishlist-toggle]");

    if (wishlistButton) {
      toggleWishlist(wishlistButton.dataset.wishlistToggle);
      return;
    }

    const removeButton = event.target.closest("[data-wishlist-remove]");

    if (removeButton) {
      toggleWishlist(removeButton.dataset.wishlistRemove);
      return;
    }

    const addCartButton = event.target.closest("[data-wishlist-add-cart]");

    if (addCartButton) {
      addWishlistProductToCart(addCartButton.dataset.wishlistAddCart);
    }
  });

  ensureWishlistHeaderLink();
  injectWishlistButtons();
  updateWishlistCount();
  updateWishlistButtons();
  updateCartCounterFromWishlistBlock();
  renderWishlistPage();
});
document.addEventListener("DOMContentLoaded", () => {
  const trackingDateElement = document.querySelector("[data-tracking-order-date]");

  if (!trackingDateElement) {
    return;
  }

  const ORDER_KEY = "greennestOrder";

  const readStorage = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  };

  const order = readStorage(ORDER_KEY, null);

  const formatDate = (date) => {
    return date.toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  if (order && order.createdAt) {
    const orderDate = new Date(order.createdAt);
    trackingDateElement.textContent = formatDate(orderDate);
  }

  const deliveryInfoElement = document.querySelector("[data-tracking-delivery-info]");
  const estimateElement = document.querySelector("[data-tracking-estimate]");

  if (order && order.delivery) {
    if (deliveryInfoElement) {
      deliveryInfoElement.textContent =
        order.delivery.option === "pickup"
          ? "Abholinformation folgt per E-Mail"
          : "Tracking-Link folgt per E-Mail";
    }

    if (estimateElement) {
      if (order.delivery.option === "express") {
        estimateElement.textContent = "voraussichtlich am nächsten Werktag";
      } else if (order.delivery.option === "pickup") {
        estimateElement.textContent = "voraussichtlich in 1–2 Werktagen abholbereit";
      } else {
        estimateElement.textContent = "voraussichtlich in 2–3 Werktagen";
      }
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  function injectReturnLinks() {
    document.querySelectorAll(".main-nav").forEach((nav) => {
      if (nav.querySelector('a[href="retouren.html"]')) {
        return;
      }

      const link = document.createElement("a");
      link.href = "retouren.html";
      link.textContent = "Retouren";

      nav.appendChild(link);
    });

    document.querySelectorAll(".site-footer").forEach((footer) => {
      if (footer.querySelector('a[href="retouren.html"]')) {
        return;
      }

      const footerColumns = footer.querySelectorAll(".footer-grid > div");
      const secondColumn = footerColumns[1];

      if (secondColumn) {
        const link = document.createElement("a");
        link.href = "retouren.html";
        link.textContent = "Retouren";
        secondColumn.appendChild(link);
      }
    });
  }

  function enhanceLiveRegions() {
    document.querySelectorAll(".cart-count").forEach((count) => {
      count.setAttribute("aria-live", "polite");
      count.setAttribute("aria-atomic", "true");
    });

    document.querySelectorAll(".wishlist-count").forEach((count) => {
      count.setAttribute("aria-live", "polite");
      count.setAttribute("aria-atomic", "true");
    });

    document.querySelectorAll("[data-toast]").forEach((toast) => {
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.setAttribute("aria-atomic", "true");
    });
  }

  function enhanceFormAccessibility() {
    const fields = document.querySelectorAll("input, select, textarea");

    fields.forEach((field) => {
      if (field.hasAttribute("data-required")) {
        field.setAttribute("aria-required", "true");
      }

      if (!field.id) {
        return;
      }

      const error = document.querySelector(`[data-error-for="${field.id}"]`);

      if (error) {
        const errorId = `${field.id}-error`;
        error.id = errorId;

        const existingDescription = field.getAttribute("aria-describedby");

        if (existingDescription) {
          if (!existingDescription.includes(errorId)) {
            field.setAttribute("aria-describedby", `${existingDescription} ${errorId}`);
          }
        } else {
          field.setAttribute("aria-describedby", errorId);
        }
      }
    });

    const forms = document.querySelectorAll("form");

    forms.forEach((form) => {
      const updateInvalidStates = () => {
        window.setTimeout(() => {
          form.querySelectorAll("input, select, textarea").forEach((field) => {
            const wrapper = field.closest(".form-field");
            const hasError = wrapper && wrapper.classList.contains("has-error");

            field.setAttribute("aria-invalid", hasError ? "true" : "false");
          });
        }, 0);
      };

      form.addEventListener("submit", updateInvalidStates);
      form.addEventListener("input", updateInvalidStates);
      form.addEventListener("blur", updateInvalidStates, true);
    });
  }

  function allowToastDismissWithEscape() {
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }

      document.querySelectorAll("[data-toast]").forEach((toast) => {
        toast.hidden = true;
      });
    });
  }

  injectReturnLinks();
  enhanceLiveRegions();
  enhanceFormAccessibility();
  allowToastDismissWithEscape();
});
document.addEventListener("DOMContentLoaded", () => {
  const finderForm = document.querySelector("[data-plant-finder-form]");

  if (!finderForm) {
    return;
  }

  const CART_KEY = "greennestCart";
  const WISHLIST_KEY = "greennestWishlist";

  const finderProducts = {
    "monstera-easy": {
      id: "monstera-easy",
      name: "Monstera Easy",
      category: "Pflegeleicht · hell bis halbschattig",
      price: 34.9,
      image: "assets/images/monstera-easy.jpg",
      traits: {
        light: ["bright", "medium"],
        care: ["normal"],
        room: ["living", "office"],
        priority: ["decorative", "robust"]
      }
    },
    "sansevieria-calm": {
      id: "sansevieria-calm",
      name: "Sansevieria Calm",
      category: "Sehr pflegeleicht · wenig Wasser",
      price: 29.9,
      image: "assets/images/sansevieria-calm.jpg",
      traits: {
        light: ["medium", "low"],
        care: ["very-low"],
        room: ["bedroom", "office"],
        priority: ["robust", "small"]
      }
    },
    "pothos-starter": {
      id: "pothos-starter",
      name: "Pothos Starter",
      category: "Pflegeleicht · wächst schnell",
      price: 24.9,
      image: "assets/images/pothos-starter.jpg",
      traits: {
        light: ["medium", "low"],
        care: ["very-low", "normal"],
        room: ["living", "office"],
        priority: ["small", "robust"]
      }
    },
    "calathea-soft": {
      id: "calathea-soft",
      name: "Calathea Soft",
      category: "Mittel · liebt Luftfeuchtigkeit",
      price: 39.9,
      image: "assets/images/calathea-soft.jpg",
      traits: {
        light: ["medium"],
        care: ["more"],
        room: ["bathroom", "living"],
        priority: ["decorative"]
      }
    },
    "zz-plant-robust": {
      id: "zz-plant-robust",
      name: "ZZ Plant Robust",
      category: "Einfach · wenig Licht",
      price: 36.9,
      image: "assets/images/zz-plant-robust.jpg",
      traits: {
        light: ["low", "medium"],
        care: ["very-low"],
        room: ["office", "bedroom"],
        priority: ["robust"]
      }
    },
    "aloe-vera-pure": {
      id: "aloe-vera-pure",
      name: "Aloe Vera Pure",
      category: "Einfach · sonniger Standort",
      price: 22.9,
      image: "assets/images/aloe-vera-pure.jpg",
      traits: {
        light: ["bright"],
        care: ["very-low"],
        room: ["living", "office"],
        priority: ["small", "robust"]
      }
    }
  };

  const formatCHF = (value) => `CHF ${Number(value).toFixed(2)}`;

  const readStorage = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  };

  const writeStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const announce = (message) => {
    const toast = document.querySelector("[data-toast]");

    if (toast) {
      toast.textContent = message;
      toast.hidden = false;

      window.setTimeout(() => {
        toast.hidden = true;
      }, 2400);
    }
  };

  const getSelectedValues = () => {
    const formData = new FormData(finderForm);

    return {
      light: formData.get("light"),
      care: formData.get("care"),
      room: formData.get("room"),
      priority: formData.get("priority")
    };
  };

  const scoreProduct = (product, answers) => {
    let score = 0;

    if (product.traits.light.includes(answers.light)) score += 30;
    if (product.traits.care.includes(answers.care)) score += 30;
    if (product.traits.room.includes(answers.room)) score += 20;
    if (product.traits.priority.includes(answers.priority)) score += 20;

    return score;
  };

  const buildReason = (product, answers) => {
    const reasons = [];

    if (product.traits.light.includes(answers.light)) {
      reasons.push("der Standort gut zu den Lichtbedürfnissen passt");
    }

    if (product.traits.care.includes(answers.care)) {
      reasons.push("der Pflegeaufwand zu deinem Alltag passt");
    }

    if (product.traits.room.includes(answers.room)) {
      reasons.push("die Pflanze für den gewählten Raum geeignet ist");
    }

    if (product.traits.priority.includes(answers.priority)) {
      reasons.push("sie deine wichtigste Priorität unterstützt");
    }

    return `Diese Empfehlung passt, weil ${reasons.join(", ")}.`;
  };

  const updateHeaderCounts = () => {
    const cart = readStorage(CART_KEY, []);
    const wishlist = readStorage(WISHLIST_KEY, []);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll(".cart-count").forEach((element) => {
      element.textContent = String(cartCount);
    });

    document.querySelectorAll(".wishlist-count").forEach((element) => {
      element.textContent = String(wishlist.length);
    });
  };

  const addToCart = (productId) => {
    const product = finderProducts[productId];
    const cart = readStorage(CART_KEY, []);
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        quantity: 1
      });
    }

    writeStorage(CART_KEY, cart);
    updateHeaderCounts();
    announce(`${product.name} wurde dem Warenkorb hinzugefügt.`);
  };

  const addToWishlist = (productId) => {
    const product = finderProducts[productId];
    const wishlist = readStorage(WISHLIST_KEY, []);

    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      writeStorage(WISHLIST_KEY, wishlist);
      updateHeaderCounts();
      announce(`${product.name} wurde zur Wunschliste hinzugefügt.`);
    } else {
      announce(`${product.name} ist bereits auf deiner Wunschliste.`);
    }
  };

  const placeholder = document.querySelector("[data-finder-placeholder]");
  const resultBox = document.querySelector("[data-finder-result]");
  const titleElement = document.querySelector("[data-finder-title]");
  const reasonElement = document.querySelector("[data-finder-reason]");
  const imageElement = document.querySelector("[data-finder-image]");
  const categoryElement = document.querySelector("[data-finder-category]");
  const nameElement = document.querySelector("[data-finder-name]");
  const scoreElement = document.querySelector("[data-finder-score]");
  const priceElement = document.querySelector("[data-finder-price]");
  const alternativesElement = document.querySelector("[data-finder-alternatives]");
  const addCartButton = document.querySelector("[data-finder-add-cart]");
  const addWishlistButton = document.querySelector("[data-finder-add-wishlist]");

  let currentRecommendationId = null;

  function renderRecommendation() {
    const answers = getSelectedValues();

    const scoredProducts = Object.values(finderProducts)
      .map((product) => ({
        ...product,
        score: scoreProduct(product, answers)
      }))
      .sort((a, b) => b.score - a.score);

    const bestProduct = scoredProducts[0];
    const alternatives = scoredProducts.slice(1, 3);

    currentRecommendationId = bestProduct.id;

    if (placeholder) {
      placeholder.hidden = true;
    }

    if (resultBox) {
      resultBox.hidden = false;
    }

    if (titleElement) {
      titleElement.textContent = "Unsere beste Empfehlung";
    }

    if (reasonElement) {
      reasonElement.textContent = buildReason(bestProduct, answers);
    }

    if (imageElement) {
      imageElement.src = bestProduct.image;
      imageElement.alt = bestProduct.name;
    }

    if (categoryElement) {
      categoryElement.textContent = bestProduct.category;
    }

    if (nameElement) {
      nameElement.textContent = bestProduct.name;
    }

    if (scoreElement) {
      scoreElement.textContent = `${bestProduct.score}% Übereinstimmung mit deinen Antworten`;
    }

    if (priceElement) {
      priceElement.textContent = formatCHF(bestProduct.price);
    }

    if (alternativesElement) {
      alternativesElement.innerHTML = `
        <div class="finder-alt-list">
          ${alternatives.map((product) => `
            <article class="finder-alt-item">
              <strong>${product.name}</strong>
              <span>${product.score}% passend</span>
            </article>
          `).join("")}
        </div>
      `;
    }
  }

  finderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderRecommendation();
  });

  finderForm.addEventListener("reset", () => {
    window.setTimeout(() => {
      if (placeholder) placeholder.hidden = false;
      if (resultBox) resultBox.hidden = true;
      currentRecommendationId = null;
    }, 0);
  });

  if (addCartButton) {
    addCartButton.addEventListener("click", () => {
      if (currentRecommendationId) {
        addToCart(currentRecommendationId);
      }
    });
  }

  if (addWishlistButton) {
    addWishlistButton.addEventListener("click", () => {
      if (currentRecommendationId) {
        addToWishlist(currentRecommendationId);
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const careContainer = document.querySelector("[data-care-products]");

  if (!careContainer) {
    return;
  }

  const ORDER_KEY = "greennestOrder";

  const careProducts = {
    "monstera-easy": {
      name: "Monstera Easy",
      image: "assets/images/monstera-easy.jpg",
      tips: [
        "Hell bis halbschattig platzieren.",
        "Erst giessen, wenn die oberste Erdschicht trocken ist.",
        "Blätter gelegentlich mit einem feuchten Tuch abwischen."
      ]
    },
    "sansevieria-calm": {
      name: "Sansevieria Calm",
      image: "assets/images/sansevieria-calm.jpg",
      tips: [
        "Kommt auch mit wenig Licht zurecht.",
        "Sehr sparsam giessen.",
        "Staunässe unbedingt vermeiden."
      ]
    },
    "pothos-starter": {
      name: "Pothos Starter",
      image: "assets/images/pothos-starter.jpg",
      tips: [
        "Hell bis halbschattig platzieren.",
        "Triebe gelegentlich zurückschneiden.",
        "Erde leicht antrocknen lassen."
      ]
    },
    "calathea-soft": {
      name: "Calathea Soft",
      image: "assets/images/calathea-soft.jpg",
      tips: [
        "Indirektes Licht wählen.",
        "Luftfeuchtigkeit beachten.",
        "Erde leicht feucht halten, aber nicht nass."
      ]
    },
    "zz-plant-robust": {
      name: "ZZ Plant Robust",
      image: "assets/images/zz-plant-robust.jpg",
      tips: [
        "Sehr robust bei wenig Licht.",
        "Nur selten giessen.",
        "Ideal für Büro oder Schlafzimmer."
      ]
    },
    "aloe-vera-pure": {
      name: "Aloe Vera Pure",
      image: "assets/images/aloe-vera-pure.jpg",
      tips: [
        "Sehr heller Standort ideal.",
        "Wenig Wasser benötigt.",
        "Topf mit guter Drainage verwenden."
      ]
    }
  };

  const readStorage = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  };

  const emptyState = document.querySelector("[data-care-empty]");
  const order = readStorage(ORDER_KEY, null);

  careContainer.innerHTML = "";

  const orderedItems = order && Array.isArray(order.items)
    ? order.items.filter((item) => careProducts[item.id])
    : [];

  if (orderedItems.length === 0) {
    if (emptyState) {
      emptyState.hidden = false;
    }

    Object.values(careProducts).slice(0, 2).forEach((product) => {
      const card = document.createElement("article");
      card.className = "care-product-card";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />

        <div>
          <h3>${product.name}</h3>
          <p class="muted-text">Allgemeine Beispielhinweise</p>
          <ul>
            ${product.tips.map((tip) => `<li>${tip}</li>`).join("")}
          </ul>
        </div>
      `;

      careContainer.appendChild(card);
    });

    return;
  }

  if (emptyState) {
    emptyState.hidden = true;
  }

  orderedItems.forEach((item) => {
    const product = careProducts[item.id];

    const card = document.createElement("article");
    card.className = "care-product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />

      <div>
        <h3>${product.name}</h3>
        <p class="muted-text">Hinweise passend zu deiner Bestellung</p>
        <ul>
          ${product.tips.map((tip) => `<li>${tip}</li>`).join("")}
        </ul>
      </div>
    `;

    careContainer.appendChild(card);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  function injectAdvisoryLinks() {
    document.querySelectorAll(".main-nav").forEach((nav) => {
      if (!nav.querySelector('a[href="pflanzenfinder.html"]')) {
        const finderLink = document.createElement("a");
        finderLink.href = "pflanzenfinder.html";
        finderLink.textContent = "Pflanzenfinder";
        nav.appendChild(finderLink);
      }

      if (!nav.querySelector('a[href="pflegehinweise.html"]')) {
        const careLink = document.createElement("a");
        careLink.href = "pflegehinweise.html";
        careLink.textContent = "Pflegehinweise";
        nav.appendChild(careLink);
      }
    });
  }

  injectAdvisoryLinks();
});
document.addEventListener("DOMContentLoaded", () => {
  const cleanNavigationItems = [
    {
      label: "Pflanzen",
      href: "produkte.html"
    },
    {
      label: "Pflanzenfinder",
      href: "pflanzenfinder.html"
    },
    {
      label: "Pflegehinweise",
      href: "pflegehinweise.html"
    },
    {
      label: "Retouren",
      href: "retouren.html"
    }
  ];

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".main-nav").forEach((nav) => {
    nav.innerHTML = "";

    cleanNavigationItems.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.label;

      if (currentPage === item.href) {
        link.setAttribute("aria-current", "page");
      }

      nav.appendChild(link);
    });
  });

  document.querySelectorAll(".header-actions .icon-link").forEach((link) => {
    link.remove();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.querySelector("[data-product-grid]");
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const searchInput = document.querySelector("[data-product-search]");
  const sortSelect = document.querySelector("[data-sort-products]");
  const resultCount = document.querySelector("[data-result-count]");
  const emptyState = document.querySelector("[data-empty-state]");
  const filterInputs = Array.from(document.querySelectorAll("[data-filter]"));

  if (!productGrid || !searchInput || productCards.length === 0) {
    return;
  }

  const normalize = (text) => {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const searchSynonyms = {
    "pflegeleicht": ["pflegeleicht", "einfach", "robust", "anfanger", "starter", "easy", "very-low"],
    "wenig": ["wenig", "low", "schatten", "halbschatten", "halbschattig"],
    "licht": ["licht", "hell", "low", "medium", "bright", "halbschattig"],
    "wenig licht": ["wenig licht", "low", "schatten", "halbschatten", "zz plant", "sansevieria"],
    "buro": ["buro", "office", "arbeitsplatz"],
    "schlafzimmer": ["schlafzimmer", "bedroom"],
    "wohnzimmer": ["wohnzimmer", "living"],
    "bad": ["bad", "bathroom", "luftfeuchtigkeit"],
    "zubehor": ["zubehor", "topf", "erde", "giesskanne", "starter set"],
    "topf": ["topf", "keramik", "sand", "ubertopf"],
    "erde": ["erde", "pflanzenerde", "bio"],
    "giessen": ["giessen", "wasser", "giesskanne"]
  };

  function getSearchTerms(query) {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      return [];
    }

    const words = normalizedQuery.split(/\s+/);
    const terms = new Set([normalizedQuery, ...words]);

    Object.entries(searchSynonyms).forEach(([key, values]) => {
      if (normalizedQuery.includes(key) || words.includes(key)) {
        values.forEach((value) => terms.add(normalize(value)));
      }
    });

    return Array.from(terms).filter(Boolean);
  }

  function getCardSearchText(card) {
    const datasetText = Object.values(card.dataset).join(" ");

    return normalize(`
      ${datasetText}
      ${card.textContent}
    `);
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

    return selectedValues.some((value) => String(cardValue || "").includes(value));
  }

  function applyEnhancedProductSearch() {
    const searchTerms = getSearchTerms(searchInput.value);
    const selectedLevels = getCheckedValues("level");
    const selectedLights = getCheckedValues("light");
    const selectedRooms = getCheckedValues("room");

    let visibleCards = productCards.filter((card) => {
      const cardText = getCardSearchText(card);

      const matchesSearch =
        searchTerms.length === 0 ||
        searchTerms.some((term) => cardText.includes(term));

      const matchesLevel = matchesAnyFilter(card.dataset.level, selectedLevels);
      const matchesLight = matchesAnyFilter(card.dataset.light, selectedLights);
      const matchesRoom = matchesAnyFilter(card.dataset.room, selectedRooms);

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

  searchInput.addEventListener("input", applyEnhancedProductSearch);

  if (sortSelect) {
    sortSelect.addEventListener("change", applyEnhancedProductSearch);
  }

  filterInputs.forEach((input) => {
    input.addEventListener("change", applyEnhancedProductSearch);
  });

  window.setTimeout(applyEnhancedProductSearch, 0);
});
document.addEventListener("DOMContentLoaded", () => {
  const DEMO_KEYS = [
    "greennestCart",
    "greennestWishlist",
    "greennestAddress",
    "greennestDelivery",
    "greennestPayment",
    "greennestOrder"
  ];

  const demoProducts = {
    "monstera-easy": {
      name: "Monstera Easy",
      price: 34.9
    },
    "keramiktopf-sand": {
      name: "Keramiktopf Sand",
      price: 16.9
    },
    "sansevieria-calm": {
      name: "Sansevieria Calm",
      price: 29.9
    }
  };

  const formatCHF = (value) => `CHF ${Number(value).toFixed(2)}`;

  function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function readStorage(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  }

  function calculateDemoTotals(cart, deliveryPrice) {
    const subtotal = cart.reduce((sum, item) => {
      const product = demoProducts[item.id];

      if (!product) {
        return sum;
      }

      return sum + product.price * item.quantity;
    }, 0);

    const shipping = cart.length > 0 ? deliveryPrice : 0;
    const total = subtotal + shipping;

    return {
      subtotal,
      shipping,
      total
    };
  }

  function updateHeaderCounts() {
    const cart = readStorage("greennestCart", []);
    const wishlist = readStorage("greennestWishlist", []);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll(".cart-count").forEach((count) => {
      count.textContent = String(cartCount);
    });

    document.querySelectorAll(".wishlist-count").forEach((count) => {
      count.textContent = String(wishlist.length);
    });
  }

  function showDemoStatus(message) {
    const status = document.querySelector("[data-demo-status]");

    if (status) {
      status.hidden = false;
      status.textContent = message;
    }

    const toast = document.querySelector("[data-toast]");

    if (toast) {
      toast.textContent = message;
      toast.hidden = false;

      window.setTimeout(() => {
        toast.hidden = true;
      }, 2400);
    }
  }

  function loadDemoData() {
    const demoCart = [
      {
        id: "monstera-easy",
        quantity: 1
      },
      {
        id: "keramiktopf-sand",
        quantity: 1
      }
    ];

    const demoWishlist = [
      "sansevieria-calm",
      "calathea-soft",
      "zz-plant-robust"
    ];

    const demoAddress = {
      firstName: "Lea",
      lastName: "Muster",
      email: "lea.muster@example.ch",
      street: "Musterstrasse 12",
      additionalAddress: "2. Stock links",
      zip: "3000",
      city: "Bern",
      country: "Schweiz",
      deliveryNote: "Bitte vor der Wohnungstür abstellen.",
      billingSame: true
    };

    const demoDelivery = {
      option: "standard",
      title: "Standardlieferung",
      price: 6.9
    };

    const demoPayment = {
      option: "twint",
      title: "TWINT"
    };

    const totals = calculateDemoTotals(demoCart, demoDelivery.price);

    const demoOrder = {
      orderNumber: `GN-DEMO-${new Date().getFullYear()}`,
      items: demoCart,
      address: demoAddress,
      delivery: demoDelivery,
      payment: demoPayment,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      createdAt: new Date().toISOString()
    };

    writeStorage("greennestCart", demoCart);
    writeStorage("greennestWishlist", demoWishlist);
    writeStorage("greennestAddress", demoAddress);
    writeStorage("greennestDelivery", demoDelivery);
    writeStorage("greennestPayment", demoPayment);
    writeStorage("greennestOrder", demoOrder);

    updateHeaderCounts();

    showDemoStatus(
      `Demo-Daten geladen: Warenkorb ${formatCHF(totals.total)}, Wunschliste und Checkout-Daten sind vorbereitet.`
    );
  }

  function resetDemoData() {
    DEMO_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });

    updateHeaderCounts();

    showDemoStatus("Demo-Daten wurden zurückgesetzt.");

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    if (
      currentPage === "warenkorb.html" ||
      currentPage === "wunschliste.html" ||
      currentPage === "checkout-review.html" ||
      currentPage === "bestaetigung.html" ||
      currentPage === "pflegehinweise.html"
    ) {
      window.setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }

  function injectDemoPanel() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    if (currentPage !== "index.html" && currentPage !== "") {
      return;
    }

    const main = document.querySelector("#main-content");

    if (!main || document.querySelector("[data-demo-panel]")) {
      return;
    }

    const panel = document.createElement("section");
    panel.className = "container demo-panel";
    panel.dataset.demoPanel = "";

    panel.innerHTML = `
      <div class="demo-panel-inner">
        <div>
          <h2>Demo-Modus</h2>
          <p>
            Lädt Beispiel-Warenkorb, Wunschliste, Adresse, Lieferung, Zahlung und Bestellbestätigung.
          </p>
        </div>

        <div class="demo-panel-actions">
          <button class="btn btn-primary" type="button" data-load-demo>
            Demo-Daten laden
          </button>

          <button class="btn btn-secondary" type="button" data-reset-demo>
            Demo zurücksetzen
          </button>

          <a class="btn btn-secondary" href="warenkorb.html">
            Demo testen
          </a>
        </div>
      </div>

      <p class="demo-status" data-demo-status hidden></p>
    `;

    main.prepend(panel);
  }

  document.addEventListener("click", (event) => {
    const loadButton = event.target.closest("[data-load-demo]");
    const resetButton = event.target.closest("[data-reset-demo]");

    if (loadButton) {
      loadDemoData();
      return;
    }

    if (resetButton) {
      resetDemoData();
    }
  });

  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("demo") === "1") {
    loadDemoData();
  }

  if (urlParams.get("resetDemo") === "1") {
    resetDemoData();
  }

  injectDemoPanel();
  updateHeaderCounts();
});