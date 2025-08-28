const express = require("express");
const controller = require("../controller/index.controllers");
const router = express.Router();

router.use(express.json());

// Usa el método scrape del controlador
router.get("/scrape", controller.scrape);

module.exports = router;