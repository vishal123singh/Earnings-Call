import nodemailer from "nodemailer";

// ✅ POST request to send email with chat content
export async function POST(req) {
  try {
    const { to, subject, chatData } = await req.json();
    // ❗️ Validate request body
    if (!to || !subject || !chatData || !Array.isArray(JSON.parse(chatData))) {
      return Response.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    // 🎨 Format chat into HTML content
    const chatHTML = JSON.parse(chatData)
      .map((item) => {
        if (item.role === "assistant") {
          return `
            <div style="background-color: #f3f4f6; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
              <strong style="color: #6b46c1;">🤖 Assistant:</strong>
              <p style="margin: 8px 0; color: #4b5563;">${item.content.replace(/\n/g, "<br>")}</p>
            </div>
          `;
        } else if (item.role === "user") {
          return `
            <div style="background-color: #e5e7eb; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
              <strong style="color: #ec4899;">👤 User:</strong>
              <p style="margin: 8px 0; color: #4b5563;">${item.content.replace(/\n/g, "<br>")}</p>
            </div>
          `;
        }
        return "";
      })
      .join("");

    // 🚀 Create Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in", // For India use smtp.zoho.in, for US use smtp.zoho.com
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER, // Zoho email
        pass: process.env.ZOHO_PASS, // App password or account password
      },
    });

    // ✉️ Email Options
    const mailOptions = {
      from: `"Earnings Insights" <${process.env.ZOHO_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; background-color: #f9fafb; padding: 20px; border-radius: 12px;">
          <h2 style="color: #6b46c1;">📊 Earnings Call Insights</h2>
          <p style="color: #4b5563;">Here’s the detailed conversation related to the earnings call:</p>
          ${chatHTML}
          <hr />
          <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    // 📩 Send Email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", info.messageId);
    return Response.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
