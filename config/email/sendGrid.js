const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendResetPWEmail(recipient, token) {
  //const mailUrl = `http://localhost:3000/#/user/pw/${token}`;
  const mailUrl = `http://moonblogjs.netlify.app/#/user/pw/${token}`;

  const message = {
    to: recipient,
    from: "cksdnd004@naver.com",
    subject: "Reset your password",
    text: "and easy to do anywhere, even with Node.js",
    html: `Click here to reset your password.  
            <a href='${mailUrl}'>Moon Blog link</a>
            `,
  };
  sgMail.send(message);
}

module.exports = { sendResetPWEmail };
