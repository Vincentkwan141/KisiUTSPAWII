# SI0027 - Latihan UTS Pengembangan Aplikasi Web II

Starter project **latihan persiapan Ujian Tengah Semester** mata kuliah **Pengembangan Aplikasi Web II**, Program Studi Sistem Informasi, Universitas Multi Data Palembang.

Soal UTS sesungguhnya memakai tema yang berbeda, tetapi tipe tugas, struktur kode, dan cara pengujiannya sama. Kerjakan latihan ini sampai seluruh pengujian otomatis lulus agar terbiasa dengan alurnya.

## Studi Kasus: Menu Kantin Kampus

Bangun **RESTful API CRUD** untuk daftar menu makanan/minuman di kantin-kantin kampus. API menyimpan data **Menu** yang dikelompokkan berdasarkan **Kantin**. Semua endpoint bersifat publik (tanpa autentikasi).

Materi yang dilatih: Pertemuan 1-12 (Express.js, middleware & konfigurasi, arsitektur MVC/Layered, pengujian Postman, MongoDB/Mongoose, CRUD NoSQL dengan filtering-sorting-pagination-projection, error handling terpusat).

## Skema Data

### Menu (`menus`) - **entitas utama yang harus Anda implementasikan**

| Field | Tipe | Aturan |
|---|---|---|
| `nama` | String | wajib, spasi awal/akhir dibuang |
| `kode` | String | wajib, **unik**, format `MN-` diikuti tepat 6 digit angka (contoh `MN-004217`) |
| `bahan` | Array of String | **embedded**, minimal 1 bahan |
| `gizi` | Subdocument | **embedded**, tanpa `_id` sendiri |
| `gizi.kalori` | Number | wajib, 0 s.d. 5000 |
| `gizi.protein` | Number | tidak boleh negatif, default `0` |
| `harga` | Number | wajib, tidak boleh negatif |
| `kantinId` | ObjectId | **referencing** ke `Kantin`, wajib |
| `tersedia` | Boolean | default `true` |
| `createdAt` | Date | default waktu saat dokumen dibuat |

### Kantin (`kantins`) - sudah tersedia lengkap sebagai contoh referencing

| Field | Tipe | Aturan |
|---|---|---|
| `nama` | String | wajib, unik |
| `lokasi` | String | default `""` |

Contoh dokumen Menu:

```json
{
  "_id": "665f1c2e8b1e4a0012ab34cd",
  "nama": "Nasi Goreng Spesial",
  "kode": "MN-004217",
  "bahan": ["Beras", "Telur", "Bawang"],
  "gizi": { "kalori": 450, "protein": 15 },
  "harga": 12000,
  "kantinId": "665f1b9a8b1e4a0012ab34aa",
  "tersedia": true,
  "createdAt": "2026-10-29T08:00:00.000Z"
}
```

## Kontrak API

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/kantin` | Daftar kantin (**sudah tersedia**) |
| POST | `/kantin` | Tambah kantin (**sudah tersedia**) |
| GET | `/menu` | Daftar menu + filter/sort/pagination/projection |
| GET | `/menu/:id` | Detail menu |
| POST | `/menu` | Tambah menu |
| PUT | `/menu/:id` | Ubah menu |
| DELETE | `/menu/:id` | Hapus menu |

### Query `GET /menu`

| Parameter | Contoh | Aturan |
|---|---|---|
| `kantinId` | `?kantinId=665f1b9a...` | filter kantin |
| `sort` | `?sort=nama` | urut ascending berdasarkan field; default `createdAt` |
| `page`, `limit` | `?page=2&limit=5` | default `1` dan `10`; `limit` maksimum **100** |
| `fields` | `?fields=nama,kode` | projection, dipisah koma |

Respons berbentuk `{ data, page, limit, total }`; `total` adalah jumlah dokumen yang cocok dengan filter (bukan jumlah data pada halaman). `kantinId` pada `data` dan pada detail menu harus **ter-populate** (objek kantin).

### Kode status & format error

| Situasi | Status |
|---|---|
| Berhasil dibuat | `201` |
| Berhasil dihapus | `204` (tanpa body) |
| Validasi gagal, kode/nama kantin duplikat, format id salah | `400` |
| Data tidak ditemukan | `404` |
| Error tak terduga | `500` (pesan generik, stack trace tidak dibocorkan) |

Semua respons error berbentuk `{ "message": "..." }`.

## Yang Harus Anda Kerjakan

Cari komentar `TODO` di source code. Bagian lain sudah tersedia lengkap.

- [ ] **A. Model** - `models/menuModel.js` (schema Menu, embedded & referencing, validasi)
- [ ] **B. Controller Menu** - `controllers/menuController.js` (`getAll`, `getById`, `create`, `update`, `remove`)
- [ ] **C. Routing** - `routes/menuRoutes.js` dan pendaftaran route pada `app.js`
- [ ] **D. Error handling terpusat** - `middlewares/errorHandler.js` dan pendaftarannya pada `app.js`
- [ ] **E. Pengujian otomatis** - seluruh request pada Postman collection **lulus** (lihat bagian di bawah)

## Menjalankan Project

Prasyarat: Node.js (disarankan lewat NVM) dan MongoDB (cluster MongoDB Atlas gratis atau MongoDB lokal).

```bash
npm install
cp .env.example .env   # isi MONGODB_URI
npm start
# server berjalan di http://localhost:3000
```

> Jangan pernah meng-commit file `.env` (sudah diabaikan oleh `.gitignore`).

## Pengujian Otomatis dengan Postman

Folder `postman/` berisi:

- `SI0027-PAWII-Latihan-UTS.postman_collection.json` - 28 request dengan test script (assertion)
- `latihan.postman_environment.json` - environment `Latihan UTS - Local` (`baseUrl` = `http://localhost:3000`)

**Lewat aplikasi Postman:** impor kedua file, pilih environment **Latihan UTS - Local**, lalu jalankan collection memakai **Collection Runner** (urutan request jangan diubah - request saling berantai lewat variabel environment seperti `kantinId` dan `menuId`).

**Lewat command line (Newman)** - server harus sudah berjalan:

```bash
npm run test:api
```

Data uji (kode menu dan nama kantin) dibuat otomatis dan unik pada setiap run, sehingga collection dapat dijalankan berulang kali. Target akhir: **semua request dan assertion berstatus lulus (0 failed)**.

Hasil Newman/Runner menandai test yang gagal; baca nama test-nya untuk menelusuri bagian kode yang perlu diperbaiki. Endpoint yang belum selesai dikerjakan akan gagal karena timeout (5 detik per request). Jangan mengubah isi folder `postman/`.

## Ketentuan

- Latihan ini tidak dinilai. Kerjakan secara mandiri pada **fork** repositori ini di akun GitHub Anda.
- Struktur folder dan nama file boleh ditambah, tetapi kontrak API di atas **tidak boleh diubah** karena dipakai oleh pengujian otomatis.
