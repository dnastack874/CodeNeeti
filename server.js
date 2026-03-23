const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Serve index.html at http://localhost:3000

// ── Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dnastack874@gmail.com',
        pass: process.env.EMAIL_PASS, // Gmail App Password
    },
});

// ── POST /send-email
app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic server-side validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    const mailOptions = {
        from: `"CodeNiti Contact" <dnastack874@gmail.com>`,
        to: 'dnastack874@gmail.com',
        replyTo: email,
        subject: `[CodeNiti Contact] ${subject}`,
        html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#050505;color:#ffffff;border-radius:12px;padding:32px;border:1px solid #1a1a1a;">
                <h2 style="margin:0 0 24px;font-size:1.4rem;color:#ffffff;">New Message from CodeNiti Website</h2>
                <table style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="padding:10px 0;color:#888;font-size:0.85rem;width:100px;">Name</td>
                        <td style="padding:10px 0;color:#fff;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding:10px 0;color:#888;font-size:0.85rem;">Email</td>
                        <td style="padding:10px 0;color:#fff;"><a href="mailto:${email}" style="color:#aaa;">${email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding:10px 0;color:#888;font-size:0.85rem;">Subject</td>
                        <td style="padding:10px 0;color:#fff;">${subject}</td>
                    </tr>
                </table>
                <hr style="border:none;border-top:1px solid #1a1a1a;margin:20px 0;">
                <p style="color:#888;font-size:0.85rem;margin-bottom:8px;">Message</p>
                <p style="color:#fff;line-height:1.7;white-space:pre-wrap;">${message}</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (err) {
        console.error('Mail error:', err.message);
        // Don't expose error details to frontend
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`\n  CodeNiti server running at http://localhost:${PORT}\n`);
});
