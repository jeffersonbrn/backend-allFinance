module.exports = {
  smtpConf: {
    host: 'smtp.googlemail.com', // Gmail Host
    port: 465, // Port
    secure: true, // this is true as port is 465
    auth: {
      user: process.env.EMAIL, // Gmail username
      pass: process.env.PASSWORD, // Gmail password
    },
  },
  webURL: 'https://localhost:5100/',
};
