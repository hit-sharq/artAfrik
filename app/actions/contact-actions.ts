"use server"

import { z } from "zod"
import nodemailer from "nodemailer"

// Form schema validation
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  inquiryType: z.enum(["general", "product", "wholesale", "partnership", "other"]),
})

// Type for the form data
export type ContactFormData = z.infer<typeof contactFormSchema>

export async function sendContactForm(data: ContactFormData) {
  try {
    // Validate form data
    const validatedData = contactFormSchema.parse(data)

    // In production, you would use an email service like SendGrid, Mailgun, etc.
    // This is a simulation using nodemailer with a fake SMTP server
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "user@example.com",
        pass: process.env.SMTP_PASSWORD || "password",
      },
    })

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || "artafrik.gallery@gmail.com",
      to: process.env.EMAIL_TO || "artafrik.gallery@gmail.com",
      subject: `Contact Form: ${validatedData.subject}`,
      text: `
        Name: ${validatedData.name}
        Email: ${validatedData.email}
        Phone: ${validatedData.phone || "Not provided"}
        Inquiry Type: ${validatedData.inquiryType}
        Subject: ${validatedData.subject}
        Message: ${validatedData.message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Phone:</strong> ${validatedData.phone || "Not provided"}</p>
        <p><strong>Inquiry Type:</strong> ${validatedData.inquiryType}</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
      `,
    }

    // In a real implementation, the code below would actually send the email
    // await transporter.sendMail(mailOptions)

    // For demo, simulate a delay and successful sending
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Send auto-reply to the user
    const autoReplyOptions = {
      from: process.env.EMAIL_FROM || "artafrik.gallery@gmail.com",
      to: validatedData.email,
      subject: "Thank you for contacting Arts Afrik",
      text: `
        Dear ${validatedData.name},

        Thank you for reaching out to Arts Afrik. We have received your message and will get back to you as soon as possible, usually within 24 hours.

        Here's a copy of your message:
        
        Subject: ${validatedData.subject}
        Message: ${validatedData.message}

        Best regards,
        The Arts Afrik Team
      `,
      html: `
        <h3>Thank you for contacting Arts Afrik</h3>
        <p>Dear ${validatedData.name},</p>
        <p>Thank you for reaching out to Arts Afrik. We have received your message and will get back to you as soon as possible, usually within 24 hours.</p>
        <p>Here's a copy of your message:</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
        <p>Best regards,<br>The Arts Afrik Team</p>
      `,
    }

    // In a real implementation, the code below would actually send the auto-reply
    // await transporter.sendMail(autoReplyOptions)

    return {
      success: true,
      message: "Your message has been sent successfully. We'll contact you soon!",
    }
  } catch (error) {
    console.error("Error sending contact form:", error)
    if (error instanceof z.ZodError) {
      // Return validation errors
      const formattedErrors = error.errors.reduce(
        (acc, curr) => {
          const field = curr.path[0] as string
          acc[field] = curr.message
          return acc
        },
        {} as Record<string, string>,
      )
      return {
        success: false,
        errors: formattedErrors,
        message: "There are errors in your form submission.",
      }
    }
    return {
      success: false,
      message: "There was an error sending your message. Please try again later.",
    }
  }
}
