import {Resend} from 'resend';
import {NextResponse} from 'next/server';

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        {error: 'Email service is not configured'},
        {status: 500}
      );
    }

    const body = await request.json();
    const {name, company, email, productInterest, message, website} = body;

    // Honeypot check: if the honeypot field is filled, it's likely a bot
    if (website) {
      // Silently reject - return success to not alert the bot
      return NextResponse.json(
        {message: 'Email sent successfully'},
        {status: 200}
      );
    }

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        {error: 'Name and email are required'},
        {status: 400}
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {error: 'Invalid email address'},
        {status: 400}
      );
    }

    // Format product interest for display
    const productInterestDisplay = productInterest === 'human' 
      ? 'Human products' 
      : productInterest === 'animal' 
        ? 'Animal products' 
        : 'Not specified';

    // Escape user input to prevent XSS
    const safeName = escapeHtml(name);
    const safeCompany = escapeHtml(company || 'Not provided');
    const safeEmail = escapeHtml(email);
    const safeMessage = message ? escapeHtml(message) : '';

    // Build email HTML content
    const emailContent = `
      <h2>New Inquiry from iSperm Website</h2>
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Product Interest:</strong> ${productInterestDisplay}</p>
        ${safeMessage ? `<div style="margin-top: 20px;"><strong>Message:</strong><div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap;">${safeMessage}</div></div>` : ''}
      </div>
    `;

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'iSperm Website <onboarding@resend.dev>',
      to: ['market@isperm.com'],
      subject: 'New Inquiry from iSperm Website',
      html: emailContent,
      replyTo: email, // Set reply-to to the user's email
    });

    return NextResponse.json(
      {message: 'Email sent successfully'},
      {status: 200}
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {error: 'Failed to send email'},
      {status: 500}
    );
  }
}

