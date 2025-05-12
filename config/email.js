const nodemailer = require("nodemailer");
// require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "amira.lachaal55@gmail.com",
    pass: "lsek sozb edna cekd",
  },
});

module.exports = transporter;
