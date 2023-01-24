const mailer = require("nodemailer");
const HOST = process.env.SMTP_HOST_URL;
const PORT = process.env.SMTP_PORT;
const USER = process.env.MAIL_USER;
const PASSWORD = process.env.MAIL_PASSWORD;

const sendEmail = async ({ from, to, subject, text, html }) => {
  try {
    let transporter = mailer.createTransport({
      host: HOST,
      port: PORT,
      secure: false,
      auth: {
        user: USER,
        pass: PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: `CloudShare <${from}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail };
