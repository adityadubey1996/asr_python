// metrics.routes.js
const express = require('express');
const  db  = require('../models'); 
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

router.get('/userMetrics/:userId', async (req, res) => {
  try {
      const userMetrics = await UserMetric.findAll({
          where: { userId: req.params.userId }
      });
      res.json(userMetrics);
  } catch (error) {
      res.status(500).send(error.message);
  }
});



// Save user answers
router.post('/answers/:userId', async (req, res) => {
  const { userId } = req.params;
  const { answers } = req.body;
  try {
    // Implement logic to save answers, perhaps updating or creating new entries in UserMetrics
    await db.metrics.createOrUpdate({ userId, answers }); // This is pseudo-code
    res.status(200).json({ message: 'Answers saved successfully' });
  } catch (error) {
    console.error('Failed to save answers:', error);
    res.status(500).json({ message: 'Failed to save answers', error: error.message });
  }
});

module.exports = router;
