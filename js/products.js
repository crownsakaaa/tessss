/**
 * KATALOG PRODUK YAZUAR APPAREL CO.
 * Brand streetwear / distro apparel lokal
 */

const PRODUCTS_DATA = [
  {
    id: "yazuar-01",
    name: "Heavyweight Boxy Tee 20s — Black",
    category: "tshirt",
    categoryLabel: "T-Shirt",
    price: 135000,
    originalPrice: 165000,
    image: "images/tee-black.jpg",
    rating: 4.9,
    reviewCount: 340,
    soldCount: 820,
    badge: "BESTSELLER",
    stock: 22,
    variants: ["S", "M", "L", "XL", "XXL"],
    variantType: "Size",
    shortDesc: "100% Heavy Cotton Combed 20s (220 GSM), boxy cut, rib kerah tebal 2.8cm anti melar.",
    description: "T-shirt berpotongan boxy oversized dengan material katun combed 20s berbobot tebal (220 GSM). Pola badan lebar dengan panjang pas di pinggang. Jahitan rantai di pundak dan rib leher tebal yang tidak gampang melar walau sering dicuci.",
    specs: [
      { label: "Bahan", value: "100% Cotton Combed 20s (Heavyweight 220 GSM)" },
      { label: "Fitting", value: "Boxy Oversized Cut (Drop Shoulder)" },
      { label: "Kerah", value: "Rib Cotton 2.8cm Double Stitching" },
      { label: "Perawatan", value: "Cuci suhu normal, balik kaos saat setrika" }
    ],
    reviews: [
      { name: "Fajar Nugraha", rating: 5, date: "2 hari lalu", comment: "Bahan tebel kaku mantep, bukan combed 30s tipis. BB 72 TB 174 ambil L fitting boxy-nya pas bgt." },
      { name: "Kevin Sanjaya", rating: 5, date: "Seminggu lalu", comment: "Jahitan rapih, lehernya kenceng gak gampang melar. Dapet free sticker pack juga." },
      { name: "Rian Aditya", rating: 4, date: "2 minggu lalu", comment: "Pengiriman cepet, sehari nyampe Jakarta. Warna hitamnya pekat." }
    ]
  },
  {
    id: "yazuar-02",
    name: "Heavy Cotton Oversized Tee — Clay Terracotta",
    category: "tshirt",
    categoryLabel: "T-Shirt",
    price: 139000,
    originalPrice: 170000,
    image: "images/tee-terracotta.jpg",
    rating: 4.8,
    reviewCount: 195,
    soldCount: 450,
    badge: "FAVORITE",
    stock: 14,
    variants: ["S", "M", "L", "XL"],
    variantType: "Size",
    shortDesc: "Katun combed 24s washed finish warna terracotta hangat, nyaman untuk daily wear.",
    description: "Kaos kasual potongan santai dengan proses enzyme wash untuk tekstur kain lembut dan warna earth-tone clay terracotta yang khas. Jahitan overdeck 3 jarum di lengan dan kelim bawah.",
    specs: [
      { label: "Bahan", value: "Cotton Combed 24s Enzyme Washed" },
      { label: "Fitting", value: "Relaxed Fit" },
      { label: "Jahitan", value: "Overdeck 3 Jarum (Standar Ekspor)" },
      { label: "Warna", value: "Clay Terracotta (Reaktif)" }
    ],
    reviews: [
      { name: "Bayu Prakoso", rating: 5, date: "3 hari lalu", comment: "Warnanya cakep parah, jarang ada distro yang dapet tone terracotta seenak ini." },
      { name: "Dinda Pratiwi", rating: 5, date: "Kemarin", comment: "Beli buat kado pacar, dia suka banget. Bahannya adem gak gerah dipake siang hari." }
    ]
  },
  {
    id: "yazuar-03",
    name: "Heavy Fleece Pullover Hoodie 330gsm — Sage Green",
    category: "outerwear",
    categoryLabel: "Outerwear",
    price: 265000,
    originalPrice: 320000,
    image: "images/hoodie-sage.jpg",
    rating: 5.0,
    reviewCount: 142,
    soldCount: 310,
    badge: "NEW DROP",
    stock: 18,
    variants: ["M", "L", "XL"],
    variantType: "Size",
    shortDesc: "Cotton Fleece tebal 330 GSM tanpa bulu rontok, hood ganda tegak, saku kangguru luas.",
    description: "Hoodie pullover menggunakan kain Cotton Fleece premium gramasi 330 GSM bertekstur tebal dan hangat. Desain hood double-layer yang kokoh dan tegak saat dipakai, saku kangguru lapang dengan bar-tack reinforcement.",
    specs: [
      { label: "Material", value: "Heavyweight Cotton Fleece 330 GSM" },
      { label: "Fitur", value: "Double Layer Hood, Tali Katun Bundar, Eyelet Logam" },
      { label: "Saku", value: "Kangaroo Pocket dengan Jahitan Penguat Bar-tack" },
      { label: "Fitting", value: "Slightly Oversized" }
    ],
    reviews: [
      { name: "Alif Maulana", rating: 5, date: "4 hari lalu", comment: "Hoodie paling worth it di harga segini. Kupluknya tegak gak letoy, dalemannya halus." },
      { name: "Gilang Ramadhan", rating: 5, date: "Seminggu lalu", comment: "Warna sage green-nya kalem elegan. Dipake riding malam anget banget." }
    ]
  },
  {
    id: "yazuar-04",
    name: "Heavy Duty Canvas Daily Tote Bag 14oz — Natural",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 110000,
    originalPrice: 135000,
    image: "images/tote-bag.jpg",
    rating: 4.8,
    reviewCount: 280,
    soldCount: 710,
    badge: "RESTOCK",
    stock: 30,
    variants: ["Natural Off-White"],
    variantType: "Varian",
    shortDesc: "Kanvas tebal 14oz kaku anti letoy, strap kulit sintetis tebal, slot laptop 14 inch.",
    description: "Totebag utilitarian dengan material kanvas tebal 14oz yang kokoh berdiri sendiri. Dilengkapi kompartemen busa dalam untuk laptop hingga 14 inch, kancing magnet penutup, dan saku ritsleting untuk dompet/kunci.",
    specs: [
      { label: "Bahan", value: "Cotton Canvas Heavyweight 14oz Unbleached" },
      { label: "Handle", value: "Strap Kulit Tebal 3mm Double Rivet" },
      { label: "Dimensi", value: "Tinggi 40cm x Lebar 38cm x Gusset 10cm" },
      { label: "Kompartemen", value: "Laptop Sleeve 14 inch & Inner Zip Pocket" }
    ],
    reviews: [
      { name: "Nabila Aurelia", rating: 5, date: "Kemarin", comment: "Muat laptop 14 inch, binder tebal, sama botol minum. Kanvasnya beneran tebel bukan yang lemes." },
      { name: "Arif Hidayat", rating: 4, date: "5 hari lalu", comment: "Strapnya kuat gak bikin pundak pegel. Desain clean cocok buat ngampus/sekolah." }
    ]
  },
  {
    id: "yazuar-05",
    name: "Corduroy 6-Panel Unstructured Cap — Dark Olive",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 95000,
    originalPrice: 120000,
    image: "images/cap-corduroy.jpg",
    rating: 4.9,
    reviewCount: 160,
    soldCount: 380,
    badge: "POPULAR",
    stock: 20,
    variants: ["All Size (Adjustable)"],
    variantType: "Size",
    shortDesc: "Topi corduroy serat rapat 16 wale, buckle logam kuningan, bordir minimalis di samping.",
    description: "Topi baseball 6 panel berstruktur santai dibuat dari bahan corduroy katun lembut berserat 16 wale. Menggunakan strap belakang berbahan kulit dengan buckle logam kuningan antik untuk penyesuaian ukuran kepala.",
    specs: [
      { label: "Bahan", value: "100% Cotton Corduroy 16 Wale" },
      { label: "Bentuk", value: "6-Panel Low Profile Unstructured Crown" },
      { label: "Strap", value: "Leather Strap with Brass Metal Clasp" },
      { label: "Ukuran", value: "Lingkar Kepala 54 - 60 cm (Bisa diatur)" }
    ],
    reviews: [
      { name: "Satria Budi", rating: 5, date: "3 hari lalu", comment: "Bentuk topinya pas di kepala gak bikin pusing, corduroy-nya halus." },
      { name: "Rio Pratama", rating: 5, date: "1 minggu lalu", comment: "Klip belakangnya logam bagus bgt, warnanya gampang dicocokin sama outfit." }
    ]
  },
  {
    id: "yazuar-06",
    name: "Stainless Insulated Tumbler 500ml — Matte Sand",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 125000,
    originalPrice: 150000,
    image: "images/tumbler-sand.jpg",
    rating: 4.9,
    reviewCount: 220,
    soldCount: 590,
    badge: "HOT ITEM",
    stock: 25,
    variants: ["Sand Beige", "Matte Black"],
    variantType: "Warna",
    shortDesc: "Vacuum insulation stainless 304, tahan dingin 18 jam & panas 8 jam, anti tumpah.",
    description: "Tumbler minum berdinding ganda dengan insulasi vakum. Finishing powder coat bertekstur matte yang tahan gores dan tidak licin digenggam. Tutup ulir dengan seal karet silikon rapat anti bocor saat dibawa di ransel.",
    specs: [
      { label: "Kapasitas", value: "500 ml" },
      { label: "Bahan", value: "Food-Grade SUS 304 Stainless Steel (BPA Free)" },
      { label: "Insulasi", value: "Dingin hingga 18 jam / Panas hingga 8 jam" },
      { label: "Finishing", value: "Matte Powder Coating Anti Scratch" }
    ],
    reviews: [
      { name: "Irfan Hakim", rating: 5, date: "Kemarin", comment: "Es batu dimasukin dari pagi, sore masih ada dong! Cat matte-nya premium bgt." },
      { name: "Tiara Melati", rating: 5, date: "4 hari lalu", comment: "Gak pernah bocor ditaruh di tas. Ukurannya pas di cup holder mobil dan ransel." }
    ]
  },
  {
    id: "yazuar-07",
    name: "Grid Hardcover Journal A5 — Bookpaper 100gsm",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 65000,
    originalPrice: 80000,
    image: "images/notebook-journal.jpg",
    rating: 4.8,
    reviewCount: 140,
    soldCount: 420,
    badge: "ESSENTIAL",
    stock: 35,
    variants: ["Dot Grid (Titik)", "Grid (Kotak)", "Lined (Garis)"],
    variantType: "Format",
    shortDesc: "Buku catatan jahit benang flat-lay 180°, kertas bookpaper 100gsm tebal anti tembus.",
    description: "Notebook sampul keras berbalut kain linen dengan 192 halaman kertas bookpaper tebal 100gsm. Nyaman ditulis dengan pulpen gel atau pena fountain tanpa tembus ke halaman belakang. Jilid jahit benang memungkinkan buku terbuka rata 180 derajat.",
    specs: [
      { label: "Cover", value: "Hardcover Textured Linen Fabric" },
      { label: "Kertas", value: "100 gsm Acid-Free Bookpaper (192 Halaman)" },
      { label: "Binding", value: "Thread Sewn Flat-Lay 180°" },
      { label: "Ukuran", value: "A5 (14.8 cm x 21 cm)" }
    ],
    reviews: [
      { name: "Mega Utami", rating: 5, date: "3 hari lalu", comment: "Kertasnya enak bgt buat journaling, dipake pulpen snowman drawing pen gak tembus." }
    ]
  },
  {
    id: "yazuar-08",
    name: "Flores Bajawa Filter Roast 200g — Single Origin",
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    price: 75000,
    originalPrice: 85000,
    image: "images/coffee-flores.jpg",
    rating: 4.9,
    reviewCount: 180,
    soldCount: 490,
    badge: "FRESH ROAST",
    stock: 20,
    variants: ["Biji Utuh (Beans)", "Giling V60 / Manual", "Giling Halus (Mokapot)"],
    variantType: "Gilingan",
    shortDesc: "Arabika Ngada Flores 1500mdpl, notes: dark chocolate, sweet brown sugar, hazelnut.",
    description: "Kopi arabika single origin dari dataran tinggi Bajawa, Flores. Di-roast fresh profil medium roast untuk manual brew (V60, French Press, Aeropress). Karakter bodi tebal dengan keasaman seimbang dan rasa manis gula tebu.",
    specs: [
      { label: "Origin", value: "Bajawa, Flores, NTT (1.450 - 1.600 mdpl)" },
      { label: "Proses", value: "Full Washed (Typica & Kartika)" },
      { label: "Roast Profile", value: "Medium Filter Roast" },
      { label: "Tasting Notes", value: "Dark Chocolate, Sweet Molasses, Hazelnut" }
    ],
    reviews: [
      { name: "Agung Pratama", rating: 5, date: "Kemarin", comment: "Roastingan masih fresh, baru 4 hari pas dibuka wanginya semerbak. Mantap buat V60 pagi." }
    ]
  }
];

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
