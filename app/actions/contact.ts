"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactForm(_: any, formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const subject = formData.get("subject")?.toString();
  const message = formData.get("message")?.toString();

  if (!name || !email || !subject || !message) {
    return { success: false, message: "All fields are required." };
  }

  try {
   const res= await resend.emails.send({
      from: `Nastya Gallery <${process.env.RESEND_FROM_EMAIL}>`, // replace with your domain email in production
      to: [`${process.env.RESEND_TO_EMAIL}`], // your actual recipient
      subject: `Contact Form: ${subject}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    //console.log(res)

    return { success: true, message: "Your message has been sent successfully!" };
  } catch (error) {
    console.error("Resend error:", error);
    return { success: false, message: "Failed to send message. Please try again later." };
  }
}
