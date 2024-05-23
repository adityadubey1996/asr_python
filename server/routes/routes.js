const express = require('express')
const userMetricsController = require('../controllers/metric.controller')


const router =express.Router()

router.get('/metrics/userMetrics',userMetricsController.getUserMetrics)
router.post('/metrics/user-metrics',userMetricsController.createOrUpdateUserMetrics)


module.exports = router