const express = require("express");
const router = express.Router();

const HabitController = require("../controllers/HabitController");

// For rendering different pages and controllers
router.get("/", HabitController.load);
router.post("/add-habit", HabitController.add);
router.get("/delete-habit", HabitController.delete);
router.get("/view-habit", HabitController.viewhabit);
router.get("/find-habit", HabitController.fetchhabit);
router.get("/update-db-date", HabitController.updateDates);

module.exports = router;
