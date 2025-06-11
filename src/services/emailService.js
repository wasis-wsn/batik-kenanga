import { useSettings } from '@/hooks/useSettings';

/**
 * Email service for sending emails using SMTP settings from database
 */
export class EmailService {
  constructor() {
    this.apiEndpoint = '/api/send-email'; // This would be a backend API endpoint
  }

  /**
   * Send contact form email
   * @param {Object} formData - Contact form data
   * @param {string} formData.name - Sender name
   * @param {string} formData.email - Sender email
   * @param {string} formData.phone - Sender phone
   * @param {string} formData.subject - Email subject
   * @param {string} formData.message - Email message
   * @param {Object} smtpSettings - SMTP configuration
   * @returns {Promise<Object>} - Send result
   */
  async sendContactEmail(formData, smtpSettings) {
    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        throw new Error('Missing required form fields');
      }

      // Validate SMTP settings
      if (!smtpSettings.smtp_host || !smtpSettings.smtp_port || !smtpSettings.smtp_username) {
        throw new Error('SMTP configuration is incomplete. Please check email settings in admin panel.');
      }

      // Prepare email content
      const emailContent = {
        to: smtpSettings.smtp_from_email || 'info@batikenanga.com',
        from: {
          email: smtpSettings.smtp_from_email || 'noreply@batikenanga.com',
          name: smtpSettings.smtp_from_name || 'Batik Kenanga Website'
        },
        replyTo: formData.email,
        subject: `[Contact Form] ${formData.subject}`,
        html: this.generateContactEmailHTML(formData),
        text: this.generateContactEmailText(formData)
      };

      // SMTP configuration
      const smtpConfig = {
        host: smtpSettings.smtp_host,
        port: parseInt(smtpSettings.smtp_port) || 587,
        secure: parseInt(smtpSettings.smtp_port) === 465, // true for 465, false for other ports
        auth: {
          user: smtpSettings.smtp_username,
          pass: smtpSettings.smtp_password
        }
      };

      // For now, simulate email sending since we don't have a backend
      // In a real implementation, this would call a backend API
      const result = await this.simulateEmailSend(emailContent, smtpConfig);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully'
      };

    } catch (error) {
      console.error('Email send error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send email'
      };
    }
  }

  /**
   * Generate HTML email content for contact form
   */
  generateContactEmailHTML(formData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Contact Form - ${formData.subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #fff; padding: 20px; border: 1px solid #dee2e6; }
          .footer { background-color: #f8f9fa; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; color: #6c757d; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #495057; }
          .value { margin-top: 5px; }
          .message-box { background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0; color: #343a40;">New Contact Form Submission</h2>
            <p style="margin: 5px 0 0 0; color: #6c757d;">From Batik Kenanga Website</p>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${formData.name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
            </div>
            
            ${formData.phone ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${formData.phone}</div>
              </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${formData.subject}</div>
            </div>
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="message-box">${formData.message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent from the contact form on the Batik Kenanga website.</p>
            <p>Received on: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate plain text email content for contact form
   */
  generateContactEmailText(formData) {
    return `
New Contact Form Submission - Batik Kenanga Website

Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
Subject: ${formData.subject}

Message:
${formData.message}

---
This email was sent from the contact form on the Batik Kenanga website.
Received on: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB
    `.trim();
  }

  /**
   * Simulate email sending (for development without backend)
   * In production, this would be replaced with actual API call
   */  async simulateEmailSend(emailContent, smtpConfig) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Email simulation - in production this would actually send
    
    // Simulate successful send
    return {
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      response: 'Email simulation successful'
    };
  }

  /**
   * Send auto-reply email to contact form submitter
   */
  async sendAutoReply(formData, smtpSettings) {
    try {
      const emailContent = {
        to: formData.email,
        from: {
          email: smtpSettings.smtp_from_email || 'noreply@batikenanga.com',
          name: smtpSettings.smtp_from_name || 'Batik Kenanga'
        },
        subject: 'Terima kasih telah menghubungi Batik Kenanga',
        html: this.generateAutoReplyHTML(formData),
        text: this.generateAutoReplyText(formData)
      };

      const smtpConfig = {
        host: smtpSettings.smtp_host,
        port: parseInt(smtpSettings.smtp_port) || 587,
        secure: parseInt(smtpSettings.smtp_port) === 465,
        auth: {
          user: smtpSettings.smtp_username,
          pass: smtpSettings.smtp_password
        }
      };

      const result = await this.simulateEmailSend(emailContent, smtpConfig);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Auto-reply sent successfully'
      };

    } catch (error) {
      console.error('Auto-reply send error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send auto-reply'
      };
    }
  }

  /**
   * Generate HTML auto-reply email
   */
  generateAutoReplyHTML(formData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Terima kasih - Batik Kenanga</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #fff; padding: 30px; border: 1px solid #dee2e6; }
          .footer { background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px; color: #6c757d; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .highlight { background-color: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌺 Batik Kenanga</div>
            <h2 style="margin: 0;">Terima kasih telah menghubungi kami!</h2>
          </div>
          
          <div class="content">
            <p>Halo <strong>${formData.name}</strong>,</p>
            
            <p>Terima kasih telah mengirimkan pesan kepada kami melalui website Batik Kenanga. Kami telah menerima pesan Anda dengan detail sebagai berikut:</p>
            
            <div class="highlight">
              <strong>Subjek:</strong> ${formData.subject}<br>
              <strong>Diterima pada:</strong> ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB
            </div>
            
            <p>Tim customer service kami akan merespons pesan Anda dalam waktu 1x24 jam pada hari kerja. Jika pesan Anda bersifat urgent, Anda dapat menghubungi kami langsung melalui:</p>
            
            <ul>
              <li><strong>WhatsApp:</strong> +62 812 9876 5432</li>
              <li><strong>Telepon:</strong> +62 812 9876 5432</li>
              <li><strong>Email:</strong> info@batikenanga.com</li>
            </ul>
            
            <p>Sementara menunggu respons dari kami, jangan ragu untuk menjelajahi koleksi batik eksklusif kami di website atau mengunjungi toko fisik kami.</p>
            
            <p>Terima kasih atas kepercayaan Anda kepada Batik Kenanga.</p>
            
            <p>Salam hangat,<br>
            <strong>Tim Batik Kenanga</strong></p>
          </div>
          
          <div class="footer">
            <p><strong>Batik Kenanga</strong> - Identitas Batik Indonesia</p>
            <p>Website: www.batikenanga.com | Email: info@batikenanga.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate plain text auto-reply email
   */
  generateAutoReplyText(formData) {
    return `
Terima kasih telah menghubungi Batik Kenanga!

Halo ${formData.name},

Terima kasih telah mengirimkan pesan kepada kami melalui website Batik Kenanga. Kami telah menerima pesan Anda dengan detail sebagai berikut:

Subjek: ${formData.subject}
Diterima pada: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB

Tim customer service kami akan merespons pesan Anda dalam waktu 1x24 jam pada hari kerja. Jika pesan Anda bersifat urgent, Anda dapat menghubungi kami langsung melalui:

• WhatsApp: +62 812 9876 5432
• Telepon: +62 812 9876 5432
• Email: info@batikenanga.com

Sementara menunggu respons dari kami, jangan ragu untuk menjelajahi koleksi batik eksklusif kami di website atau mengunjungi toko fisik kami.

Terima kasih atas kepercayaan Anda kepada Batik Kenanga.

Salam hangat,
Tim Batik Kenanga

---
Batik Kenanga - Identitas Batik Indonesia
Website: www.batikenanga.com | Email: info@batikenanga.com
    `.trim();
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Hook for using email service with settings
export const useEmailService = () => {
  const { getSetting } = useSettings();
  
  const sendContactEmail = async (formData) => {
    const smtpSettings = {
      smtp_host: getSetting('smtp_host'),
      smtp_port: getSetting('smtp_port', '587'),
      smtp_username: getSetting('smtp_username'),
      smtp_password: getSetting('smtp_password'),
      smtp_from_name: getSetting('smtp_from_name', 'Batik Kenanga'),
      smtp_from_email: getSetting('smtp_from_email', 'noreply@batikenanga.com'),
      enable_email_notifications: getSetting('enable_email_notifications', true)
    };

    if (!smtpSettings.enable_email_notifications) {
      return {
        success: false,
        error: 'Email notifications are disabled',
        message: 'Email sending is currently disabled in settings'
      };
    }

    // Send main contact email
    const contactResult = await emailService.sendContactEmail(formData, smtpSettings);
    
    // Send auto-reply if main email was successful
    if (contactResult.success) {
      await emailService.sendAutoReply(formData, smtpSettings);
    }
    
    return contactResult;
  };

  return {
    sendContactEmail,
    emailService
  };
};
