const express = require('express');
const router = express.Router();
const {
  getContacts,
  createContact,
  updateContactStatus,
  deleteContact,
} = require('../controllers/contactController');

// Public route - POST to create contact
// Private route - GET to view all contacts (add auth middleware later)
router.route('/').get(getContacts).post(createContact);

// Private routes - update and delete contacts (add auth middleware later)
router.route('/:id').put(updateContactStatus).delete(deleteContact);

module.exports = router;