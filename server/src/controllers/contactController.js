const Contact = require('../models/Contact');
const { sendContactEmail, sendAutoReply } = require('../services/emailService');

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (add auth later)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Save to database
    const contact = new Contact({
      name,
      email,
      message,
    });

    const savedContact = await contact.save();

    // Send emails (don't await to avoid blocking response)
    sendContactEmail({ name, email, message })
      .then(result => {
        if (result.success) {
          console.log('✅ Notification email sent to you');
        } else {
          console.log('❌ Notification email failed:', result.error);
        }
      })
      .catch(err => console.error('Email error:', err));

    sendAutoReply({ name, email, message })
      .then(result => {
        if (result.success) {
          console.log('✅ Auto-reply sent to user');
        } else {
          console.log('❌ Auto-reply failed:', result.error);
        }
      })
      .catch(err => console.error('Auto-reply error:', err));

    res.status(201).json({
      message: 'Thank you for your message! I will get back to you soon.',
      contact: savedContact,
    });
  } catch (error) {
    console.error('Error in createContact:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private
const updateContactStatus = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      contact.status = req.body.status || contact.status;
      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      await contact.deleteOne();
      res.json({ message: 'Contact removed' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getContacts,
  createContact,
  updateContactStatus,
  deleteContact,
};