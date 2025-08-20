"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactForm(_: any, formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const subject = formData.get("subject")?.toString();
  const message = formData.get("message")?.toString();
  const captcha = formData.get("captcha")?.toString();

  // Basic validation
  if (!name || !email || !subject || !message) {
    return { success: false, message: "All fields are required." };
  }

  if (!captcha) {
    return { success: false, message: "Captcha verification is required." };
  }

  // ✅ Verify reCAPTCHA with Google
  try {
    const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
    });

    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      return { success: false, message: "Captcha verification failed. Please try again." };
    }
  } catch (err) {
    console.error("Captcha verification error:", err);
    return { success: false, message: "Captcha verification error. Try again later." };
  }

  // ✅ Send email using Resend
  try {
    await resend.emails.send({
      from: `Patricia Gallery <${process.env.RESEND_FROM_EMAIL}>`, // must be verified in Resend
      to: [`${process.env.RESEND_TO_EMAIL}`],
      subject: `Contact Form: ${subject}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return { success: true, message: "Your message has been sent successfully!" };
  } catch (error) {
    console.error("Resend error:", error);
    return { success: false, message: "Failed to send message. Please try again later." };
  }
}
