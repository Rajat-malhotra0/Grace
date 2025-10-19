const nodemailer = require("nodemailer");

let transporter;

async function initTransporter() {
    if (transporter) return transporter;

    const { GMAIL_USER, GMAIL_APP_PASS } = process.env;

    if (GMAIL_USER && GMAIL_APP_PASS) {
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_APP_PASS,
            },
        });
        return transporter;
    }

    // Dev fallback: Ethereal for testing
    console.log("⚠️  Gmail credentials not found, using Ethereal test account");
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
    });
    return transporter;
}

async function sendMail({ to, subject, html, text }) {
    try {
        const t = await initTransporter();
        const from =
            process.env.EMAIL_FROM ||
            process.env.GMAIL_USER ||
            "Grace <no-reply@grace.org>";

        const info = await t.sendMail({ from, to, subject, html, text });

        // Log preview URL for dev testing
        const preview = nodemailer.getTestMessageUrl(info);
        if (preview) {
            console.log("📧 Email preview:", preview);
        }

        return info;
    } catch (error) {
        console.error("Email send error:", error);
        throw error;
    }
}

async function sendVerificationEmail({ to, displayName, verifyUrl }) {
    const subject = "Verify your email - Grace";

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f5f5f5;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .email-wrapper {
            background-color: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        /* Replaced gradient header with elegant black header */
        .header {
            background-color: #000000;
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
            border-bottom: 1px solid #e5e5e5;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 600;
            letter-spacing: -0.5px;
            margin: 0;
        }
        
        .content {
            background-color: #ffffff;
            padding: 40px 30px;
        }
        
        .content h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 16px;
            letter-spacing: -0.3px;
        }
        
        .content p {
            font-size: 14px;
            line-height: 1.7;
            color: #555555;
            margin-bottom: 16px;
        }
        
        .content p strong {
            color: #1a1a1a;
            font-weight: 600;
        }
        
        .button-container {
            text-align: center;
            margin: 32px 0;
            color: #ffffff;
        }
        
        /* Updated button to match black and white theme */
        .button {
            display: inline-block;
            padding: 12px 32px;
            background-color: #000000;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.3px;
            transition: background-color 0.2s ease;
            border: 1px solid #000000;
        }
        
        .button:hover {
            background-color: #1a1a1a;
            border-color: #1a1a1a;
        }
        
        .link-box {
            background-color: #f9f9f9;
            padding: 16px;
            border-radius: 6px;
            border-left: 3px solid #000000;
            margin: 16px 0;
        }
        
        .link-box p {
            font-size: 12px;
            word-break: break-all;
            color: #666666;
            margin: 0;
            font-family: 'Courier New', monospace;
        }
        
        .footer {
            background-color: #f9f9f9;
            text-align: center;
            padding: 24px 30px;
            border-top: 1px solid #e5e5e5;
        }
        
        .footer p {
            font-size: 12px;
            color: #888888;
            margin: 0;
            line-height: 1.6;
        }
        
        .divider {
            height: 1px;
            background-color: #e5e5e5;
            margin: 24px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-wrapper">
            <div class="header">
                <h1>Welcome to Grace</h1>
            </div>
            
            <div class="content">
                <h2>Hi ${displayName || "there"},</h2>
                
                <p>Thank you for registering with Grace. We're excited to have you join our community of volunteers and change-makers.</p>
                
                <p>Please verify your email address to get started:</p>
                
                <div class="button-container">
                    <a href="${verifyUrl}" class="button">Verify Email Address</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                
                <div class="link-box">
                    <p>${verifyUrl}</p>
                </div>
                
                <div class="divider"></div>
                
                <p><strong>Note:</strong> This link will expire in 30 minutes.</p>
                <p>If you didn't create an account with Grace, you can safely ignore this email.</p>
            </div>
            
            <div class="footer">
                <p>© 2025 Grace. Making the world a better place, one volunteer at a time.</p>
            </div>
        </div>
    </div>
</body>
</html>

    `;

    const text = `Hi ${
        displayName || "there"
    },\n\nWelcome to Grace! Please verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link will expire in 30 minutes.\n\nIf you didn't create an account, you can ignore this email.`;

    return sendMail({ to, subject, html, text });
}

module.exports = { sendMail, sendVerificationEmail };
