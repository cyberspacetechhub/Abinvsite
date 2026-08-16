module.exports = {
  email: {
    resendApiKey: process.env.RESEND_API_KEY,
    fromAddress:  process.env.EMAIL_USER || 'support@stockexchangemining.com',
  },
};
