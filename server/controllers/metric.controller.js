// metrics.routes.js
const express = require("express");
const db = require("../models");
const router = express.Router();

// Fetch all metrics (questions)
// router.get('/questions', async (req, res) => {
//   try {
//     const questions = await db.metrics.findAll();
//     res.status(200).json(questions);
//   } catch (error) {
//     console.error('Failed to fetch questions:', error);
//     res.status(500).json({ message: 'Error fetching questions from database' });
//   }
// });


const getUserMetrics = async (req, res) => {
  const userId = req.user.id
  try {
    const userMetrics = await db.userMetrics.findAll({
      where: { userId: userId },
    });
    res.json(userMetrics);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Save user answers
const createOrUpdateUserMetrics = async (req, res) => {
  const userId = req.user.id
  const answers  = req.body;
  console.log('userId, answers', userId, answers)
  try {
    // Implement logic to save answers, perhaps updating or creating new entries in UserMetrics
    await db.userMetrics.create({ userId, customSettings : JSON.stringify(answers) });
    res.status(200).json({ message: "Answers saved successfully" });
  } catch (error) {
    console.log('error', error)
    console.error("Failed to save answers:", error);
    res
      .status(500)
      .json({ message: "Failed to save answers", error: error.message });
  }
};

module.exports = {
  getUserMetrics,
  createOrUpdateUserMetrics,
};
