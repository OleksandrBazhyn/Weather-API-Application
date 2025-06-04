import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'olexandrbazhyn@gmail.com',
    pass: 'yszlkuxgrouqyrjm'
  }
});

transporter.sendMail({
  from: '"Test" <olexandrbazhyn@gmail.com>',
  to: 'olexandrbazhyn@gmail.com',
  subject: 'Test email',
  text: 'Hello from Node.js!'
}, (err, info) => {
  if (err) return console.error('Mail error:', err);
  console.log('Mail sent:', info.response);
});
