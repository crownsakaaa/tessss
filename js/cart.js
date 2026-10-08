/**
 * Modul Keranjang Belanja & Wishlist YAZUAR APPAREL CO.
 * State tersimpan otomatis di localStorage browser
 */

const STORAGE_KEYS = {
  CART: "yazuar_cart_items",
  WISHLIST: "yazuar_wishlist_items",
  VOUCHER: "yazuar_active_voucher"
};

const VOUCHERS = {
  "DISKON10": {
    code: "DISKON10",
    label: "Diskon 10%",
    type: "percent",
    value: 0.10,
    minSpend: 0,
    desc: "Diskon 10% tanpa minimal belanja"
  },
  "POTONGAN25": {
    code: "POTONGAN25",
    label: "Potongan Rp 25.000",
    type: "fixed",
    value: 25000,
    minSpend: 100000,
    desc: "Potongan Rp 25.000 minimal belanja Rp 100.000"
  },
  "SEKOLAH10": {
    code: "SEKOLAH10",
    label: "Diskon 10%",
    type: "percent",
    value: 0.10,
    minSpend: 0,
    desc: "Diskon 10% pelajar"
  }
};

const FREE_SHIPPING_THRESHOLD = 150000;

class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.activeVoucher = this.loadVoucher();
  }

  loadCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("Gagal membaca cart dari localStorage", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.cart));
      this.updateBadges();
      window.dispatchEvent(new CustomEvent("nusa:cart-updated", { detail: this.cart }));
    } catch (e) {
      console.error("Gagal menyimpan cart", e);
    }
  }

  loadWishlist() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(this.wishlist));
      this.updateBadges();
      window.dispatchEvent(new CustomEvent("nusa:wishlist-updated", { detail: this.wishlist }));
    } catch (e) {
      console.error("Gagal menyimpan wishlist", e);
    }
  }

  loadVoucher() {
    try {
      const code = localStorage.getItem(STORAGE_KEYS.VOUCHER);
      return (code && VOUCHERS[code]) ? VOUCHERS[code] : null;
    } catch (e) {
      return null;
    }
  }

  saveVoucher(voucher) {
    if (voucher) {
      localStorage.setItem(STORAGE_KEYS.VOUCHER, voucher.code);
      this.activeVoucher = voucher;
    } else {
      localStorage.removeItem(STORAGE_KEYS.VOUCHER);
      this.activeVoucher = null;
    }
    window.dispatchEvent(new CustomEvent("nusa:cart-updated", { detail: this.cart }));
  }

  addItem(productId, variant = null, quantity = 1) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return false;

    const chosenVariant = variant || (product.variants && product.variants.length > 0 ? product.variants[0] : "Standar");
    const cartItemId = `${productId}__${chosenVariant}`;

    const existingIndex = this.cart.findIndex(item => item.cartItemId === cartItemId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        cartItemId,
        productId,
        name: product.name,
        category: product.categoryLabel,
        price: product.price,
        image: product.image,
        variant: chosenVariant,
        variantType: product.variantType || "Varian",
        quantity
      });
    }

    this.saveCart();
    showToast(`Ditambahkan ke keranjang: ${product.name}`, "success");
    return true;
  }

  updateQuantity(cartItemId, delta) {
    const itemIndex = this.cart.findIndex(i => i.cartItemId === cartItemId);
    if (itemIndex === -1) return;

    this.cart[itemIndex].quantity += delta;
    if (this.cart[itemIndex].quantity <= 0) {
      const removed = this.cart.splice(itemIndex, 1)[0];
      showToast(`Item dihapus: ${removed.name}`, "info");
    }
    this.saveCart();
  }

  removeItem(cartItemId) {
    const itemIndex = this.cart.findIndex(i => i.cartItemId === cartItemId);
    if (itemIndex > -1) {
      const removed = this.cart.splice(itemIndex, 1)[0];
      this.saveCart();
      showToast(`Dihapus dari keranjang: ${removed.name}`, "info");
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  getTotalItemsCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getDiscountAmount() {
    if (!this.activeVoucher) return 0;
    const subtotal = this.getSubtotal();
    if (subtotal < this.activeVoucher.minSpend) return 0;

    if (this.activeVoucher.type === "percent") {
      return Math.round(subtotal * this.activeVoucher.value);
    } else if (this.activeVoucher.type === "fixed") {
      return Math.min(this.activeVoucher.value, subtotal);
    }
    return 0;
  }

  applyVoucher(code) {
    const cleanCode = (code || "").trim().toUpperCase();
    const voucher = VOUCHERS[cleanCode];

    if (!voucher) {
      return { success: false, message: `Kode kupon "${code}" tidak valid. Coba: DISKON10` };
    }

    const subtotal = this.getSubtotal();
    if (subtotal < voucher.minSpend) {
      return { 
        success: false, 
        message: `Minimal belanja untuk kupon ${voucher.code} adalah ${formatRupiah(voucher.minSpend)}` 
      };
    }

    this.saveVoucher(voucher);
    return { success: true, message: `Kupon ${voucher.code} (${voucher.label}) berhasil dipakai.` };
  }

  removeVoucher() {
    this.saveVoucher(null);
    showToast("Kupon diskon dilepas.", "info");
  }

  // Wishlist Handling
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    const prodName = product ? product.name : "Produk";

    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.saveWishlist();
      showToast(`Dihapus dari wishlist: ${prodName}`, "info");
      return false;
    } else {
      this.wishlist.push(productId);
      this.saveWishlist();
      showToast(`Ditambahkan ke wishlist: ${prodName}`, "success");
      return true;
    }
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  updateBadges() {
    const cartCountEl = document.getElementById("cart-count-badge");
    const wishlistCountEl = document.getElementById("wishlist-count-badge");

    const totalCount = this.getTotalItemsCount();
    if (cartCountEl) {
      cartCountEl.textContent = totalCount;
      cartCountEl.classList.toggle("has-items", totalCount > 0);
    }

    if (wishlistCountEl) {
      const wCount = this.wishlist.length;
      wishlistCountEl.textContent = wCount;
      wishlistCountEl.classList.toggle("has-items", wCount > 0);
    }
  }
}

// Global Toast System (Bebas Emoji)
function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `<span class="toast-message">${message}</span>`;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("toast-show");
  });

  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Inisialisasi Cart Global
window.appCart = new CartManager();
