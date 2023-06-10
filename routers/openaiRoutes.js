const { Router } = require("express");
const router = Router();
const generateAnswers = require("../controllers/gpt.config");
router.post("/openai", generateAnswers);

module.exports = router;
