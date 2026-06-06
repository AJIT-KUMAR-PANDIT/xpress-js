/**
 * src/jobs/email.job.js
 * ===================================================================
 * Email job module — handles all outbound email for the xpress-js framework.
 * Uses Nodemailer as the transport layer.
 *
 * In production, replace this with a job queue (BullMQ + Redis / Agenda)
 * to process emails asynchronously and avoid blocking request cycles.
 * ===================================================================
 */

const nodemailer = require('nodemailer');
const { getConfig } = require('../config/env');

let _transporter = null;

/**
 * Initialize Nodemailer transporter once at startup.
 */
const initEmailer = () => {
  const config = getConfig();
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  // Verify connection on startup (dev only)
  if (config.isDev) {
    _transporter.verify((error, success) => {
      if (error) {
        console.warn('[email] SMTP verification failed:', error.message);
      } else {
        console.log('[email] SMTP connected successfully');
      }
    });
  }

  return _transporter;
};

/**
 * Send an email.
 * @param {Object} options
 * @param {string} to        - recipient(s)
 * @param {string} subject   - email subject
 * @param {string} html      - HTML body content
 * @param {string} [text]    - plain-text fallback
 * @returns {Promise<info>}  - Nodemailer info object
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const config = getConfig();
  const transporter = initEmailer();

  const mailOptions = {
    from: `"${config.email.from?.split('@')[0] || 'xpress-js'}" <${config.email.user}>`,
    to,
    subject,
    html,
    text: text || html?.replace(/<[^>]*>/g, '') || null, // strip HTML tags as fallback
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[email] Message sent: ${info.messageId} to ${to}`);
  return info;
};

/**
 * Send a verification email with inline button.
 */
const sendVerificationEmail = async (email, token) => {
  const config = getConfig();
  const verifyLink = `${config.corsOrigin}/auth/verify-email/${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: system-ui, sans-serif; background: #f3f4f6; padding: 40px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,.06);">
        <h2 style="color: #6C5CE7; margin-top: 0;">Verify Your Email</h2>
        <p>Thanks for signing up! Click the button below to verify your email address.</p>
        <a href="${verifyLink}"
           style="display: inline-block; padding: 12px 32px; background: #6C5CE7; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #9ca3af; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject: 'Verify your email address', html });
};

/**
 * Send a password-reset email.
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  const config = getConfig();
  const resetLink = `${config.corsOrigin}/auth/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: system-ui, sans-serif; background: #f3f4f6; padding: 40px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,.06);">
        <h2 style="color: #e17055; margin-top: 0;">Reset Your Password</h2>
        <p>We received a request to reset your password. Click below to set a new one.</p>
        <a href="${resetLink}"
           style="display: inline-block; padding: 12px 32px; background: #e17055; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #9ca3af; font-size: 12px;">This link expires in 1 hour.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject: 'Reset your password', html });
};

module.exports = { initEmailer, sendEmail, sendVerificationEmail, sendPasswordResetEmail };
