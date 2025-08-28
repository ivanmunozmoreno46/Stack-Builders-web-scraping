const express = require("express");
const controller = require("../controller/index.controllers");
const router = express.Router();

router.use(express.json());

// Route to the scraped info
router.get("/scrape", controller.scrape);

// Route to the filtered entries
router.get("/scrape/:filter", controller.filteredEntries);

router.get("/log", controller.usageLog);
module.exports = router;