const express = require("express");
const { generateDescription } = require ("../controllers/aiController.js");

const router = express.Router();

router.post("/generate", generateDescription);

module.exports = router;