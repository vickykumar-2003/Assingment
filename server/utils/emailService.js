const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    auth: {
        user: process.env.EMAIL_USER || 'sample@ethereal.email',
        pass: process.env.EMAIL_PASS || 'password'
    }
});

const sendWelcomeEmail = async (email, username) => {
    try {
        await transporter.sendMail({
            from: '"Golf Charity" <no-reply@golfcharity.com>',
            to: email,
            subject: "Welcome to Golf Charity Platform! ⛳️",
            text: `Hi ${username}, welcome to the club! Start managing your scores and supporting causes now.`,
            html: `<b>Hi ${username}</b>, <p>Welcome to the club! Start managing your scores and supporting causes now.</p>`
        });
        console.log('Welcome email sent to', email);
    } catch (error) {
        console.error('Email error:', error);
    }
};

const sendDrawResultEmail = async (email, winningNumbers) => {
    try {
        await transporter.sendMail({
            from: '"Golf Charity" <no-reply@golfcharity.com>',
            to: email,
            subject: "Monthly Draw Results are Out! 🏆",
            text: `The winning numbers are: ${winningNumbers.join(', ')}. Check your dashboard to see if you won!`,
            html: `<p>The winning numbers are: <b>${winningNumbers.join(', ')}</b>.</p><p>Check your dashboard to see if you won!</p>`
        });
    } catch (error) {
        console.error('Email error:', error);
    }
};

module.exports = { sendWelcomeEmail, sendDrawResultEmail };
