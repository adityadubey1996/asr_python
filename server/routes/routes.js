const express = require('express')
const userMetricsController = require('../controllers/metric.controller')
const activityController = require('../controllers/activity.controller')


const router =express.Router()

router.get('/metrics/userMetrics',userMetricsController.getUserMetrics)
router.post('/metrics/user-metrics',userMetricsController.createOrUpdateUserMetrics)

router.post('/audio-file',activityController.createFileEntry)
router.get('/audio-files',activityController.getAllFiles)
router.post('/update-audio-file',activityController.updateFile)


module.exports = router