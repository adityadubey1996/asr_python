const nodemailer = require('nodemailer');
const db = require("../models");
const crypto = require('crypto');
// Transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'adityadubey1966@gmail.com',
        pass: 'AdityaAtrayee2013@'
    }
});

// Send verification email
const sendVerificationEmail = async (req, res) => {
    const email = req.user.email; // Assuming email is available from req.user

    if (!email) {
        return res.status(400).send({ message: 'Email is required' });
    }

    // Generate a token
    const token = crypto.randomBytes(20).toString('hex');
    try {
        // Store the token in the database
        const user = await db.users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        user.emailConfirmationToken = token;
        await user.save();

        const mailOptions = {
            from: 'adityadubey1966@gmail.com', // Replace with your actual email
            to: email,
            subject: 'Verify Your Account',
            text: `Please click on the following link, or paste this into your browser to complete the process: http://your-domain.com/verify?token=${token}`
        };

        await transporter.sendMail(mailOptions);
        res.send({ message: 'Verification link sent successfully!' });
    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).send({ message: 'Failed to send verification link' });
    }
};

// Verify email token
const verifyEmailToken = async (req, res) => {
    const { token } = req.query;
console.log('req.query', req.query)
    try {
   
        return res.send({ message: 'Email verified successfully' });

        const user = await db.users.findOne({
            where: { emailConfirmationToken: token }
        });

        if (!user) {
            return res.status(400).send({ message: 'Invalid or expired token' });
        }

        user.isEmailConfirmed = true;
        user.emailConfirmationToken = null; // Clear the token
        await user.save();

        // res.send({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).send({ message: 'Error verifying email' });
    }
};

module.exports = {
    verifyEmailToken,
    sendVerificationEmail
}