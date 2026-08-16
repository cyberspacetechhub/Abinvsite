const { Resend } = require('resend');
const { email: emailConfig } = require('../config/app');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const resend = new Resend(emailConfig.resendApiKey);

// ── Received emails ───────────────────────────────────────────────────────────

const listEmails = asyncHandler(async (req, res) => {
  const { data, error } = await resend.emails.receiving.list();
  if (error) throw new AppError(error.message || 'Failed to fetch inbox', 502);
  res.json({ success: true, data: data?.data || [] });
});

const getEmail = asyncHandler(async (req, res) => {
  const { data, error } = await resend.emails.receiving.get(req.params.id);
  if (error) throw new AppError(error.message || 'Email not found', 404);
  res.json({ success: true, data });
});

const deleteEmail = asyncHandler(async (req, res) => {
  const apiRes = await fetch(`https://api.resend.com/emails/receiving/${req.params.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${emailConfig.resendApiKey}` },
  });
  if (!apiRes.ok) {
    const body = await apiRes.json().catch(() => ({}));
    throw new AppError(body?.message || 'Failed to delete email', apiRes.status);
  }
  res.json({ success: true, message: 'Email deleted.' });
});

// ── Received email attachments ────────────────────────────────────────────────

const listReceivedAttachments = asyncHandler(async (req, res) => {
  const { data, error } = await resend.attachments.receiving.list({ emailId: req.params.emailId });
  if (error) throw new AppError(error.message || 'Failed to fetch attachments', 502);
  res.json({ success: true, data: data?.data || [] });
});

const getReceivedAttachment = asyncHandler(async (req, res) => {
  const { data, error } = await resend.attachments.receiving.get({
    id:      req.params.id,
    emailId: req.params.emailId,
  });
  if (error) throw new AppError(error.message || 'Attachment not found', 404);
  res.json({ success: true, data });
});

// ── Sent emails ───────────────────────────────────────────────────────────────

const listSentEmails = asyncHandler(async (req, res) => {
  const { data, error } = await resend.emails.list();
  if (error) throw new AppError(error.message || 'Failed to fetch sent emails', 502);
  res.json({ success: true, data: data?.data || [] });
});

const getSentEmail = asyncHandler(async (req, res) => {
  const { data, error } = await resend.emails.get(req.params.id);
  if (error) throw new AppError(error.message || 'Sent email not found', 404);
  res.json({ success: true, data });
});

// ── Sent email attachments ────────────────────────────────────────────────────

const listSentAttachments = asyncHandler(async (req, res) => {
  const { data, error } = await resend.emails.attachments.list({ emailId: req.params.emailId });
  if (error) throw new AppError(error.message || 'Failed to fetch attachments', 502);
  res.json({ success: true, data: data?.data || [] });
});

const getSentAttachment = asyncHandler(async (req, res) => {
  const { data, error } = await resend.emails.attachments.get({
    id:      req.params.id,
    emailId: req.params.emailId,
  });
  if (error) throw new AppError(error.message || 'Attachment not found', 404);
  res.json({ success: true, data });
});

// ── Compose / send ────────────────────────────────────────────────────────────

const sendEmail = asyncHandler(async (req, res) => {
  const { from, to, subject, html, text } = req.body;
  if (!from || !to || !subject) throw new AppError('from, to, and subject are required', 400);
  if (!html && !text) throw new AppError('html or text body is required', 400);

  const { data, error } = await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    ...(html ? { html } : { text }),
  });

  if (error) throw new AppError(error.message || 'Failed to send email', 502);
  res.json({ success: true, data });
});

module.exports = {
  listEmails, getEmail, deleteEmail,
  listReceivedAttachments, getReceivedAttachment,
  listSentEmails, getSentEmail,
  listSentAttachments, getSentAttachment,
  sendEmail,
};
