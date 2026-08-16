const express = require('express');
const router = express.Router();
const c = require('../controllers/resendController');

// Compose / send
router.post('/send', c.sendEmail);

// Received inbox
router.get('/inbox', c.listEmails);
router.get('/inbox/:id', c.getEmail);
router.delete('/inbox/:id', c.deleteEmail);

// Received attachments
router.get('/inbox/:emailId/attachments', c.listReceivedAttachments);
router.get('/inbox/:emailId/attachments/:id', c.getReceivedAttachment);

// Sent
router.get('/sent', c.listSentEmails);
router.get('/sent/:id', c.getSentEmail);

// Sent attachments
router.get('/sent/:emailId/attachments', c.listSentAttachments);
router.get('/sent/:emailId/attachments/:id', c.getSentAttachment);

module.exports = router;
