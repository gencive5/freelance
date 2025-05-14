// send-email.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

interface EmailRequest {
  name: string;
  brand?: string;
  contact: string;
  message: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Debugging logs - helps track execution
  console.log("\n=== NEW REQUEST STARTED ===");
  console.log("Environment variables check:", {
    GMAIL_USER: process.env.GMAIL_USER ? "✅ Exists" : "❌ Missing",
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD ? "✅ Exists" : "❌ Missing"
  });

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.warn("Method not allowed - Received:", req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate required fields
  const { name, brand, contact, message } = req.body as EmailRequest;
  if (!name || !contact || !message) {
    console.warn("Missing required fields:", { name, contact, message });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate email format if contact looks like an email
  if (contact.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    console.warn("Invalid email format:", contact);
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Configure transporter with additional debug info
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
    logger: true, // Enable SMTP traffic logging
    debug: true   // Show debug output
  });

  try {
    console.log("Attempting to send email with details:", {
      from: process.env.GMAIL_USER,
      to: 'vic.segen@gmail.com',
      subject: `New message from ${name}`
    });

    const mailOptions = {
      from: `"${name}" <${process.env.GMAIL_USER}>`,
      replyTo: contact,
      to: 'vic.segen@gmail.com',
      subject: `New message from ${name}${brand ? ` (${brand})` : ''}`,
      text: `Message from: ${name}\n\n${message}\n\nContact: ${contact}`,
      html: `
        <h3>Message from: ${name}${brand ? ` (${brand})` : ''}</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <br>
        <p><b>Contact:</b> ${contact}</p>
        ${brand ? `<p><b>Brand:</b> ${brand}</p>` : ''}
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!", info.messageId);
    return res.status(200).json({ 
      success: true,
      messageId: info.messageId
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("FULL ERROR DETAILS:", {
      timestamp: new Date().toISOString(),
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      environment: {
        nodeVersion: process.version,
        gmailUser: process.env.GMAIL_USER,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });
    
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: errorMessage,
      suggestion: 'Please check server logs for more details'
    });
  }
}