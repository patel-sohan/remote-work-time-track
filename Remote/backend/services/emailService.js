const nodemailer = require("nodemailer");

/**
 * Modern Email Service for Team Tracker
 * Simple, reliable, and easy to configure
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.emailProvider = "test"; // 'gmail', 'outlook', 'yahoo', 'test'
    this.setupEmailService();
  }

  /**
   * Setup email service with multiple provider support
   */
  async setupEmailService() {
    try {
      console.log("📧 Setting up Email Service...");

      // Try different email providers in order of preference
      const providers = [
        { name: "gmail", method: this.setupGmail.bind(this) },
        { name: "outlook", method: this.setupOutlook.bind(this) },
        { name: "yahoo", method: this.setupYahoo.bind(this) },
        { name: "test", method: this.setupTestEmail.bind(this) },
      ];

      for (const provider of providers) {
        try {
          console.log(`🔧 Trying ${provider.name} configuration...`);
          await provider.method();

          if (this.transporter) {
            this.emailProvider = provider.name;
            this.isConfigured = true;
            console.log(`✅ Email service configured with ${provider.name}`);
            return;
          }
        } catch (error) {
          console.log(`❌ ${provider.name} failed: ${error.message}`);
          continue;
        }
      }

      console.log("⚠️ No email provider configured, using test mode");
    } catch (error) {
      console.error("❌ Email service setup failed:", error.message);
      await this.setupTestEmail();
    }
  }

  /**
   * Setup Gmail (if credentials provided)
   */
  async setupGmail() {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      throw new Error("Gmail credentials not provided");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.verify();
    this.transporter = transporter;
    console.log("✅ Gmail SMTP configured successfully");
  }

  /**
   * Setup Outlook/Hotmail
   */
  async setupOutlook() {
    if (!process.env.OUTLOOK_USER || !process.env.OUTLOOK_PASS) {
      throw new Error("Outlook credentials not provided");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASS,
      },
    });

    await transporter.verify();
    this.transporter = transporter;
    console.log("✅ Outlook SMTP configured successfully");
  }

  /**
   * Setup Yahoo Mail
   */
  async setupYahoo() {
    if (!process.env.YAHOO_USER || !process.env.YAHOO_PASS) {
      throw new Error("Yahoo credentials not provided");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.YAHOO_USER,
        pass: process.env.YAHOO_PASS,
      },
    });

    await transporter.verify();
    this.transporter = transporter;
    console.log("✅ Yahoo SMTP configured successfully");
  }

  /**
   * Setup test email service (always works)
   */
  async setupTestEmail() {
    console.log("📧 Setting up test email service...");

    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    this.emailProvider = "test";
    this.isConfigured = true;
    console.log("✅ Test email service configured");
    console.log("📧 Test emails will be available at: https://ethereal.email");
  }

  /**
   * Send email with modern template
   */
  async sendEmail(to, subject, htmlContent, options = {}) {
    try {
      if (!this.transporter) {
        throw new Error("Email service not configured");
      }

      const fromEmail = this.getFromEmail();

      const mailOptions = {
        from: `"Team Tracker" <${fromEmail}>`,
        to: to,
        subject: subject,
        html: this.wrapInTemplate(htmlContent, subject),
        ...options,
      };

      const result = await this.transporter.sendMail(mailOptions);

      // For test emails, provide preview URL
      if (this.emailProvider === "test") {
        const previewUrl = nodemailer.getTestMessageUrl(result);
        console.log(`📧 Test email sent! Preview: ${previewUrl}`);

        return {
          success: true,
          messageId: result.messageId,
          previewUrl: previewUrl,
          provider: this.emailProvider,
        };
      }

      console.log(`📧 Email sent successfully via ${this.emailProvider}`);
      return {
        success: true,
        messageId: result.messageId,
        provider: this.emailProvider,
      };
    } catch (error) {
      console.error("❌ Email sending failed:", error.message);
      return {
        success: false,
        error: error.message,
        provider: this.emailProvider,
      };
    }
  }

  /**
   * Get appropriate from email based on provider
   */
  getFromEmail() {
    switch (this.emailProvider) {
      case "gmail":
        return process.env.GMAIL_USER || process.env.FROM_EMAIL;
      case "outlook":
        return process.env.OUTLOOK_USER || process.env.FROM_EMAIL;
      case "yahoo":
        return process.env.YAHOO_USER || process.env.FROM_EMAIL;
      default:
        return "noreply@teamtracker.com";
    }
  }

  /**
   * Wrap content in professional email template
   */
  wrapInTemplate(content, subject) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 30px; line-height: 1.6; color: #333; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 15px 0; }
          .button:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Team Tracker</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>This email was sent by Team Tracker - Your Productivity Companion</p>
            <p>© ${new Date().getFullYear()} Team Tracker. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(userEmail, userName, tempPassword) {
    const subject = "Welcome to Team Tracker! 🎉";
    const content = `
      <h2>Welcome to Team Tracker, ${userName}! 🎉</h2>
      <p>Your account has been created successfully. Here are your login credentials:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Temporary Password:</strong> <code style="background-color: #e9ecef; padding: 4px 8px; border-radius: 4px;">${tempPassword}</code></p>
      </div>
      
      <p>For security reasons, please change your password after your first login.</p>
      
      <a href="${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }" class="button">
        Login to Team Tracker
      </a>
      
      <h3>Getting Started:</h3>
      <ul>
        <li>📊 Track your productivity with our AI-powered insights</li>
        <li>⏰ Use the Pomodoro timer for focused work sessions</li>
        <li>📋 Manage your tasks efficiently</li>
        <li>📸 Monitor your activity with screenshots</li>
      </ul>
      
      <p>If you have any questions, feel free to reach out to your team manager.</p>
      
      <p>Happy tracking! 🚀</p>
    `;

    return await this.sendEmail(userEmail, subject, content);
  }

  /**
   * Send manager notification email
   */
  async sendManagerNotification(managerEmail, memberName, memberEmail, action) {
    const subject = `Team Update: ${memberName} ${action}`;
    const content = `
      <h2>Team Member ${action} 👥</h2>
      <p>A team member has ${action.toLowerCase()} Team Tracker:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${memberName}</p>
        <p><strong>Email:</strong> ${memberEmail}</p>
        <p><strong>Action:</strong> ${action}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <a href="${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/manager" class="button">
        View Team Dashboard
      </a>
      
      <p>You can manage team members from your manager dashboard.</p>
    `;

    return await this.sendEmail(managerEmail, subject, content);
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      configured: this.isConfigured,
      provider: this.emailProvider,
      ready: !!this.transporter,
    };
  }
}

// Export singleton instance
const emailService = new EmailService();
module.exports = emailService;
