/**
 * Modul Checkout, Metode Pembayaran (QRIS, VA, COD), & Struk Faktur Digital
 * NUSA STUDIOS - E-Commerce Tugas Sekolah
 */

const SHIPPING_COURIERS = [
  { id: "jne", name: "JNE Reguler", est: "2 - 3 Hari Kerja", cost: 12000 },
  { id: "sicepat", name: "SiCepat BEST", est: "1 - 2 Hari Kerja", cost: 16000 },
  { id: "gosend", name: "GoSend / Grab Instant", est: "3 - 5 Jam Sampai", cost: 25000 }
];

class CheckoutController {
  constructor() {
    this.selectedCourier = SHIPPING_COURIERS[0];
    this.selectedPayment = "qris";
    this.lastOrderData = null;
    this.qrisTimerInterval = null;
    this.qrisSecondsLeft = 900; // 15 menit
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Listener perubahan kurir
    document.addEventListener("change", (e) => {
      if (e.target.name === "shipping_courier") {
        const courier = SHIPPING_COURIERS.find(c => c.id === e.target.value);
        if (courier) {
          this.selectedCourier = courier;
          this.renderOrderSummary();
        }
      }
      if (e.target.name === "payment_method") {
        this.selectedPayment = e.target.value;
        this.updatePaymentDetailsView();
      }
    });

    // Form submission
    const form = document.getElementById("checkout-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.processCheckout();
      });
    }

    // Tombol simulasi bayar QRIS
    const simQrisBtn = document.getElementById("btn-simulate-qris");
    if (simQrisBtn) {
      simQrisBtn.addEventListener("click", () => {
        this.processCheckout(true);
      });
    }
  }

  openCheckoutModal() {
    const cart = window.appCart.cart;
    if (!cart || cart.length === 0) {
      showToast("Keranjang Anda masih kosong. Silakan pilih produk terlebih dahulu.", "warning", "");
      return;
    }

    const modal = document.getElementById("checkout-modal");
    if (modal) {
      this.populateCheckoutForm();
      this.renderOrderSummary();
      this.updatePaymentDetailsView();
      modal.classList.add("modal-active");
      document.body.style.overflow = "hidden";
      this.startQrisTimer();
    }
  }

  closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) {
      modal.classList.remove("modal-active");
      document.body.style.overflow = "";
      this.stopQrisTimer();
    }
  }

  populateCheckoutForm() {
    // Muat data default jika ada di session
    const savedCustomer = localStorage.getItem("nusa_saved_customer");
    if (savedCustomer) {
      try {
        const cust = JSON.parse(savedCustomer);
        if (document.getElementById("cust-name")) document.getElementById("cust-name").value = cust.name || "";
        if (document.getElementById("cust-phone")) document.getElementById("cust-phone").value = cust.phone || "";
        if (document.getElementById("cust-address")) document.getElementById("cust-address").value = cust.address || "";
        if (document.getElementById("cust-city")) document.getElementById("cust-city").value = cust.city || "";
      } catch (e) {}
    }
  }

  renderOrderSummary() {
    const subtotal = window.appCart.getSubtotal();
    const discount = window.appCart.getDiscountAmount();
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shippingFee = isFreeShipping ? 0 : this.selectedCourier.cost;
    const serviceFee = 1000;
    const grandTotal = Math.max(0, subtotal - discount + shippingFee + serviceFee);

    // Update labels di checkout modal
    const subtotalEl = document.getElementById("co-subtotal");
    const discountEl = document.getElementById("co-discount");
    const shippingEl = document.getElementById("co-shipping");
    const totalEl = document.getElementById("co-grand-total");
    const discountRow = document.getElementById("co-discount-row");
    const itemsListEl = document.getElementById("co-items-list");

    if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
    if (shippingEl) {
      shippingEl.innerHTML = isFreeShipping 
        ? `<span class="badge-free-ship">Gratis Ongkir (Rp 0)</span>` 
        : formatRupiah(shippingFee);
    }
    if (discountRow) {
      discountRow.style.display = discount > 0 ? "flex" : "none";
      if (discountEl) discountEl.textContent = `- ${formatRupiah(discount)}`;
    }
    if (totalEl) totalEl.textContent = formatRupiah(grandTotal);

    // List barang ringkas
    if (itemsListEl) {
      itemsListEl.innerHTML = window.appCart.cart.map(item => `
        <div class="checkout-item-preview">
          <img src="${item.image}" alt="${item.name}" class="co-item-img">
          <div class="co-item-info">
            <h4 class="co-item-title">${item.name}</h4>
            <p class="co-item-variant">${item.variant} × ${item.quantity}</p>
          </div>
          <div class="co-item-price">${formatRupiah(item.price * item.quantity)}</div>
        </div>
      `).join("");
    }
  }

  updatePaymentDetailsView() {
    const qrisBox = document.getElementById("pay-box-qris");
    const vaBox = document.getElementById("pay-box-va");
    const codBox = document.getElementById("pay-box-cod");

    if (qrisBox) qrisBox.style.display = this.selectedPayment === "qris" ? "block" : "none";
    if (vaBox) vaBox.style.display = this.selectedPayment === "va" ? "block" : "none";
    if (codBox) codBox.style.display = this.selectedPayment === "cod" ? "block" : "none";
  }

  startQrisTimer() {
    this.stopQrisTimer();
    this.qrisSecondsLeft = 900;
    const timerEl = document.getElementById("qris-timer-text");
    if (!timerEl) return;

    this.qrisTimerInterval = setInterval(() => {
      this.qrisSecondsLeft--;
      if (this.qrisSecondsLeft <= 0) {
        this.stopQrisTimer();
        timerEl.textContent = "Kadaluarsa";
        return;
      }
      const mins = Math.floor(this.qrisSecondsLeft / 60);
      const secs = this.qrisSecondsLeft % 60;
      timerEl.textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }, 1000);
  }

  stopQrisTimer() {
    if (this.qrisTimerInterval) {
      clearInterval(this.qrisTimerInterval);
      this.qrisTimerInterval = null;
    }
  }

  processCheckout(isSimulation = false) {
    const name = document.getElementById("cust-name")?.value.trim();
    const phone = document.getElementById("cust-phone")?.value.trim();
    const address = document.getElementById("cust-address")?.value.trim();
    const city = document.getElementById("cust-city")?.value.trim();
    const notes = document.getElementById("cust-notes")?.value.trim() || "-";

    if (!name || !phone || !address || !city) {
      showToast("Mohon lengkapi data nama, nomor HP, alamat, dan kota penerima.", "warning");
      return;
    }

    // Simpan customer info untuk kenyamanan
    localStorage.setItem("nusa_saved_customer", JSON.stringify({ name, phone, address, city }));

    const subtotal = window.appCart.getSubtotal();
    const discount = window.appCart.getDiscountAmount();
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shippingFee = isFreeShipping ? 0 : this.selectedCourier.cost;
    const serviceFee = 1000;
    const grandTotal = Math.max(0, subtotal - discount + shippingFee + serviceFee);

    // Tampilkan state loading
    const submitBtn = document.getElementById("btn-submit-order");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-small"></span> Memproses & Memverifikasi Pesanan...
      `;
    }

    setTimeout(() => {
      // Generate Order ID realistis
      const now = new Date();
      const datePart = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0");
      const randomPart = Math.floor(10000 + Math.random() * 90000);
      const invoiceNumber = `INV/${datePart}/YAZUAR/${randomPart}`;

      this.lastOrderData = {
        invoiceNumber,
        date: now.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" }),
        customer: { name, phone, address, city, notes },
        items: [...window.appCart.cart],
        courier: this.selectedCourier,
        paymentMethod: this.getPaymentMethodLabel(this.selectedPayment),
        subtotal,
        discount,
        shippingFee,
        serviceFee,
        grandTotal,
        status: "LUNAS (BERHASIL)"
      };

      // Reset cart
      window.appCart.clearCart();
      window.appCart.saveVoucher(null);

      // Tutup modal checkout & buka struk
      this.closeCheckoutModal();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Bayar & Konfirmasi Pesanan Sekarang`;
      }

      this.openInvoiceModal(this.lastOrderData);
      showToast("Pesanan berhasil dikonfirmasi.", "success");
    }, 1200);
  }

  getPaymentMethodLabel(type) {
    switch (type) {
      case "qris": return "QRIS (Semua E-Wallet / M-Banking)";
      case "va": return "Virtual Account BCA / Mandiri";
      case "cod": return "COD (Bayar Tunai di Tempat)";
      default: return "Transfer Bank";
    }
  }

  openInvoiceModal(order) {
    const modal = document.getElementById("invoice-modal");
    if (!modal) return;

    document.getElementById("inv-number").textContent = order.invoiceNumber;
    document.getElementById("inv-date").textContent = order.date;
    document.getElementById("inv-cust-name").textContent = order.customer.name;
    document.getElementById("inv-cust-phone").textContent = order.customer.phone;
    document.getElementById("inv-cust-address").textContent = `${order.customer.address}, ${order.customer.city}`;
    document.getElementById("inv-cust-notes").textContent = order.customer.notes;
    document.getElementById("inv-courier").textContent = `${order.courier.name} (${order.courier.est})`;
    document.getElementById("inv-payment").textContent = order.paymentMethod;

    // Render items table
    const tableBody = document.getElementById("inv-items-body");
    if (tableBody) {
      tableBody.innerHTML = order.items.map(item => `
        <tr>
          <td>
            <strong>${item.name}</strong>
            <div class="inv-variant-sub">${item.variant}</div>
          </td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${formatRupiah(item.price)}</td>
          <td style="text-align: right; font-weight: 600;">${formatRupiah(item.price * item.quantity)}</td>
        </tr>
      `).join("");
    }

    // Totals
    document.getElementById("inv-subtotal").textContent = formatRupiah(order.subtotal);
    const discRow = document.getElementById("inv-discount-row");
    if (discRow) {
      discRow.style.display = order.discount > 0 ? "table-row" : "none";
      document.getElementById("inv-discount").textContent = `- ${formatRupiah(order.discount)}`;
    }
    document.getElementById("inv-shipping").textContent = order.shippingFee === 0 ? "Gratis (Rp 0)" : formatRupiah(order.shippingFee);
    document.getElementById("inv-total").textContent = formatRupiah(order.grandTotal);

    modal.classList.add("modal-active");
    document.body.style.overflow = "hidden";
  }

  closeInvoiceModal() {
    const modal = document.getElementById("invoice-modal");
    if (modal) {
      modal.classList.remove("modal-active");
      document.body.style.overflow = "";
    }
  }
}

// Inisialisasi Checkout Global
window.appCheckout = new CheckoutController();
