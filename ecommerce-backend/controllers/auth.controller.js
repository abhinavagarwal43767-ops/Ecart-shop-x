const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ================= Register =================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ================= Login =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token ,email});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ================= Logout =================
// Since JWT is stateless, logout is handled client-side.
// But you can create this endpoint for clarity.
exports.logout = async (req, res) => {
  try {
    // Invalidate token logic can be implemented with a token blacklist if required
    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ================= Send Email =================
exports.sendEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: { rejectUnauthorized: false }
    });

    const htmlContent = `
      <div style="font-family:Segoe UI,Roboto,Arial,sans-serif;color:#111827;line-height:1.6;">
        <p>Hello,</p>

        <p>You have received a new message from the contact form.</p>

        <p>
          <strong>Name:</strong> ${name}<br/>
          <strong>Email:</strong> ${email}
          ${subject ? `<br/><strong>Subject:</strong> ${subject}` : ''}
        </p>

        <p><strong>Message:</strong></p>
        <p>${message}</p>

        <br/>

        <p>
          Best regards,<br/>
          <strong>Abhinav Agrawal</strong><br/>
          <span style="color:#6b7280;">Full-Stack Software Engineer</span>
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: subject || 'New Contact Message',
      text: message,
      html: htmlContent
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email Error:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
};


