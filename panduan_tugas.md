# Panduan Pengerjaan dan Pengujian Latihan UTS PAW II - RESTful API Menu Kantin

Dokumen ini berisi panduan teknis langkah demi langkah untuk menyelesaikan tugas Latihan UTS Pengembangan Aplikasi Web II (Express.js & Mongoose) serta cara menjalankan pengujian otomatis menggunakan **Newman**.

---

## 📋 Daftar Isi
1. [Persiapan Awal](#1-persiapan-awal)
2. [Struktur Berkas & File yang Dibuat](#2-struktur-berkas--file-yang-dibuat)
3. [Penjelasan Implementasi Kode](#3-penjelasan-implementasi-kode)
   - [Model (`models/menuModel.js`)](#a-model-modelsmenumodeljs)
   - [Controller (`controllers/menuController.js`)](#b-controller-controllersmenucontrollerjs)
   - [Routes (`routes/menuRoutes.js`)](#c-routes-routesmenuroutesjs)
   - [Error Handler (`middlewares/errorHandler.js`)](#d-error-handler-middlewareserrorhandlerjs)
   - [Aplikasi Utama (`app.js`)](#e-aplikasi-utama-appjs)
4. [Langkah Pengujian Newman](#4-langkah-pengujian-newman)
5. [Troubleshooting & Error Umum](#5-troubleshooting--error-umum)

---

## 1. Persiapan Awal

1. **Install Dependensi Project**:
   Buka terminal di direktori proyek dan jalankan:
   ```bash
   npm install
   ```

2. **Konfigurasi Environment Variable (`.env`)**:
   Salin berkas `.envcopy.example` menjadi `.env`:
   ```bash
   cp .envcopy.example .env
   ```
   *Atau buat berkas `.env` baru dan isi dengan:*
   ```env
   MONGODB_URI=mongodb+srv://vincentkwan2428240141_db_user:T9mQubyz573HDoqU@cluster0.3r0ajrz.mongodb.net/
   PORT=3000
   ```

---

## 2. Struktur Berkas & File yang Dibuat

Pastikan struktur direktori proyek Anda memiliki file-file berikut:

```text
.
├── app.js
├── controllers/
│   ├── kantinController.js (sudah ada)
│   └── menuController.js   (DIBUAT)
├── middlewares/
│   └── errorHandler.js     (DIBUAT)
├── models/
│   ├── kantinModel.js     (sudah ada)
│   └── menuModel.js       (DIBUAT)
├── routes/
│   ├── kantinRoutes.js    (sudah ada)
│   └── menuRoutes.js      (DIBUAT)
├── postman/
│   ├── SI0027-PAWII-Latihan-UTS.postman_collection.json
│   └── latihan.postman_environment.json
├── package.json
└── panduantugas.md        (FILE INI)
```

---

## 3. Penjelasan Implementasi Kode

### A. Model (`models/menuModel.js`)
Mengatur skema basis data Mongoose untuk entitas `Menu`:
- **Embedding**: Field `gizi` menggunakan `giziSchema` tanpa `_id` tersendiri (`{ _id: false }`).
- **Validation**:
  - `nama`: String, wajib, dipotong spasi awal/akhir (`trim: true`).
  - `kode`: Format unik menggunakan RegEx `^MN-\d{6}$` (harus `MN-` diikuti tepat 6 angka).
  - `bahan`: Array String dengan kustom validator minimal 1 elemen.
  - `harga`: Angka non-negatif (`min: 0`).
- **Referencing**: Field `kantinId` bertipe `ObjectId` yang merujuk ke model `Kantin`.

### B. Controller (`controllers/menuController.js`)
Menangani logika bisnis endpoint menu:
- **`getAll`**:
  - Filtering berdasarkan `kantinId`.
  - Sorting berdasarkan field yang dikirimkan query (default: `createdAt`).
  - Pagination dengan `page` (default 1) dan `limit` (default 10, maksimal 100).
  - Projection menggunakan `fields` dipisah koma.
  - Menggunakan `.populate("kantinId")` untuk mengambil detail objek kantin.
  - Mengembalikan format JSON: `{ data, page, limit, total }`.
- **`getById`**: Ambil detail menu berdasarkan ID (+ populate `kantinId`). Mengembalikan HTTP `404` jika data tidak ada.
- **`create`**: Menambah menu baru (HTTP status `201`).
- **`update`**: Mengubah data menu berdasarkan ID (`runValidators: true`).
- **`remove`**: Menghapus data menu berdasarkan ID (HTTP status `204` tanpa body).

### C. Routes (`routes/menuRoutes.js`)
Mendaftarkan rute Express HTTP verb:
- `GET /` -> `menuController.getAll`
- `POST /` -> `menuController.create`
- `GET /:id` -> `menuController.getById`
- `PUT /:id` -> `menuController.update`
- `DELETE /:id` -> `menuController.remove`

### D. Error Handler (`middlewares/errorHandler.js`)
Middleware penanganan error terpusat:
- **`ValidationError`** (Mongoose): Status `400` Bad Request.
- **`MongoServerError` (11000)**: Handling error duplikasi unik (misal kode unik), Status `400` Bad Request.
- **`CastError`**: Status `400` untuk format `ObjectId` yang tidak sesuai.
- **Server Error Lainnya**: Status `500` dengan pesan generik tanpa membocorkan stack trace.

### E. Aplikasi Utama (`app.js`)
Mendaftarkan middleware dan route baru:
1. `const menuRoutes = require("./routes/menuRoutes");`
2. `const errorHandler = require("./middlewares/errorHandler");`
3. `app.use("/menu", menuRoutes);`
4. `app.use(errorHandler);` *(Harus terdaftar paling akhir setelah semua route)*

---

## 4. Langkah Pengujian Newman

Pengujian dilakukan secara otomatis menggunakan paket **Newman** yang mengeksekusi Postman Collection secara berurutan.

### Langkah 1: Jalankan Server Application
Buka terminal **pertama** di direktori proyek dan jalankan:
```bash
npm start
```
*Pastikan muncul output:*
```text
Terhubung ke MongoDB
Server berjalan di http://localhost:3000
```

### Langkah 2: Jalankan Newman CLI Test
Buka terminal **kedua** (Server di terminal pertama harus tetap menyala) dan jalankan:
```bash
npm run test:api
```

### Ekspektasi Hasil Output
Jika semua kriteria skema, controller, dan middleware error handling sudah tepat, maka ringkasan di akhir eksekusi Newman akan menunjukkan status **0 Failed**:

```text
┌─────────────────────────┬───────────────────┬───────────────────┐
│                         │           executed│             failed│
├─────────────────────────┼───────────────────┼───────────────────┤
│              iterations │                  1│                  0│
│        requests / tests │          28 / 28  │            0 / 0  │
└─────────────────────────┴───────────────────┴───────────────────┘
```

---

## 5. Troubleshooting & Error Umum

| Gejala Error | Penyebab Utama | Solusi |
|---|---|---|
| **`ECONNREFUSED 127.0.0.1:3000`** | Server Express belum dinyalakan di terminal. | Jalankan `npm start` di terminal terpisah sebelum menjalankan `npm run test:api`. |
| **`Request Timeout (5000ms)`** | Route/Controller tidak memberikan response atau belum terdaftar di `app.js`. | Cek apakah rute `/menu` sudah didaftarkan di `app.js` dan setiap fungsi di controller memanggil `res.status(...).json(...)`. |
| **`400 Bad Request` pada ID Valid** | Mongoose `CastError` gagal terproses. | Pastikan `errorHandler.js` sudah mendeteksi `err.name === "CastError"` dan mengembalikan status `400`. |
| **Total pagination tidak sesuai** | Perhitungan `total` menggunakan data yang ter-limit. | Gunakan `Menu.countDocuments(filter)` secara terpisah sebelum query `.skip().limit()`. |
| **Kantin ID berupa string/ID biasa, bukan objek** | Lupa melakukan populate data kantin. | Tambahkan `.populate("kantinId")` pada query `find` dan `findById`. |