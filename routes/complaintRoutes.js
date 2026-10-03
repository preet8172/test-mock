const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require('../controllers/complaintController');

router.post('/', createComplaint);
router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.put('/:id', updateComplaint);
router.patch('/:id/status', updateComplaintStatus);
router.delete('/:id', deleteComplaint);

module.exports = router;