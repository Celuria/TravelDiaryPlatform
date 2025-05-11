const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { getTravels, updateStatus } = require('../controllers/travelController');

router.get('/', authenticate, getTravels);
router.patch(
  '/:id/status',
  authenticate,
  authorize(['admin', 'reviewer']),
  updateStatus
);

module.exports = router;