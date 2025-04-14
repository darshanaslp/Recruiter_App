const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

exports.sendInterviewEmail = async (to, name, interviewDetails) => {
  const { date, meetingLink } = interviewDetails;
  const mailOptions = {
    from: config.email.user,
    to,
    subject: 'Interview Scheduled',
    html: `<p>Dear ${name},</p>
           <p>Your interview is scheduled on ${date}.</p>
           <p>Join your interview using this link: <a href="${meetingLink}">Join Interview</a></p>
           <p>Best regards,<br>Recruitment Team</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Error sending email', err);
  }
};
