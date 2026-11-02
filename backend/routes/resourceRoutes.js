const express = require('express');
const router = express.Router();
const { getResources, createResource, allocateResource, terminateAllocation, deleteResource } = require('../controllers/resourceController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getResources)
  .post(protect, admin, createResource);

router.post('/allocate', protect, allocateResource);

router.patch('/allocations/:allocationId/terminate', protect, terminateAllocation);

router.delete('/:id', protect, admin, deleteResource);

module.exports = router;
