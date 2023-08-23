const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASS,
    }
});

const mailOptions = async (userEmail, hashData = 0,link=0) => {
    if ((hashData,link)) {
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: userEmail,
            subject: "Reset password",
            html: `<a href=${link}>Click for rest your password`
        });
    } else {
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: userEmail,
            subject: "Blog created 😁",
            html: `Hey, your blog was created`
        });
    }
}

module.exports = {
    mailOptions
}