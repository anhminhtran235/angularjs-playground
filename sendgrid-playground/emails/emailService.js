const sgMail = require('@sendgrid/mail');

const sendgridAPIKey =
  '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';

sgMail.setApiKey(sendgridAPIKey);

const sendEmail = (to, cb, err) => {
  sgMail.send(
    {
      to,
      from: 'anhminhtran235@gmail.com',
      subject: 'My sendgrid email',
      text: 'Do you see my email? Click here: http://google.com',
    },
    (error, res) => {
      if (error) {
        err(error);
      } else if (res) {
        cb(res);
      }
    }
  );
}

module.exports = {sendEmail};


