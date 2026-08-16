const { Resend } = require('resend');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { email: cfg } = require('../config/app');

const resend = new Resend(cfg.resendApiKey);
const FROM = `Gainereum <${cfg.fromAddress}>`;

const send = async (to, subject, html) => {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) throw new Error(error.message);
};

const readTemplate = (name) =>
    fs.readFileSync(path.join(__dirname, `../templates/${name}`), 'utf8');

const sendWelcomeMessage = async (email, username) => {
    try {
        const html = readTemplate('welcomeMsgTemplate.html').replace('${username}', username);
        await send(email, 'Welcome to Gainereum!', html);
        return { error: false, message: 'Welcome message sent successfully' };
    } catch (err) {
        return { error: true, message: err.message };
    }
};

const sendDepositMessage = async (email, amount, transactionId, address, depositMethod) => {
    try {
        const formatted = amount.toLocaleString('en-US');
        const html = readTemplate('depositTemplate.html')
            .replace('${amount}', `$${formatted}`)
            .replace('${transactionId}', transactionId)
            .replace('${depositMethod}', depositMethod)
            .replace('${address}', address);
        await send(email, 'Deposit Confirmation', html);
        return { error: false, message: 'Deposit message sent successfully' };
    } catch (err) {
        return { error: true, message: err.message };
    }
};

const sendWithdrawalMessage = async (email, amount, transactionId, address, withdrawalMethod) => {
    try {
        const formatted = amount.toLocaleString('en-US');
        const html = readTemplate('withdrawalTemplate.html')
            .replace('${amount}', `$${formatted}`)
            .replace('${transactionId}', transactionId)
            .replace('${withdrawalMethod}', withdrawalMethod)
            .replace('${address}', address);
        await send(email, 'Withdrawal Confirmation', html);
        return { error: false, message: 'Withdrawal message sent successfully' };
    } catch (err) {
        return { error: true, message: err.message };
    }
};

const sendInvestmentMessage = async (email, amount, transactionId, address, depositMethod, plan, duration) => {
    try {
        const formatted = amount.toLocaleString('en-US');
        const html = readTemplate('investmentTemplate.html')
            .replace('${amount}', `$${formatted}`)
            .replace('${transactionId}', transactionId)
            .replace('${depositMethod}', depositMethod)
            .replace('${address}', address)
            .replace('${plan}', plan)
            .replace('${duration}', duration);
        await send(email, 'Investment Confirmation', html);
        return { error: false, message: 'Investment message sent successfully' };
    } catch (err) {
        return { error: true, message: err.message };
    }
};

const sendPswdResetEmail = async (email, token) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const year = new Date().getFullYear();
    const html = `
        <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
        <style>
            body{font-family:Arial,sans-serif;background:#f4f9fc;text-align:center;padding:20px}
            .container{background:#fff;max-width:500px;margin:auto;padding:30px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,.1)}
            .btn{display:inline-block;background:#0d9488;color:#fff;padding:15px 25px;border-radius:5px;text-decoration:none;font-size:18px;margin-top:20px}
            .footer{margin-top:20px;font-size:14px;color:#888}
        </style></head>
        <body><div class="container">
            <h2>Reset Your Password</h2>
            <p>Click the button below to reset your password.</p>
            <a href="${resetLink}" class="btn">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
            <div class="footer"><p>&copy; ${year} Gainereum. All rights reserved.</p></div>
        </div></body></html>`;
    await send(email, 'Reset Your Password', html);
};

const sendWithdrawalVerificationEmail = async (email, code, username) => {
    try {
        const html = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
                <h2>Withdrawal Verification</h2>
                <p>Hello ${username},</p>
                <p>Your withdrawal verification code is:</p>
                <div style="background:#f4f4f4;padding:20px;text-align:center;font-size:24px;font-weight:bold;margin:20px 0">${code}</div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this withdrawal, please contact support immediately.</p>
            </div>`;
        await send(email, 'Withdrawal Verification Code', html);
        return { error: false, message: 'Verification code sent successfully' };
    } catch (err) {
        return { error: true, message: err.message };
    }
};

const sendTempLoginCode = async (email, code, username) => {
    try {
        const html = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
                <h2>Account Unlock Approved</h2>
                <p>Hello ${username},</p>
                <p>Your account unlock request has been approved. Use this temporary login code:</p>
                <div style="background:#f4f4f4;padding:20px;text-align:center;font-size:24px;font-weight:bold;margin:20px 0">${code}</div>
                <p>This code will expire in 24 hours. Please login and change your password.</p>
            </div>`;
        await send(email, 'Temporary Login Code', html);
        return { error: false, message: 'Temporary login code sent successfully' };
    } catch (err) {
        return { error: true, message: err.message };
    }
};

const sendServiceRequestEmail = async (email, username, serviceType, account, message, requiresPayment, amountRequired, depositMethodName, depositAddress) => {
    const accountLabel = { trading: 'Trading Account', mining: 'Mining Account', general: 'All Accounts' }[account] || account;
    const paymentBlock = requiresPayment ? `
        <div style="background:#fff8e1;border:1px solid #f59e0b;border-radius:8px;padding:16px;margin:16px 0">
            <p style="margin:0 0 8px;font-weight:bold;color:#b45309">💳 Payment Required</p>
            <p style="margin:0 0 4px">Amount: <strong>$${amountRequired?.toLocaleString()}</strong></p>
            ${depositMethodName ? `<p style="margin:0 0 4px">Send via: <strong>${depositMethodName}</strong></p>` : ''}
            ${depositAddress ? `<p style="margin:0;word-break:break-all">Address: <strong style="font-family:monospace">${depositAddress}</strong></p>` : ''}
            <p style="margin:8px 0 0;color:#92400e;font-size:13px">⚠️ Your account activities are paused until payment is confirmed by admin.</p>
        </div>` : `<p style="color:#b45309">⚠️ Your account activities are paused until this is resolved by admin.</p>`;
    try {
        const html = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 8px rgba(0,0,0,.1)">
                <div style="background:#f97316;padding:24px;text-align:center">
                    <h2 style="color:#fff;margin:0">Service Request Activated</h2>
                </div>
                <div style="padding:24px;color:#333">
                    <p>Hello <strong>${username}</strong>,</p>
                    <p>A service request has been raised on your account.</p>
                    <table style="width:100%;border-collapse:collapse;margin:16px 0">
                        <tr style="background:#f9fafb"><td style="padding:10px;font-weight:bold;border:1px solid #e5e7eb">Service Type</td><td style="padding:10px;border:1px solid #e5e7eb">${serviceType}</td></tr>
                        <tr><td style="padding:10px;font-weight:bold;border:1px solid #e5e7eb">Affected Account</td><td style="padding:10px;border:1px solid #e5e7eb">${accountLabel}</td></tr>
                        ${message ? `<tr style="background:#f9fafb"><td style="padding:10px;font-weight:bold;border:1px solid #e5e7eb">Message</td><td style="padding:10px;border:1px solid #e5e7eb">${message}</td></tr>` : ''}
                    </table>
                    ${paymentBlock}
                    <p>If you have questions, contact <a href="mailto:${cfg.fromAddress}">${cfg.fromAddress}</a>.</p>
                    <p>The Gainereum Team</p>
                </div>
                <div style="background:#f4f4f4;text-align:center;padding:12px;font-size:12px;color:#888">&copy; ${new Date().getFullYear()} Gainereum. All rights reserved.</div>
            </div>`;
        await send(email, `⚠️ Service Required: ${serviceType}`, html);
        return { error: false };
    } catch (err) {
        return { error: true, message: err.message };
    }
};

module.exports = {
    sendWelcomeMessage,
    sendDepositMessage,
    sendWithdrawalMessage,
    sendInvestmentMessage,
    sendPswdResetEmail,
    sendWithdrawalVerificationEmail,
    sendTempLoginCode,
    sendServiceRequestEmail,
};
