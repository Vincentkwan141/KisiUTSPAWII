const Menu = require("../models/menuModel"); // Mengimpor model Menu untuk operasi CRUD database.

// Controller untuk mengambil semua data menu (dengan Filter, Sort, Pagination, Projection, dan Populate)
exports.getAll = async (req, res) => {
  const { kantinId, sort, page = 1, limit = 10, fields } = req.query; // Ekstraksi parameter query dari URL.

  // 1. Filtering
  const filter = {}; // Objek filter dasar.
  if (kantinId) {
    filter.kantinId = kantinId; // Menambahkan filter kantinId jika dikirimkan di URL query.
  }

  // 2. Sorting
  let sortOption = "createdAt"; // Default sorting berdasarkan tanggal dibuat.
  if (sort) {
    sortOption = sort.split(",").join(" "); // Mengubah format pemisah koma 'nama,harga' menjadi 'nama harga' untuk Mongoose.
  }

  // 3. Pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1); // Memastikan nomor halaman minimal 1.
  let limitNum = parseInt(limit, 10) || 10; // Mendapatkan batas jumlah data per halaman.
  if (limitNum > 100) limitNum = 100; // Membatasi batas maksimum limit menjadi 100.
  if (limitNum < 1) limitNum = 10; // Jika limit kurang dari 1, dikembalikan ke default 10.

  const skip = (pageNum - 1) * limitNum; // Menghitung jumlah dokumen yang dilewati (offset).

  // 4. Projection
  let fieldsOption = ""; // Default memilih semua field.
  if (fields) {
    fieldsOption = fields.split(",").join(" "); // Mengubah format koma 'nama,kode' menjadi 'nama kode'.
  }

  // Menghitung total dokumen yang cocok dengan filter secara independen
  const total = await Menu.countDocuments(filter); // Mendapatkan total item untuk info pagination.

  // Mengambil data dari MongoDB sesuai pengaturan query
  const data = await Menu.find(filter) // Jalankan query pencarian sesuai filter.
    .select(fieldsOption) // Terapkan pembatasan kolom/field (Projection).
    .sort(sortOption) // Terapkan urutan data (Sorting).
    .skip(skip) // Lewati sekian data sesuai halaman (Pagination).
    .limit(limitNum) // Batasi total data yang diambil.
    .populate("kantinId"); // Lakukan populate untuk mengganti ObjectId kantinId dengan objek detail kantin.

  // Mengirimkan respon JSON sesuai format standar kontrak API
  res.status(200).json({
    data, // List dokumen menu.
    page: pageNum, // Halaman saat ini.
    limit: limitNum, // Batas data per halaman.
    total, // Total seluruh data yang cocok dengan filter.
  });
};

// Controller untuk mengambil satu detail menu berdasarkan ID
exports.getById = async (req, res) => {
  const { id } = req.params; // Mengambil ID dari parameter URL.
  const menu = await Menu.findById(id).populate("kantinId"); // Cari menu berdasarkan ID dan jalankan populate.

  if (!menu) {
    return res.status(404).json({ message: "Menu tidak ditemukan" }); // Kembalikan HTTP 404 jika data tidak ditemukan.
  }

  res.status(200).json(menu); // Kirim dokumen menu jika ditemukan.
};

// Controller untuk membuat menu baru
exports.create = async (req, res) => {
  const newMenu = await Menu.create(req.body); // Membuat dan menyimpan dokumen baru ke MongoDB.
  res.status(201).json(newMenu); // Kirim respon status 201 Created beserta data menu yang dibuat.
};

// Controller untuk memperbarui data menu berdasarkan ID
exports.update = async (req, res) => {
  const { id } = req.params; // Mengambil ID dari parameter URL.
  
  const updatedMenu = await Menu.findByIdAndUpdate(id, req.body, {
    new: true, // Mengembalikan dokumen yang sudah diperbarui, bukan dokumen lama.
    runValidators: true, // Menjalankan ulang validator skema pada data baru yang dikirim.
  });

  if (!updatedMenu) {
    return res.status(404).json({ message: "Menu tidak ditemukan" }); // Kembalikan HTTP 404 jika ID tidak cocok.
  }

  res.status(200).json(updatedMenu); // Kirim data menu yang telah terupdate.
};

// Controller untuk menghapus menu berdasarkan ID
exports.remove = async (req, res) => {
  const { id } = req.params; // Mengambil ID dari parameter URL.
  const deletedMenu = await Menu.findByIdAndDelete(id); // Menghapus dokumen berdasarkan ID.

  if (!deletedMenu) {
    return res.status(404).json({ message: "Menu tidak ditemukan" }); // Kembalikan HTTP 404 jika ID tidak cocok.
  }

  res.status(204).send(); // Kembalikan HTTP 204 No Content tanpa pesan/body sesuai standar.
};