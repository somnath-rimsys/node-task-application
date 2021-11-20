const sgMail = require("@sendgrid/mail");
const sendGridApiKey = process.env.SENDGRID_EMAIL_API_KEY;
sgMail.setApiKey(sendGridApiKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "somnath.project.test@gmail.com",
    subject: "Welcome onboard",
    text: `Welcome ${name}. Hope you like our platform.`,
  });
};

const sendAccountCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "somnath.project.test@gmail.com",
    subject: "Account deleted",
    text: `Sorry ${name}. Hope to seee you soon.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendAccountCancelEmail,
};
