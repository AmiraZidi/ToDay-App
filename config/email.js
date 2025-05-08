const nodemailer = require("nodemailer");
// require("dotenv").config();

// transporter is for sending emails
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "amira.lachaal55@gmail.com",
    pass: "lsek sozb edna cekd",
  },
});

// Function to send reminder email
const sendReminderEmail = async (to, taskTitle, dueDate) => {
  const mailOptions = {
    from: '"Task Manager" <your-email@gmail.com>',
    to,
    subject: `Reminder: "${taskTitle}" is due soon`,
    html: `
        <p>Hello,</p>
        <p>This is a reminder that the task <strong>${taskTitle}</strong> is due on 
        <strong>${new Date(dueDate).toLocaleString()}</strong>.</p>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
};

module.exports = transporter;
