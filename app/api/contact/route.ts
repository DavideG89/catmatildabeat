import { NextResponse } from "next/server"
export const runtime = "nodejs"

// Simple schema validation without adding deps
function isValidEmail(email: string) {
  return /.+@.+\..+/.test(email)
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { name, email, subject, message } = body as Record<string, string>

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Basic length checks to avoid abuse
    if (name.length > 100 || subject.length > 150 || message.length > 5000) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 })
    }

    // Prepare email
    const toEmail = process.env.CONTACT_TO_EMAIL || "davidegiuliano.free@gmail.com"
    const fromEmail = process.env.CONTACT_FROM_EMAIL || toEmail

    // Lazy import to avoid bundling in edge
    const nodemailer = await import("nodemailer").then(m => m.default || m)

    const host = process.env.SMTP_HOST || "smtp.gmail.com"
    const port = Number(process.env.SMTP_PORT || 465)
    const secure = String(process.env.SMTP_SECURE || "true").toLowerCase() === "true"
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!user || !pass) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    })

    const text = `New contact form submission\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Subject: ${subject}\n\n` +
      `Message:\n${message}`

    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.5;color:#111">
        <p style="margin:0 0 12px 0">You received a new message from the website contact form:</p>
        <ul style="margin:0 0 16px 20px; padding:0">
          <li><strong>Name:</strong> ${escapeHtml(name)}</li>
          <li><strong>Email:</strong> ${escapeHtml(email)}</li>
          <li><strong>Subject:</strong> ${escapeHtml(subject)}</li>
        </ul>
        <div style="padding:12px 14px; background:#f6f6f6; border-radius:8px; white-space:pre-wrap">${escapeHtml(message)}</div>
      </div>
    `

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `${subject}`,
      text,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("/api/contact error", err)
    const isDev = process.env.NODE_ENV !== "production"
    return NextResponse.json(
      { error: isDev ? `Unable to send message: ${err?.message || String(err)}` : "Unable to send message" },
      { status: 500 },
    )
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
