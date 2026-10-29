// Latihan UTS PAW II - Menu Kantin Kampus (Starter)
// Koneksi MongoDB, CORS, parser JSON, dan route /kantin sudah tersedia.
// Lengkapi bagian bertanda TODO (lihat README.md bagian C dan D).

require("express-async-errors"); // Menagkap exception async secara otomatis tanpa perlu try-catch di setiap controller.
require("dotenv").config(); // Memuat variabel lingkungan (.env) ke process.env.
const express = require("express"); // Mengimpor framework Express.
const cors = require("cors"); // Mengimpor middleware CORS.
const mongoose = require("mongoose"); // Mengimpor ODM Mongoose.

const app = express(); // Inisialisasi aplikasi Express.
const PORT = process.env.PORT || 3000; // Menentukan Port server.

const kantinRoutes = require("./routes/kantinRoutes"); // Mengimpor route Kantin yang sudah ada.
// TODO C2: require route menu dari ./routes/menuRoutes
const menuRoutes = require("./routes/menuRoutes"); // [DITAMBAHKAN] Mengimpor route Menu.

// TODO D2: require middleware errorHandler dari ./middlewares/errorHandler
const errorHandler = require("./middlewares/errorHandler"); // [DITAMBAHKAN] Mengimpor penanganan error terpusat.

app.use(cors()); // Mengaktifkan CORS untuk mengizinkan akses dari domain luar.
app.use(express.json()); // Middleware untuk mengubah body permintaan incoming bernilai JSON menjadi req.body.

app.use("/kantin", kantinRoutes); // Mendaftarkan route kantin di path /kantin.
// TODO C3: daftarkan route menu pada path "/menu"
app.use("/menu", menuRoutes); // [DITAMBAHKAN] Mendaftarkan rute menu pada path base "/menu".

// TODO D3: daftarkan errorHandler sebagai middleware PALING AKHIR (setelah semua route)
app.use(errorHandler); // [DITAMBAHKAN] Mendaftarkan errorHandler di urutan paling akhir.

// Menghubungkan ke MongoDB dan menjalankan server HTTP
mongoose
  .connect(process.env.MONGODB_URI) // Membuka koneksi ke URI MongoDB.
  .then(() => {
    console.log("Terhubung ke MongoDB");
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`); // Menjalankan listener server di port pilihan.
    });
  })
  .catch((err) => {
    console.error("Gagal terhubung ke MongoDB:", err.message); // Menampilkan pesan kesalahan jika koneksi DB gagal.
    process.exit(1); // Menghentikan proses aplikasi dengan status kode error.
  });