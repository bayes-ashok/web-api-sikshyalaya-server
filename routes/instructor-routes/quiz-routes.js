const express = require("express");
const { createQuizSet, getAllQuizSets, getQuizSetsByCategory } = require("../../controllers/instructor-controller/quiz-controller");

const router = express.Router();

router.post("/create", createQuizSet);
router.get("/", getAllQuizSets);
router.get("/category/:category", getQuizSetsByCategory);

module.exports = router;
