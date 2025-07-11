import axios from "axios";

// email template function
const createGreetingEmail = (fullname) => {
  return {
    text: `
Hi ${fullname}!

Thank you for joining the Panha waitlist. We’re truly happy to have you with us.

You're now part of a growing community that believes in safety, empathy, and emotional support.

👉 Join our WhatsApp Community: https://chat.whatsapp.com/BLikt4WP0yt2AG1paLIRFA

Feel free to reply to this email if you'd like to share anything. We're here to listen.

Warm regards,
Team Panha
www.Panhacare.com
    `,

    html: `
<p>Hi ${fullname},</p>
<h2 style="color: #E91E63;">Welcome to Panha!</h2>

<p>Thank you for joining the Panha waitlist. We’re truly happy to have you with us.</p>
<p>You're now part of a growing community that believes in safety, empathy, and emotional support.</p>

<p><strong>👉 Join our WhatsApp Community:</strong><br>
<a href="https://chat.whatsapp.com/BLikt4WP0yt2AG1paLIRFA" style="color: #1E88E5;">https://chat.whatsapp.com/BLikt4WP0yt2AG1paLIRFA</a></p>

<p>If you ever wish to share something or have questions, just reply to this email — we’re always here to listen.</p>

<p style="margin-top: 30px;">Warm regards,<br>
<strong>Team Panha</strong><br>
<a href="https://www.Panhacare.com" style="color: #1E88E5;">www.Panhacare.com</a></p>
    `.trim(),
  };
};

// function to send mail to users
export const sendMail = async (fullname, email) => {
  try {
    // Create the email content
    const emailContent = createGreetingEmail(fullname);

    // Prepare the email data for Brevo API
    const emailData = {
      subject: `Hi ${fullname}, welcome to Panha!`,
      htmlContent: emailContent.html,
      textContent: emailContent.text,
      sender: {
        name: process.env.SENDER_NAME,
        email: process.env.SENDER_EMAIL,
      },
      to: [
        {
          email: email,
          name: fullname,
        },
      ],
      replyTo: {
        email: process.env.REPLY_TO_EMAIL || process.env.SENDER_EMAIL,
        name: process.env.SENDER_NAME,
      },
    };

    // Axios configuration for Brevo API
    const options = {
      method: "POST",
      url: "https://api.brevo.com/v3/smtp/email",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      data: emailData,
    };

    // Send email using axios
    const response = await axios.request(options);

    return {
      success: true,
      status: 200,
      message: "Welcome email sent successfully to the user.",
      recipient: email,
      messageId: response.data.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error.message);

    // Handle specific axios/Brevo errors
    if (error.response) {
      console.error("Brevo API Error:", error.response.data);
    }
    return {
      success: false,
      status: 501,
      message: "Failed to send welcome email.",
      error: error.message,
    };
  }
};
