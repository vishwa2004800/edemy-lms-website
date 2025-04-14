import nodemailer from 'nodemailer'

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred SMTP service
    auth: {
      user: 'vishwajp0125@gmail.com',
      pass: 'vparmarj01',
    },
  })

  const mailOptions = {
    from: `"Study Planner" <vishwajp0125@gmail.com>`,
    to,
    subject,
    text,
    html,
  }

  await transporter.sendMail(mailOptions)
}

export default sendEmail
