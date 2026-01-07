const { Resend } = require("resend");

// Initialize Resend with API key
let resend;

function initResend() {
    if (resend) return resend;

    // Check for API key
    if (process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
        return resend;
    }

    console.warn("⚠️ RESEND_API_KEY not found in environment variables");
    return null;
}

// Function to send email
async function sendMail({ to, subject, html, text }) {
    try {
        const mailClient = initResend();

        if (!mailClient) {
            console.log("Mock Email Sent (No API Key):");
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            return { message: "Mock email logged" };
        }

        const from = process.env.EMAIL_FROM || "Grace <no-reply@send.grace-backend.run.place>";

        const data = await mailClient.emails.send({
            from,
            to,
            subject,
            html,
            text
        });

        if (data.error) {
            console.error("Resend API Error:", data.error);
            throw new Error(data.error.message);
        }

        console.log("📧 Email sent successfully:", data.id);
        return data;
    } catch (error) {
        console.error("Email send error:", error);
        // Don't crash the app if email fails, just log it
        // throw error; 
        return null;
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

    const text = `Hi ${displayName || "there"
        },\n\nWelcome to Grace! Please verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link will expire in 30 minutes.\n\nIf you didn't create an account, you can ignore this email.`;

    return sendMail({ to, subject, html, text });
}

async function sendVolunteerApplicationNotification({
    to,
    ngoName,
    opportunityTitle,
    applicantName,
    applicantEmail,
    message,
}) {
    const subject = `New Volunteer Application - ${opportunityTitle}`;

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
        
        .info-box {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 6px;
            border-left: 3px solid #000000;
            margin: 24px 0;
        }
        
        .info-box p {
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .info-box p:last-child {
            margin-bottom: 0;
        }
        
        .message-box {
            background-color: #f0f7ff;
            padding: 16px;
            border-radius: 6px;
            border-left: 3px solid #0066cc;
            margin: 20px 0;
        }
        
        .message-box p {
            margin: 0;
            font-style: italic;
            color: #333333;
        }
        
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        
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
                <h1>New Volunteer Application</h1>
            </div>
            
            <div class="content">
                <h2>Hello ${ngoName},</h2>
                
                <p>You have received a new volunteer application for the following opportunity:</p>
                
                <div class="info-box">
                    <p><strong>Opportunity:</strong> ${opportunityTitle}</p>
                    <p><strong>Applicant Name:</strong> ${applicantName}</p>
                    <p><strong>Applicant Email:</strong> ${applicantEmail}</p>
                </div>
                
                ${message
            ? `
                <p><strong>Message from Applicant:</strong></p>
                <div class="message-box">
                    <p>"${message}"</p>
                </div>
                `
            : ""
        }
                
                <p>Please review this application and respond at your earliest convenience.</p>
                
                <div class="divider"></div>
                
                <p style="font-size: 13px; color: #666666;">Log in to your Grace dashboard to review and manage volunteer applications.</p>
            </div>
            
            <div class="footer">
                <p>© 2025 Grace. Connecting volunteers with meaningful opportunities.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const text = `New Volunteer Application\n\nHello ${ngoName},\n\nYou have received a new volunteer application:\n\nOpportunity: ${opportunityTitle}\nApplicant: ${applicantName}\nEmail: ${applicantEmail}\n${message ? `\nMessage: ${message}\n` : ""
        }\nPlease log in to your Grace dashboard to review and respond to this application.`;

    return sendMail({ to, subject, html, text });
}

async function sendVolunteerApplicationAccepted({
    to,
    applicantName,
    opportunityTitle,
    ngoName,
}) {
    const subject = "🎉 Your Volunteer Application Has Been Accepted!";

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
        
        .success-badge {
            background-color: #10b981;
            color: #ffffff;
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 16px;
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
        
        .highlight-box {
            background: linear-gradient(135deg, #f0f7ff 0%, #e6f4f1 100%);
            padding: 24px;
            border-radius: 8px;
            border: 1px solid #d1e7dd;
            margin: 24px 0;
            text-align: center;
        }
        
        .highlight-box h3 {
            font-size: 20px;
            color: #0d6efd;
            margin-bottom: 8px;
        }
        
        .highlight-box p {
            font-size: 15px;
            color: #333333;
            margin: 0;
        }
        
        .next-steps {
            background-color: #fff9e6;
            padding: 20px;
            border-radius: 6px;
            border-left: 3px solid #ffc107;
            margin: 24px 0;
        }
        
        .next-steps h3 {
            font-size: 16px;
            color: #1a1a1a;
            margin-bottom: 12px;
        }
        
        .next-steps ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .next-steps li {
            font-size: 14px;
            color: #555555;
            margin-bottom: 8px;
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
                <h1>Congratulations! 🎉</h1>
            </div>
            
            <div class="content">
                <div style="text-align: center;">
                    <span class="success-badge">✓ APPLICATION ACCEPTED</span>
                </div>
                
                <h2>Hi ${applicantName},</h2>
                
                <p>We're thrilled to inform you that your volunteer application has been accepted!</p>
                
                <div class="highlight-box">
                    <h3>${opportunityTitle}</h3>
                    <p><strong>${ngoName}</strong></p>
                </div>
                
                <p>You are now officially part of the <strong>${ngoName}</strong> volunteer team and can start making a real difference in your community!</p>
                
                <div class="next-steps">
                    <h3>📋 Next Steps:</h3>
                    <ul>
                        <li>The NGO will contact you shortly with further details about the opportunity</li>
                        <li>You can now access exclusive volunteer resources in your dashboard</li>
                        <li>Keep an eye on your email for updates and important information</li>
                        <li>Don't hesitate to reach out if you have any questions</li>
                    </ul>
                </div>
                
                <div class="divider"></div>
                
                <p style="text-align: center; font-size: 15px; color: #333333;">
                    <strong>Thank you for your commitment to making the world a better place!</strong>
                </p>
            </div>
            
            <div class="footer">
                <p>© 2025 Grace. Empowering volunteers to create lasting impact.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const text = `Congratulations!\n\nHi ${applicantName},\n\nYour volunteer application for "${opportunityTitle}" at ${ngoName} has been accepted!\n\nYou are now officially part of the volunteer team. The NGO will contact you shortly with further details.\n\nNext Steps:\n- Wait for the NGO to reach out with more information\n- Check your dashboard for volunteer resources\n- Keep an eye on your email for updates\n\nThank you for your commitment to making a difference!`;

    return sendMail({ to, subject, html, text });
}

async function sendVolunteerApplicationRejected({
    to,
    applicantName,
    opportunityTitle,
    ngoName,
}) {
    const subject = "Update on Your Volunteer Application";

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
        
        .info-box {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 6px;
            border-left: 3px solid #6c757d;
            margin: 24px 0;
        }
        
        .info-box p {
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .info-box p:last-child {
            margin-bottom: 0;
        }
        
        .encouragement-box {
            background: linear-gradient(135deg, #fff9e6 0%, #f0f7ff 100%);
            padding: 24px;
            border-radius: 8px;
            border: 1px solid #e5e5e5;
            margin: 24px 0;
            text-align: center;
        }
        
        .encouragement-box h3 {
            font-size: 18px;
            color: #1a1a1a;
            margin-bottom: 12px;
        }
        
        .encouragement-box p {
            font-size: 14px;
            color: #555555;
            margin-bottom: 16px;
        }
        
        .button-container {
            text-align: center;
            margin: 24px 0 0 0;
        }
        
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
                <h1>Application Update</h1>
            </div>
            
            <div class="content">
                <h2>Hi ${applicantName},</h2>
                
                <p>Thank you for your interest in volunteering with us. We truly appreciate the time and effort you put into your application.</p>
                
                <div class="info-box">
                    <p><strong>Opportunity:</strong> ${opportunityTitle}</p>
                    <p><strong>Organization:</strong> ${ngoName}</p>
                </div>
                
                <p>After careful consideration, we regret to inform you that we are unable to accept your application at this time. This decision could be due to various factors such as:</p>
                
                <ul style="margin-left: 20px; margin-bottom: 16px;">
                    <li style="margin-bottom: 8px; color: #555555;">The position has been filled</li>
                    <li style="margin-bottom: 8px; color: #555555;">Specific skill or experience requirements</li>
                    <li style="margin-bottom: 8px; color: #555555;">Timing or scheduling constraints</li>
                    <li style="margin-bottom: 8px; color: #555555;">High volume of qualified applicants</li>
                </ul>
                
                <div class="encouragement-box">
                    <h3>Don't be discouraged! 💪</h3>
                    <p>Your willingness to volunteer and make a difference is commendable. There are many other amazing opportunities waiting for you on Grace.</p>
                    <div class="button-container">
                        <a href="${process.env.FRONTEND_URL || "http://localhost:3000"
        }/all-ngos" class="button">Explore More Opportunities</a>
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <p style="text-align: center; font-size: 13px; color: #666666;">
                    We encourage you to keep looking for the perfect opportunity to make your impact!
                </p>
            </div>
            
            <div class="footer">
                <p>© 2025 Grace. Supporting volunteers in their journey to create change.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const text = `Application Update\n\nHi ${applicantName},\n\nThank you for your interest in volunteering for "${opportunityTitle}" at ${ngoName}.\n\nAfter careful consideration, we are unable to accept your application at this time. This could be due to the position being filled, specific requirements, or a high volume of applicants.\n\nDon't be discouraged! Your willingness to make a difference is commendable. Please explore other volunteer opportunities on Grace.\n\nThank you for your commitment to creating positive change!`;

    return sendMail({ to, subject, html, text });
}

async function sendVolunteerApplicationUpdate({
    to,
    applicantName,
    opportunityTitle,
    ngoName,
    updateMessage,
}) {
    const subject = `Update: ${opportunityTitle} - ${ngoName}`;

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
        
        .info-box {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 6px;
            border-left: 3px solid #000000;
            margin: 24px 0;
        }
        
        .info-box p {
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .info-box p:last-child {
            margin-bottom: 0;
        }
        
        .update-box {
            background-color: #e8f4f8;
            padding: 20px;
            border-radius: 6px;
            border-left: 3px solid #0dcaf0;
            margin: 24px 0;
        }
        
        .update-box p {
            margin: 0;
            color: #333333;
            font-size: 14px;
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
                <h1>Volunteer Opportunity Update</h1>
            </div>
            
            <div class="content">
                <h2>Hi ${applicantName},</h2>
                
                <p>We have an important update regarding your volunteer application:</p>
                
                <div class="info-box">
                    <p><strong>Opportunity:</strong> ${opportunityTitle}</p>
                    <p><strong>Organization:</strong> ${ngoName}</p>
                </div>
                
                <p><strong>Update Details:</strong></p>
                <div class="update-box">
                    <p>${updateMessage}</p>
                </div>
                
                <div class="divider"></div>
                
                <p style="font-size: 13px; color: #666666;">If you have any questions, please don't hesitate to contact the organization directly or check your Grace dashboard for more information.</p>
            </div>
            
            <div class="footer">
                <p>© 2025 Grace. Keeping you connected with volunteer opportunities.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const text = `Volunteer Opportunity Update\n\nHi ${applicantName},\n\nUpdate for: ${opportunityTitle} at ${ngoName}\n\n${updateMessage}\n\nIf you have questions, please contact the organization or check your Grace dashboard.`;

    return sendMail({ to, subject, html, text });
}

module.exports = {
    sendMail,
    sendVerificationEmail,
    sendVolunteerApplicationNotification,
    sendVolunteerApplicationAccepted,
    sendVolunteerApplicationRejected,
    sendVolunteerApplicationUpdate,
};
