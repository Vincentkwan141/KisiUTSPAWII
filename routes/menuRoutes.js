const express = require("express"); // Mengimpor pustaka Express.
const router = express.Router(); // Membuat instance Express Router.
const menuController = require("../controllers/menuController"); // Mengimpor fungsi-fungsi penanganan dari controller menu.

// Mendefinisikan rute untuk endpoint akar "/menu" (GET dan POST)
router
  .route("/")
  .get(menuController.getAll) // Mengarahkan permintaan GET ke handler getAll.
  .post(menuController.create); // Mengarahkan permintaan POST ke handler create.

// Mendefinisikan rute dengan parameter ID "/menu/:id" (GET, PUT, dan DELETE)
router
  .route("/:id")
  .get(menuController.getById) // Mengarahkan permintaan GET /:id ke handler getById.
  .put(menuController.update) // Mengarahkan permintaan PUT /:id ke handler update.
  .delete(menuController.remove); // Mengarahkan permintaan DELETE /:id ke handler remove.

module.exports = router; // Mengekspor router agar bisa digunakan di app.js.