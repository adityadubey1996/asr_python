const express = require('express')
const userMetricsController = require('../controllers/metric.controller')
const activityController = require('../controllers/activity.controller')
const bucketController = require('../controllers/file_bucket.controller');
const emailController = require('../controllers/email.controller')

const router =express.Router()

// router.get('/metrics/userMetrics',userMetricsController.getUserMetrics)
// router.post('/metrics/user-metrics',userMetricsController.createOrUpdateUserMetrics)
router.get('/userMetrics', userMetricsController.getUserMetrics);
router.get('/userMetrics/:id', userMetricsController.getUserMetricById);
router.post('/userMetrics', userMetricsController.createUserMetric);
router.put('/userMetrics/:id', userMetricsController.updateUserMetric);
router.delete('/userMetrics/:id', userMetricsController.deleteUserMetric);
router.delete('/audio-files/:id',activityController.deleteFile)
router.post('/audio-file',activityController.createFileEntry)
router.get('/audio-files',activityController.getAllFiles)
router.put('/audio-files',activityController.updateFile)
router.post('/cloud-postsignedUrl',bucketController.uploadUrl )
router.get('/download-file/:fileId', bucketController.getFileByFileId)
router.get('/generate-presigned-url',bucketController.downloadUrl )
router.post('/send-verification',emailController.sendVerificationEmail)
router.post('/verify',emailController.verifyEmailToken)


module.exports = router