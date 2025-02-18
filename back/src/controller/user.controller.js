const Users = require('../model/usersSchema.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require('nodemailer');

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "purvagalani@gmail.com",
        pass: "tefl tsvl dxuo toch",
    },
});

// Register a new user
const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    try {
        const exists = await Users.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User Already Exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter a valid Email" });
        }

        // Strong password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = Date.now() + 3600000; // 1 hour

        const user = new Users({ name, email, password: hashedPassword, verificationCode, verificationCodeExpires });
        await user.save();

        await sendVerificationCode(email, verificationCode);

        res.json({ success: true, message: 'Registration successful. Please verify your email.' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Step 1: Check if the user exists in the database
        const user = await Users.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        // Step 2: Check if the user's email is verified
        if (!user.isVerified) {
            return res.json({ success: false, message: "Please verify your email to log in." });
        }

        // Step 3: Verify the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        // Check if it's the user's first login
        const isFirstLogin = user.isFirstLogin; // This flag should be part of your user schema

        // If it's the first login, set the flag to false after login
        if (isFirstLogin) {
            user.isFirstLogin = false;
            await user.save(); // Save updated user status
        }

        // Step 4: Generate a new token
        const newToken = createToken(user._id);

        // Step 5: Return response with success, isFirstLogin, and the token
        return res.json({
            success: true,
            isFirstLogin,
            message: "Login successful",
            token: newToken,
            email:user.email,
            userId:user._id,
            redirectTo: isFirstLogin ? "/Profile" : "/Dashboard"  // Return the page to redirect to
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};



// Forgot Password Functionality
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const token = createToken(user._id, { expiresIn: '1h' });

        // Save the token and expiration to the user object
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();

        // Construct the reset URL
        const resetLink = `http://localhost:3000/Resetpassword/${token}`;

        // Send email to the user
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Reset Password",
            html: `
                <h4>Hi ${user.name},</h4>
                <p>You are receiving this because you (or someone else) requested the reset of your crm user account. Select the button below to reset your password.This link will expire in 1 hour.</p>
                <p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
                <p>If you did not request a password reset, you can safely ignore this. If you have questions, please reach out to us at crm team support.</p>
                <p>Thanks,<br>The crm team</p>
            `,
        });

        res.json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Reset Password Functionality
const resetPassword = async (req, res) => {
    const token = req.params.token;
    const { password } = req.body; // New password from the request body

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user based on the decoded token
        const user = await Users.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const verifyEmail = async (req, res) => {
    const { verificationCode } = req.body;

    try {
        const user = await Users.findOne({ verificationCode });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        // Check if the verification code has expired
        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
        }

        user.isVerified = true;
        user.verificationCode = null; // Clear the code
        user.verificationCodeExpires = null; // Clear the expiration time
        await user.save();

        return res.status(200).json({ success: true, message: 'Email successfully verified' });
    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

const sendVerificationCode = async (email, verificationCode) => {
    try {
        const user = await Users.findOne({ email });

        const response = await transporter.sendMail({
            from: '"Verification Team" <your_email@example.com>', // Replace with your sender email
            to: email, // Receiver's email
            subject: "Email Verification Code", // Email subject
            text: `Your verification code is ${verificationCode}`, // Plain text body
            html: `              
            <h4>Hi ${user.name},</h4>
            <p>Welcome to CRM! Thank you for signing up. To complete your registration, please verify your email address by entering the verification code below:</p>
            <p style="font-size: 18px; font-weight: bold; color: #007bff;">${verificationCode}</p>
            <p>This code is valid for the next 15 minutes. If you did not sign up for a CRM account, you can safely ignore this email.</p>
            <p>If you need any assistance, feel free to reach out to our support team.</p>
            <p>Thanks,<br>The CRM Team</p>
            `, // HTML body
        });

        console.log('Verification email sent successfully:', response);
    } catch (error) {
        console.error('Failed to send verification email:', error.message);
    }
};

const logout = async (req, res) => {
    try {
        // If you want to implement server-side logout, you can add the token to a blacklist here.
        // For client-side logout, this endpoint is optional.

        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// // Middleware to check if the token is blacklisted
// const checkBlacklist = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (token && tokenBlacklist.has(token)) {
//         return res.status(401).json({ success: false, message: "Token is invalid" });
//     }
//     next();
// };

// Delete Account Functionality
const deleteAccount = async (req, res) => {
    const { userId } = req.body; // The user ID should be sent in the body

    try {
        // Step 1: Verify the user exists by their ID
        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Step 2: Delete the user account
        await Users.findByIdAndDelete(userId);

        // Step 3: Send a confirmation email
        await transporter.sendMail({
            from: '"Account Deletion Team" <your_email@example.com>', // Replace with your sender email
            to: user.email, // Receiver's email
            subject: "Account Deletion Confirmation", // Email subject
            html: `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Account Deletion Notification</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            margin: 0;
                            padding: 0;
                            background-color: #f9f9f9;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 20px auto;
                            padding: 25px;
                            background-color: #ffffff;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        .alert {
                            background-color: #ffdddd;
                            color: #d8000c;
                            padding: 12px;
                            border-radius: 5px;
                            text-align: center;
                            font-weight: bold;
                            margin-bottom: 15px;
                            border: 1px solid #d8000c;
                        }
                        h4 {
                            color: #333;
                            font-size: 18px;
                            margin: 0 0 15px 0;
                        }
                        p {
                            font-size: 14px;
                            color: #555;
                            margin-bottom: 15px;
                            line-height: 1.5;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 13px;
                            color: #777;
                        }
                        hr {
                            border: 0;
                            height: 1px;
                            background: #ddd;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="alert">⚠️ Important: Your account has been deleted!</div>
                        <h4>Hello ${user.name},</h4>
                        <hr> <!-- Visual separation -->
                        <p>We regret to inform you that your account has been successfully deleted from our system.</p>

                        <p>If this was a mistake or you need assistance, please contact our support team at <a href="mailto:support@crmteam.com">support@crmteam.com</a>.</p>

                        <p>We appreciate the time you spent with us and hope to serve you again in the future.</p>

                        <div class="footer">
                            <p>Best regards,<br><strong>The CRM Team</strong></p>
                        </div>
                    </div>
                </body>
                </html>

            `
        });

        res.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        console.error("Delete Account Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports = { register, login, forgotPassword, resetPassword, verifyEmail, sendVerificationCode, logout,deleteAccount };