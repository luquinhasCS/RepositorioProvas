const express = require("express");
const upload = require("../config/multer");
const controller = require("../controllers/provasController");

const router = express.Router();

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.get("/:id/arquivo", controller.baixarArquivo);
router.post("/", upload.single("Arquivo"), controller.criar);
router.put("/:id", upload.single("Arquivo"), controller.atualizar);
router.delete("/:id", controller.remover);

module.exports = router;