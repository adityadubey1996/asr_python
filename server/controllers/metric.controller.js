// UserMetricsController.js
const db = require("../models");
const { catchError } = require("../utils/catchBlock");

const validateUserId = (userId) => {
    return userId && !isNaN(parseInt(userId));
};

const validateBodyForCreation = (body) => {
    if (!body.workflowTitle || typeof body.workflowTitle !== 'string' || !body.workflowTitle.trim()) {
        return { isValid: false, message: 'Valid workflow title is required.' };
    }
    if (!body.customSettings || typeof body.customSettings !== 'object') {
        return { isValid: false, message: 'Valid custom settings are required.' };
    }
    return { isValid: true };
};

// Get all metrics for a specific user
const getUserMetrics = async (req, res) => {
  if (!validateUserId(req.user.id)) {
    return res.status(400).json({ message: "User ID is required and must be a valid number." });
  }
  
  try {
    const userMetrics = await db.userMetrics.findAll({
      where: { userId: req.user.id }
    });
    res.json(userMetrics);
  } catch (error) {
    catchError(res, error);
  }
};

// Get a single user metric by ID
const getUserMetricById = async (req, res) => {
  if (!validateUserId(req.user.id)) {
    return res.status(400).json({ message: "User ID is required and must be a valid number." });
  }
  const { id } = req.params || req.body;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: "Valid Metric ID is required." });
  }

  try {
    const userMetric = await db.userMetrics.findOne({
      where: { userMetricId: id, userId: req.user.id }
    });
    if (userMetric) {
      res.json(userMetric);
    } else {
      res.status(404).send('Metric not found');
    }
  } catch (error) {
    catchError(res, error);
  }
};

// Create a new user metric
const createUserMetric = async (req, res) => {
  const { id : userId } = req.user;
  const { workflowTitle, customSettings } = req.body;
  const validation = validateBodyForCreation(req.body);
  if (!validateUserId(userId) || !validation.isValid) {
    return res.status(400).json({ message: validation.message || "User ID is required and must be a valid number." });
  }

  try {
    const newUserMetric = await db.userMetrics.create({
      userId: userId,
      workflowTitle : workflowTitle,
      customSettings: JSON.stringify(customSettings)
    });
    
    res.status(201).json(newUserMetric);
  } catch (error) {
    console.log('error', error)
    catchError(res, error);
  }
};

// Update an existing user metric
const updateUserMetric = async (req, res) => {
  const { id } = req.params || req.body;
  const { workflowTitle, customSettings } = req.body;
  const validation = validateBodyForCreation(req.body);
  if (!validateUserId(req.user.id) || !id || isNaN(parseInt(id)) || !validation.isValid) {
    return res.status(400).json({ message: validation.message || "Valid Metric ID and User ID are required." });
  }

  try {
    const userMetric = await db.userMetrics.findOne({
      where: { userMetricId: id, userId: req.user.id }
    });
    if (userMetric) {
      userMetric.workflowTitle = workflowTitle;
      userMetric.customSettings = JSON.stringify(customSettings);
      await userMetric.save();
      res.json(userMetric);
    } else {
      res.status(404).send('Metric not found');
    }
  } catch (error) {
    catchError(res, error);
  }
};

// Delete a user metric
const deleteUserMetric = async (req, res) => {
  const { id } = req.params ||  req.body;
  console.log('id', id)
  if (!validateUserId(req.user.id) || !id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: "Valid Metric ID and User ID are required." });
  }

  try {
    const result = await db.userMetrics.destroy({
      where: { userMetricId: id, userId: req.user.id }
    });
    if (result) {
      res.status(200).send("Metric deleted successfully");
    } else {
      res.status(404).send("Metric not found");
    }
  } catch (error) {
    catchError(res, error);
  }
};

module.exports = {
  getUserMetrics,
  getUserMetricById,
  createUserMetric,
  updateUserMetric,
  deleteUserMetric
};
