const mongoose = require("mongoose"); // Mengimpor modul Mongoose untuk mengelola skema dan model MongoDB.

// Mengidentifikasi dan membuat Schema untuk sub-dokumen 'gizi' (Embedded Document).
const giziSchema = new mongoose.Schema(
  {
    kalori: {
      type: Number, // Tipe data angka.
      required: [true, "Kalori wajib diisi"], // Wajib ada.
      min: [0, "Kalori tidak boleh kurang dari 0"], // Nilai minimal 0.
      max: [5000, "Kalori tidak boleh lebih dari 5000"], // Nilai maksimal 5000.
    },
    protein: {
      type: Number, // Tipe data angka.
      default: 0, // Nilai bawaan adalah 0 jika tidak dimasukkan.
      min: [0, "Protein tidak boleh kurang dari 0"], // Nilai minimal 0.
    },
  },
  { _id: false } // Menghilangkan pembuatan field _id otomatis untuk sub-dokumen gizi.
);

// Membuat Skema Utama untuk Menu
const menuSchema = new mongoose.Schema({
  nama: {
    type: String, // Tipe data string.
    required: [true, "Nama menu wajib diisi"], // Wajib diisi.
    trim: true, // Menghapus spasi di awal dan akhir string secara otomatis.
  },
  kode: {
    type: String, // Tipe data string.
    required: [true, "Kode menu wajib diisi"], // Wajib diisi.
    unique: true, // Memastikan nilai kode menu unik di dalam database.
    match: [/^MN-\d{6}$/, "Format kode harus MN- diikuti 6 digit angka"], // Validasi RegEx format 'MN-' + 6 digit angka.
  },
  bahan: {
    type: [String], // Berupa array berisi string.
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length >= 1; // Memastikan array tidak kosong (minimal 1 bahan).
      },
      message: "Minimal harus ada 1 bahan", // Pesan error jika array kosong.
    },
  },
  gizi: {
    type: giziSchema, // Menggunakan sub-skema giziSchema yang telah dibuat di atas.
    required: [true, "Gizi wajib diisi"], // Sub-dokumen gizi wajib dilampirkan.
  },
  harga: {
    type: Number, // Tipe data angka.
    required: [true, "Harga wajib diisi"], // Wajib diisi.
    min: [0, "Harga tidak boleh negatif"], // Harga tidak boleh kurang dari 0.
  },
  kantinId: {
    type: mongoose.Schema.Types.ObjectId, // Tipe data ObjectId dari MongoDB.
    ref: "Kantin", // Referensi antardokumen (referencing) ke model 'Kantin'.
    required: [true, "Kantin ID wajib diisi"], // Wajib diisi.
  },
  tersedia: {
    type: Boolean, // Tipe data boolean (true/false).
    default: true, // Nilai default adalah true.
  },
  createdAt: {
    type: Date, // Tipe data waktu/tanggal.
    default: Date.now, // Nilai default mengambil waktu server saat dokumen dibuat.
  },
});

// Mengekspor model "Menu" agar dapat digunakan pada Controller.
module.exports = mongoose.model("Menu", menuSchema);