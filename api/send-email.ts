// src/api/send-email.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
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
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate required fields
  const { name, brand, contact, message } = req.body as EmailRequest;
  if (!name || !contact || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}