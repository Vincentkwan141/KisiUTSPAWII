// Middleware terpusat untuk menangani seluruh error di Express
const errorHandler = (err, req, res, next) => {
  console.error(err); // Mencetak log error di konsol server untuk keperluan debugging internal.

  // 1. Menangani Error Validasi dari Mongoose (ValidationError)
  if (err.name === "ValidationError") {
    // Mengambil pesan error pertama dari daftar kesalahan validasi yang terjadi.
    const message = Object.values(err.errors).map((item) => item.message)[0];
    return res.status(400).json({ message }); // Kembalikan status 400 Bad Request.
  }

  // 2. Menangani Error Unik/Duplikasi Data MongoDB (MongoServerError dengan kode 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]; // Menentukan field mana yang mengalami duplikasi.
    return res.status(400).json({ message: `${field} sudah terdaftar` }); // Kembalikan status 400 Bad Request.
  }

  // 3. Menangani Error Format ObjectId Mongoose yang Tidak Valid (CastError)
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Format ID tidak valid" }); // Kembalikan status 400 Bad Request.
  }

  // 4. Menangani Error Bawaan/Lainnya dengan Status kustom yang telah ditentukan sebelumnya
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // 5. Penanganan default untuk Error Server tak terduga (Internal Server Error)
  res.status(500).json({ message: "Terjadi kesalahan pada server" }); // Mengirim pesan generik tanpa bocornya stack trace.
};

module.exports = errorHandler; // Mengekspor middleware errorHandler.