import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

interface EmailRequest {
  name: string;
  brand?: string;
  contact: string;
  message: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Debugging logs
  console.log("--- NEW REQUEST ---");
  console.log("Env vars check:", {
    hasUser: !!process.env.GMAIL_USER,
    hasPass: !!process.env.GMAIL_PASSWORD
  });

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate required fields
  const { name, brand, contact, message } = req.body as EmailRequest;
  if (!name || !contact || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate email format
  if (contact.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  try {
    console.log("Attempting to send email...");
    await transporter.sendMail({
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
      `,
    });

    console.log("Email sent successfully");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("FULL ERROR:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      raw: error
    });
    
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}