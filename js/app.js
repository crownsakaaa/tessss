/**
 * Main Application Logic - NUSA STUDIOS
 * Kontrol UI, Filter Katalog, Pencarian Cepat, Modal Detail, Cart Drawer, Wishlist, dan Info Kelompok
 */

document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi
  initApp();
});

let currentCategory = "all";
let currentSort = "popular";
let currentSearchQuery = "";
let selectedProductDetail = null;
let selectedDetailVariant = null;
let selectedDetailQty = 1;

function initApp() {
  // Render katalog produk awal
  renderProductGrid();

  // Update badge keranjang & favorit
  window.appCart.updateBadges();

  // Inisialisasi checkout
  window.appCheckout.init();

  // Bind Event Listeners
  setupNavigationEvents();
  setupFilterAndSortEvents();
  setupCartDrawerEvents();
  setupWishlistModalEvents();
  setupProductDetailModalEvents();
  setupSchoolProjectModalEvents();
  setupKeyboardEvents();

  // Dengarkan event update keranjang
  window.addEventListener("nusa:cart-updated", () => {
    renderCartDrawer();
    window.appCart.updateBadges();
  });

  window.addEventListener("nusa:wishlist-updated", () => {
    renderWishlistModal();
    window.appCart.updateBadges();
    // Re-render kartu untuk update icon heart
    renderProductGrid();
  });
}

/**
 * Filter & Sort Logic
 */
function getFilteredProducts() {
  let list = [...PRODUCTS_DATA];

  // 1. Filter Kategori
  if (currentCategory !== "all") {
    list = list.filter(p => p.category === currentCategory);
  }

  // 2. Filter Pencarian
  if (currentSearchQuery.trim() !== "") {
    const q = currentSearchQuery.toLowerCase().trim();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.shortDesc.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q)
    );
  }

  // 3. Sorting
  switch (currentSort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "popular":
    default:
      list.sort((a, b) => b.soldCount - a.soldCount);
      break;
  }

  return list;
}

/**
 * Render Grid Produk
 */
function renderProductGrid() {
  const container = document.getElementById("products-grid");
  const countLabel = document.getElementById("catalog-result-count");
  if (!container) return;

  const products = getFilteredProducts();

  if (countLabel) {
    countLabel.textContent = `Menampilkan ${products.length} produk`;
  }

  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-catalog-state">
        <div class="empty-icon"></div>
        <h3>Tidak ada produk yang cocok</h3>
        <p>Coba gunakan kata kunci lain atau ubah filter kategori yang dipilih.</p>
        <button class="btn btn-secondary" onclick="resetFilters()">Reset Filter</button>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => {
    const isFav = window.appCart.isInWishlist(product.id);
    const discountPercent = product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="product-card-media" onclick="openProductDetail('${product.id}')">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
          
          <div class="product-badges">
            ${product.badge ? `<span class="badge-pill badge-primary">${product.badge}</span>` : ""}
            ${discountPercent > 0 ? `<span class="badge-pill badge-discount">-${discountPercent}%</span>` : ""}
          </div>

          <button class="btn-wishlist-toggle ${isFav ? 'is-active' : ''}" 
                  title="${isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'}"
                  onclick="event.stopPropagation(); window.appCart.toggleWishlist('${product.id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? '#DC2626' : 'none'}" stroke="${isFav ? '#DC2626' : 'currentColor'}" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <div class="product-card-content">
          <div class="product-meta-row">
            <span class="product-category-tag">${product.categoryLabel}</span>
            <div class="product-rating">
              <span class="star-icon"></span>
              <span class="rating-val">${product.rating}</span>
              <span class="sold-val">(${product.soldCount} terjual)</span>
            </div>
          </div>

          <h3 class="product-title" onclick="openProductDetail('${product.id}')">${product.name}</h3>
          
          <p class="product-desc-preview">${product.shortDesc}</p>

          <div class="product-card-footer">
            <div class="product-pricing">
              <span class="product-price">${formatRupiah(product.price)}</span>
              ${product.originalPrice ? `<span class="product-original-price">${formatRupiah(product.originalPrice)}</span>` : ""}
            </div>

            <div class="card-action-btns">
              <button class="btn-quick-add" onclick="quickAddToCart('${product.id}')" title="Tambah ke keranjang" aria-label="Tambah ${product.name} ke keranjang">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-7z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span class="btn-add-label">+ Keranjang</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function quickAddToCart(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;
  const defaultVariant = product.variants ? product.variants[0] : "Standar";
  window.appCart.addItem(productId, defaultVariant, 1);
}

function resetFilters() {
  currentCategory = "all";
  currentSearchQuery = "";
  currentSort = "popular";

  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) sortSelect.value = "popular";

  document.querySelectorAll(".category-pill").forEach(pill => {
    pill.classList.toggle("active", pill.getAttribute("data-category") === "all");
  });

  renderProductGrid();
}

/**
 * Setup Navigation & Filter Events
 */
function setupNavigationEvents() {
  // Buka/Tutup Cart Drawer
  const cartBtn = document.getElementById("btn-open-cart");
  const closeCartBtn = document.getElementById("btn-close-cart");
  const cartOverlay = document.getElementById("cart-overlay");

  if (cartBtn) cartBtn.addEventListener("click", () => openCartDrawer());
  if (closeCartBtn) closeCartBtn.addEventListener("click", () => closeCartDrawer());
  if (cartOverlay) cartOverlay.addEventListener("click", () => closeCartDrawer());

  // Buka/Tutup Wishlist Modal
  const wishlistBtn = document.getElementById("btn-open-wishlist");
  const closeWishlistBtn = document.getElementById("btn-close-wishlist");
  if (wishlistBtn) wishlistBtn.addEventListener("click", () => openWishlistModal());
  if (closeWishlistBtn) closeWishlistBtn.addEventListener("click", () => closeWishlistModal());

  // Buka Info Tugas Sekolah
  const schoolProjectBtn = document.getElementById("btn-open-project-info");
  if (schoolProjectBtn) schoolProjectBtn.addEventListener("click", () => openSchoolProjectModal());

  // Tombol Checkout dari Cart Drawer
  const btnCheckout = document.getElementById("btn-proceed-checkout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      closeCartDrawer();
      window.appCheckout.openCheckoutModal();
    });
  }

  // Tombol Tutup Checkout Modal
  const btnCloseCheckout = document.getElementById("btn-close-checkout");
  if (btnCloseCheckout) {
    btnCloseCheckout.addEventListener("click", () => {
      window.appCheckout.closeCheckoutModal();
    });
  }

  // Tombol Tutup Invoice Modal
  const btnCloseInvoice = document.getElementById("btn-close-invoice");
  if (btnCloseInvoice) {
    btnCloseInvoice.addEventListener("click", () => {
      window.appCheckout.closeInvoiceModal();
    });
  }

  // Tombol Cetak Struk
  const btnPrintInvoice = document.getElementById("btn-print-invoice");
  if (btnPrintInvoice) {
    btnPrintInvoice.addEventListener("click", () => {
      window.print();
    });
  }

  // Smooth scroll ke katalog
  const heroCta = document.getElementById("hero-explore-btn");
  if (heroCta) {
    heroCta.addEventListener("click", () => {
      const target = document.getElementById("catalog-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
}

function setupFilterAndSortEvents() {
  // Category tabs
  const categoryPills = document.querySelectorAll(".category-pill");
  categoryPills.forEach(pill => {
    pill.addEventListener("click", () => {
      categoryPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.getAttribute("data-category");
      renderProductGrid();
    });
  });

  // Sorting
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderProductGrid();
    });
  }

  // Search input real-time
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("btn-clear-search");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = currentSearchQuery.length > 0 ? "block" : "none";
      }
      renderProductGrid();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
        currentSearchQuery = "";
        clearSearchBtn.style.display = "none";
        renderProductGrid();
        searchInput.focus();
      }
    });
  }
}

/**
 * Cart Drawer Logic
 */
function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (drawer && overlay) {
    drawer.classList.add("drawer-open");
    overlay.classList.add("overlay-active");
    document.body.style.overflow = "hidden";
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (drawer && overlay) {
    drawer.classList.remove("drawer-open");
    overlay.classList.remove("overlay-active");
    document.body.style.overflow = "";
  }
}

function renderCartDrawer() {
  const itemsContainer = document.getElementById("cart-items-container");
  const emptyState = document.getElementById("cart-empty-state");
  const footerEl = document.getElementById("cart-footer");
  const subtotalEl = document.getElementById("cart-subtotal");
  const discountEl = document.getElementById("cart-discount");
  const discountRow = document.getElementById("cart-discount-row");
  const grandTotalEl = document.getElementById("cart-grand-total");
  const freeShipBar = document.getElementById("free-shipping-progress");
  const freeShipText = document.getElementById("free-shipping-text");
  const appliedVoucherTag = document.getElementById("applied-voucher-tag");

  const cart = window.appCart.cart;
  const subtotal = window.appCart.getSubtotal();
  const discount = window.appCart.getDiscountAmount();
  const total = Math.max(0, subtotal - discount);

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = "";
    if (emptyState) emptyState.style.display = "flex";
    if (footerEl) footerEl.style.display = "none";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (footerEl) footerEl.style.display = "block";

  // Free shipping progress bar
  if (freeShipBar && freeShipText) {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      freeShipBar.style.width = "100%";
      freeShipBar.classList.add("bar-complete");
      freeShipText.innerHTML = ` Selamat! Kamu mendapatkan <strong>GRATIS ONGKIR</strong> untuk pesanan ini.`;
    } else {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      freeShipBar.style.width = `${percent}%`;
      freeShipBar.classList.remove("bar-complete");
      freeShipText.innerHTML = `Tambah <strong>${formatRupiah(remaining)}</strong> lagi untuk dapat <strong>GRATIS ONGKIR</strong>!`;
    }
  }

  // Items list
  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item-row" data-id="${item.cartItemId}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
      
      <div class="cart-item-details">
        <div class="cart-item-top">
          <h4 class="cart-item-name">${item.name}</h4>
          <button class="btn-remove-item" onclick="window.appCart.removeItem('${item.cartItemId}')" title="Hapus">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="cart-item-badge-variant">
          <span>${item.variantType}: <strong>${item.variant}</strong></span>
        </div>

        <div class="cart-item-bottom">
          <div class="quantity-stepper">
            <button class="step-btn" onclick="window.appCart.updateQuantity('${item.cartItemId}', -1)">-</button>
            <span class="step-val">${item.quantity}</span>
            <button class="step-btn" onclick="window.appCart.updateQuantity('${item.cartItemId}', 1)">+</button>
          </div>
          <div class="cart-item-line-price">
            ${formatRupiah(item.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  `).join("");

  // Subtotal & Discount
  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
  if (grandTotalEl) grandTotalEl.textContent = formatRupiah(total);

  if (discountRow) {
    discountRow.style.display = discount > 0 ? "flex" : "none";
    if (discountEl) discountEl.textContent = `- ${formatRupiah(discount)}`;
  }

  // Active Voucher badge in drawer
  if (appliedVoucherTag) {
    if (window.appCart.activeVoucher) {
      appliedVoucherTag.style.display = "flex";
      appliedVoucherTag.innerHTML = `
        <span class="voucher-info"> ${window.appCart.activeVoucher.code} (${window.appCart.activeVoucher.label})</span>
        <button class="btn-remove-voucher" onclick="window.appCart.removeVoucher()">×</button>
      `;
    } else {
      appliedVoucherTag.style.display = "none";
    }
  }
}

function setupCartDrawerEvents() {
  const applyVoucherBtn = document.getElementById("btn-apply-voucher");
  const voucherInput = document.getElementById("voucher-input");

  if (applyVoucherBtn && voucherInput) {
    applyVoucherBtn.addEventListener("click", () => {
      const code = voucherInput.value;
      const res = window.appCart.applyVoucher(code);
      if (res.success) {
        showToast(res.message, "success", "");
        voucherInput.value = "";
      } else {
        showToast(res.message, "warning", "");
      }
    });

    voucherInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyVoucherBtn.click();
      }
    });
  }
}

/**
 * Product Detail Modal Logic
 */
function openProductDetail(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  selectedProductDetail = product;
  selectedDetailVariant = product.variants ? product.variants[0] : "Standar";
  selectedDetailQty = 1;

  const modal = document.getElementById("product-detail-modal");
  if (!modal) return;

  // Isi data produk
  document.getElementById("modal-prod-img").src = product.image;
  document.getElementById("modal-prod-img").alt = product.name;
  document.getElementById("modal-prod-title").textContent = product.name;
  document.getElementById("modal-prod-category").textContent = product.categoryLabel;
  document.getElementById("modal-prod-rating").textContent = `${product.rating}  (${product.reviewCount} ulasan)`;
  document.getElementById("modal-prod-sold").textContent = `${product.soldCount} terjual`;
  document.getElementById("modal-prod-price").textContent = formatRupiah(product.price);
  
  const origPriceEl = document.getElementById("modal-prod-orig-price");
  if (product.originalPrice) {
    origPriceEl.textContent = formatRupiah(product.originalPrice);
    origPriceEl.style.display = "inline";
  } else {
    origPriceEl.style.display = "none";
  }

  document.getElementById("modal-prod-desc").textContent = product.description;
  document.getElementById("modal-prod-stock").textContent = `Sisa Stok: ${product.stock} unit`;

  // Render Varian Options
  const variantContainer = document.getElementById("modal-variant-options");
  const variantLabel = document.getElementById("modal-variant-label");
  if (variantLabel) variantLabel.textContent = `Pilih ${product.variantType || 'Varian'}:`;

  if (variantContainer && product.variants) {
    variantContainer.innerHTML = product.variants.map((v, i) => `
      <button class="variant-pill ${i === 0 ? 'selected' : ''}" onclick="selectDetailVariant('${v}', this)">
        ${v}
      </button>
    `).join("");
  }

  // Render Spesifikasi
  const specsContainer = document.getElementById("modal-prod-specs");
  if (specsContainer && product.specs) {
    specsContainer.innerHTML = product.specs.map(spec => `
      <div class="spec-row">
        <span class="spec-label">${spec.label}</span>
        <span class="spec-value">${spec.value}</span>
      </div>
    `).join("");
  }

  // Render Ulasan
  const reviewsContainer = document.getElementById("modal-prod-reviews");
  if (reviewsContainer && product.reviews) {
    reviewsContainer.innerHTML = product.reviews.map(rev => `
      <div class="review-item">
        <div class="review-header">
          <div class="review-user">
            <div class="user-avatar-initial">${rev.name.charAt(0)}</div>
            <div>
              <strong class="user-name">${rev.name}</strong>
              <div class="review-stars">    </div>
            </div>
          </div>
          <span class="review-date">${rev.date}</span>
        </div>
        <p class="review-comment">"${rev.comment}"</p>
      </div>
    `).join("");
  }

  // Reset Quantity
  updateDetailQtyDisplay();

  modal.classList.add("modal-active");
  document.body.style.overflow = "hidden";
}

function selectDetailVariant(variantValue, btnElement) {
  selectedDetailVariant = variantValue;
  document.querySelectorAll("#modal-variant-options .variant-pill").forEach(btn => {
    btn.classList.remove("selected");
  });
  if (btnElement) btnElement.classList.add("selected");
}

function updateDetailQtyDisplay() {
  const qtyEl = document.getElementById("modal-qty-val");
  if (qtyEl) qtyEl.textContent = selectedDetailQty;
}

function setupProductDetailModalEvents() {
  const closeBtn = document.getElementById("btn-close-detail-modal");
  const modal = document.getElementById("product-detail-modal");

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("modal-active");
      document.body.style.overflow = "";
    });
  }

  // Qty adjust
  const qtyMinus = document.getElementById("modal-qty-minus");
  const qtyPlus = document.getElementById("modal-qty-plus");

  if (qtyMinus) {
    qtyMinus.addEventListener("click", () => {
      if (selectedDetailQty > 1) {
        selectedDetailQty--;
        updateDetailQtyDisplay();
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener("click", () => {
      if (selectedProductDetail && selectedDetailQty < selectedProductDetail.stock) {
        selectedDetailQty++;
        updateDetailQtyDisplay();
      } else {
        showToast("Jumlah melebihi stok yang tersedia saat ini.", "warning", "");
      }
    });
  }

  // Tombol Tambah ke Keranjang dari Modal
  const btnAddFromModal = document.getElementById("btn-modal-add-cart");
  if (btnAddFromModal) {
    btnAddFromModal.addEventListener("click", () => {
      if (!selectedProductDetail) return;
      window.appCart.addItem(selectedProductDetail.id, selectedDetailVariant, selectedDetailQty);
      modal.classList.remove("modal-active");
      document.body.style.overflow = "";
      openCartDrawer();
    });
  }

  // Tombol Beli Langsung
  const btnBuyDirect = document.getElementById("btn-modal-buy-direct");
  if (btnBuyDirect) {
    btnBuyDirect.addEventListener("click", () => {
      if (!selectedProductDetail) return;
      window.appCart.addItem(selectedProductDetail.id, selectedDetailVariant, selectedDetailQty);
      modal.classList.remove("modal-active");
      document.body.style.overflow = "";
      window.appCheckout.openCheckoutModal();
    });
  }
}

/**
 * Wishlist Modal Logic
 */
function openWishlistModal() {
  renderWishlistModal();
  const modal = document.getElementById("wishlist-modal");
  if (modal) {
    modal.classList.add("modal-active");
    document.body.style.overflow = "hidden";
  }
}

function closeWishlistModal() {
  const modal = document.getElementById("wishlist-modal");
  if (modal) {
    modal.classList.remove("modal-active");
    document.body.style.overflow = "";
  }
}

function renderWishlistModal() {
  const container = document.getElementById("wishlist-items-container");
  const emptyState = document.getElementById("wishlist-empty-state");
  if (!container) return;

  const wishlistIds = window.appCart.wishlist;
  const items = PRODUCTS_DATA.filter(p => wishlistIds.includes(p.id));

  if (items.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.style.display = "flex";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  container.innerHTML = items.map(p => `
    <div class="wishlist-item-card">
      <img src="${p.image}" alt="${p.name}" class="wishlist-item-img">
      <div class="wishlist-item-info">
        <h4 class="wishlist-item-title">${p.name}</h4>
        <div class="wishlist-item-price">${formatRupiah(p.price)}</div>
        <div class="wishlist-item-stock">Stok tersedia: ${p.stock}</div>
      </div>
      <div class="wishlist-item-actions">
        <button class="btn btn-primary btn-sm" onclick="quickAddToCart('${p.id}'); window.appCart.toggleWishlist('${p.id}')">
          Pindahkan ke Keranjang
        </button>
        <button class="btn-remove-wishlist" onclick="window.appCart.toggleWishlist('${p.id}')" title="Hapus">
          Hapus
        </button>
      </div>
    </div>
  `).join("");
}

function setupWishlistModalEvents() {
  const closeBtn = document.getElementById("btn-close-wishlist-modal");
  if (closeBtn) closeBtn.addEventListener("click", () => closeWishlistModal());
}

/**
 * School Project Modal Logic (Sangat bermanfaat untuk penilaian guru)
 */
function openSchoolProjectModal() {
  loadSchoolProjectData();
  const modal = document.getElementById("project-info-modal");
  if (modal) {
    modal.classList.add("modal-active");
    document.body.style.overflow = "hidden";
  }
}

function closeSchoolProjectModal() {
  const modal = document.getElementById("project-info-modal");
  if (modal) {
    modal.classList.remove("modal-active");
    document.body.style.overflow = "";
  }
}

function loadSchoolProjectData() {
  const savedData = localStorage.getItem("nusa_school_info");
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      if (document.getElementById("project-school-name")) document.getElementById("project-school-name").value = data.school || "";
      if (document.getElementById("project-class-name")) document.getElementById("project-class-name").value = data.className || "";
      if (document.getElementById("project-subject-name")) document.getElementById("project-subject-name").value = data.subject || "";
      if (document.getElementById("project-teacher-name")) document.getElementById("project-teacher-name").value = data.teacher || "";
      if (document.getElementById("project-members-list")) document.getElementById("project-members-list").value = data.members || "";
    } catch (e) {}
  }
}

function saveSchoolProjectData() {
  const school = document.getElementById("project-school-name")?.value.trim();
  const className = document.getElementById("project-class-name")?.value.trim();
  const subject = document.getElementById("project-subject-name")?.value.trim();
  const teacher = document.getElementById("project-teacher-name")?.value.trim();
  const members = document.getElementById("project-members-list")?.value.trim();

  const data = { school, className, subject, teacher, members };
  localStorage.setItem("nusa_school_info", JSON.stringify(data));
  showToast("Data kelompok tugas sekolah berhasil disimpan!", "success", "");
  closeSchoolProjectModal();
}

function setupSchoolProjectModalEvents() {
  const closeBtn = document.getElementById("btn-close-project-modal");
  const saveBtn = document.getElementById("btn-save-project-info");

  if (closeBtn) closeBtn.addEventListener("click", () => closeSchoolProjectModal());
  if (saveBtn) saveBtn.addEventListener("click", () => saveSchoolProjectData());
}

/**
 * Keyboard Shortcuts
 */
function setupKeyboardEvents() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCartDrawer();
      closeWishlistModal();
      closeSchoolProjectModal();
      window.appCheckout.closeCheckoutModal();
      window.appCheckout.closeInvoiceModal();
      const prodModal = document.getElementById("product-detail-modal");
      if (prodModal) {
        prodModal.classList.remove("modal-active");
        document.body.style.overflow = "";
      }
    }
  });
}
