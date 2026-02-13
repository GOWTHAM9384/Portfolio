const brevo = require('@getbrevo/brevo');

const sendContactEmail = async (contactData) => {
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    
    // Set API key
    apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    // Email to you (notification)
    sendSmtpEmail.subject = `New Contact Form Submission from ${contactData.name}`;
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #000; }
          .value { color: #555; margin-top: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From:</div>
              <div class="value">${contactData.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${contactData.email}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${contactData.message}</div>
            </div>
            <div class="field">
              <div class="label">Submitted At:</div>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
          </div>
          <div class="footer">
            <p>This email was sent from your portfolio contact form</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // IMPORTANT: Use the verified email from Brevo
    sendSmtpEmail.sender = { 
      name: "Portfolio Contact Form", 
      email: "gowthamaravinth00@gmail.com"  // Must be verified in Brevo
    };
    
    sendSmtpEmail.to = [
      { email: "gowthamaravinth00@gmail.com", name: "Gowtham" }
    ];
    
    sendSmtpEmail.replyTo = { 
      email: contactData.email, 
      name: contactData.name 
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', result);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error.response?.body || error.message);
    return { success: false, error: error.message };
  }
};

// Optional: Send auto-reply to the person who contacted you
const sendAutoReply = async (contactData) => {
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Thank you for contacting me!";
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Thanks for reaching out!</h2>
          </div>
          <div class="content">
            <p>Hi ${contactData.name},</p>
            <p>Thank you for contacting me! I've received your message and will get back to you as soon as possible.</p>
            <p><strong>Your message:</strong></p>
            <p style="background-color: #fff; padding: 15px; border-left: 4px solid #000;">${contactData.message}</p>
            <p>Best regards,<br>Gowtham</p>
          </div>
          <div class="footer">
            <p>This is an automated response from gowthamaravinth00@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // IMPORTANT: Use the verified email from Brevo
    sendSmtpEmail.sender = { 
      name: "Gowtham", 
      email: "gowthamaravinth00@gmail.com"  // Must be verified in Brevo
    };
    
    sendSmtpEmail.to = [
      { email: contactData.email, name: contactData.name }
    ];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Auto-reply sent successfully:', result);
    return { success: true };
  } catch (error) {
    console.error('Error sending auto-reply:', error.response?.body || error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactEmail,
  sendAutoReply,
};