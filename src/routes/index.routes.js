const express = require("express");
const controller = require("../controller/index.controllers");
console.log(controller);
const router = express.Router();

router.use(express.json());