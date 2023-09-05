const Habit = require("../models/Habit");

// Load habits from the database
exports.load = async (request, response) => {
  try {
    const habits = await Habit.find({});
    response.render("home", { habit_list: habits });
  } catch (err) {
    console.error("Error in fetching habits from DB:", err);
    response.status(500).send("Internal Server Error");
  }
};

// Add a new habit to the list
exports.add = async (request, response) => {
  try {
    const newHabit = await Habit.create({
      ...request.body,
      record_tracker: {},
      user: "AnyUser",
    });
    console.log(request.body);
    response.redirect("back");
  } catch (err) {
    console.error("Error in creating a habit:", err);
    response.status(500).send("Internal Server Error");
  }
};

// Delete a habit from the list
exports.delete = async (request, response) => {
  try {
    const id = request.query.id;
    await Habit.findByIdAndDelete(id);
    response.redirect("back");
  } catch (err) {
    console.error("Error in deletion:", err);
    response.status(500).send("Internal Server Error");
  }
};

// Render a habit by its ID
exports.viewhabit = async (request, response) => {
  try {
    const id = request.query.id;
    const habit = await Habit.findById(id);
    response.render("habit.ejs", { habit });
  } catch (err) {
    console.error("Error in finding habit:", err);
    response.status(500).send("Internal Server Error");
  }
};

// Fetch a habit by its ID and return it as JSON
exports.fetchhabit = async (request, response) => {
  try {
    const id = request.query.id;
    const habit = await Habit.findById(id);
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(habit));
  } catch (err) {
    console.error("Error in finding habit:", err);
    response.status(500).send("Internal Server Error");
  }
};

// Update habit's record tracker
exports.updateDates = async (request, response) => {
  try {
    const id = request.query.id;
    const { date, value } = request.query;
    console.log(date, value, id);

    const habit = await Habit.findById(id);

    if (!habit) {
      console.error("Habit not found");
      return response.status(404).json({ status: "failed" });
    }

    let r_t = habit.record_tracker;

    if (!r_t) {
      r_t = new Map();
    }

    r_t.set(date, value);

    await Habit.updateOne({ _id: id }, { $set: { record_tracker: r_t } });

    response.json({ status: "success" });
  } catch (err) {
    console.error("Error in updating habit:", err);
    response.status(500).json({ status: "failed" });
  }
};
