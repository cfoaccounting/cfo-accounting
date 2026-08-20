const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const resendEndpoint = "https://api.resend.com/emails";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Method not allowed." });
  }

  const body = request.body || {};
  if (body.website) return response.status(200).json({ ok: true });

  const submissionId = safeSubmissionId(body.submissionId) || makeFallbackSubmissionId();
  const fullName = cleanText(body.fullName, 120);
  const companyName = cleanText(body.companyName, 160);
  const email = cleanText(body.email, 254).toLowerCase();
  const phone = cleanText(body.phone, 60);
  const service = cleanText(body.service, 160);
  const message = cleanText(body.message, 5000);

  if (!fullName || !emailPattern.test(email) || !message || body.privacyConsent !== "on") {
    return response.status(400).json({ message: "Please complete the required fields." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.CONTACT_TO_EMAIL || "consult@cfoaccounting.co.uk";
  const from = process.env.CONTACT_FROM_EMAIL;
  const replyTo = process.env.CONTACT_REPLY_TO_EMAIL || adminEmail;

  if (!apiKey || !from) {
    return response.status(503).json({ message: "Email delivery is not configured yet." });
  }

  const submittedAt = new Date().toISOString();
  const adminHtml = buildAdminEmail({ fullName, companyName, email, phone, service, message, submittedAt, submissionId });
  const customerHtml = buildCustomerEmail({ fullName, companyName, email, phone, service, message });

  try {
    const [adminResult, customerResult] = await Promise.all([
      sendEmail(apiKey, {
        from,
        to: [adminEmail],
        reply_to: email,
        subject: `[Website enquiry] ${service || "Accounting enquiry"} — ${fullName}`,
        html: adminHtml,
        text: buildAdminText({ fullName, companyName, email, phone, service, message, submittedAt, submissionId }),
        tags: [
          { name: "source", value: "website" },
          { name: "form", value: "contact" }
        ]
      }, `cfo-contact-admin-${submissionId}`),
      sendEmail(apiKey, {
        from,
        to: [email],
        reply_to: replyTo,
        subject: "We’ve received your enquiry | CFO Accounting",
        html: customerHtml,
        text: buildCustomerText({ fullName, service }),
        tags: [
          { name: "source", value: "website" },
          { name: "form", value: "contact-confirmation" }
        ]
      }, `cfo-contact-customer-${submissionId}`)
    ]);

    if (!adminResult.ok || !customerResult.ok) {
      console.error("Resend contact form error", {
        adminStatus: adminResult.status,
        adminError: adminResult.error,
        customerStatus: customerResult.status,
        customerError: customerResult.error,
        submissionId
      });
      return response.status(502).json({ message: "Your enquiry could not be emailed just now. Please try again." });
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact form delivery exception", { error: error?.message || error, submissionId });
    return response.status(502).json({ message: "Your enquiry could not be emailed just now. Please try again." });
  }
}

async function sendEmail(apiKey, payload, idempotencyKey) {
  const result = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey.slice(0, 256)
    },
    body: JSON.stringify(payload)
  });

  const data = await result.json().catch(() => ({}));
  return {
    ok: result.ok,
    status: result.status,
    data,
    error: result.ok ? null : data?.message || data?.name || "Resend request failed"
  };
}

function buildAdminEmail({ fullName, companyName, email, phone, service, message, submittedAt, submissionId }) {
  const rows = [
    ["Name", fullName],
    ["Company", companyName || "Not provided"],
    ["Email", email],
    ["Phone", phone || "Not provided"],
    ["Service", service || "Not selected"],
    ["Submitted", formatDate(submittedAt)],
    ["Submission ID", submissionId]
  ];

  return emailShell(`
    <p style="margin:0 0 8px;color:#c48f3a;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">New website enquiry</p>
    <h1 style="margin:0 0 18px;color:#0d2344;font-size:28px;line-height:1.2;">A new lead has contacted CFO Accounting</h1>
    <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.7;">Reply directly to this email and your response will go to ${escapeHtml(fullName)}.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 24px;">
      ${rows.map(([label, value]) => `<tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;width:34%;color:#6b7280;font-size:14px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td></tr>`).join("")}
    </table>
    <div style="padding:18px 20px;background:#f7f8fa;border-radius:12px;border:1px solid #e5e7eb;">
      <p style="margin:0 0 8px;color:#6b7280;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">Message</p>
      <p style="margin:0;color:#1f2937;font-size:15px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `, "CFO Accounting website enquiry");
}

function buildCustomerEmail({ fullName, service }) {
  const firstName = firstNameFrom(fullName);
  const serviceLine = service
    ? `We’ve received your message about <strong>${escapeHtml(service)}</strong>.`
    : "We’ve received your message and it is now with our team.";

  return emailShell(`
    <p style="margin:0 0 8px;color:#c48f3a;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Enquiry received</p>
    <h1 style="margin:0 0 18px;color:#0d2344;font-size:28px;line-height:1.2;">Thanks, ${escapeHtml(firstName)}. We’ve got your enquiry.</h1>
    <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.75;">${serviceLine}</p>
    <p style="margin:0 0 22px;color:#374151;font-size:16px;line-height:1.75;">A member of CFO Accounting will review the details and get back to you with a clear next step, usually within one business day.</p>
    <div style="padding:18px 20px;background:#f7f8fa;border-radius:12px;border:1px solid #e5e7eb;margin:0 0 22px;">
      <p style="margin:0 0 6px;color:#0d2344;font-size:15px;font-weight:700;">Need to add something?</p>
      <p style="margin:0;color:#4b5563;font-size:14px;line-height:1.7;">Simply reply to this email or contact us at <a href="mailto:consult@cfoaccounting.co.uk" style="color:#0d2344;font-weight:600;">consult@cfoaccounting.co.uk</a>.</p>
    </div>
    <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">This is an automatic confirmation that your website enquiry was received. You do not need to submit the form again.</p>
  `, "We’ve received your enquiry");
}

function emailShell(content, previewText) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(previewText)}</title></head>
<body style="margin:0;padding:0;background:#f2f4f7;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f4f7;padding:32px 14px;"><tr><td align="center">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr><td style="background:#0d2344;padding:22px 28px;"><div style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-.02em;">CFO Accounting</div></td></tr>
      <tr><td style="padding:30px 28px;">${content}</td></tr>
      <tr><td style="padding:18px 28px;background:#f8fafc;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.6;">CFO Accounting · London, United Kingdom<br><a href="https://www.cfoaccounting.co.uk" style="color:#0d2344;">www.cfoaccounting.co.uk</a> · <a href="mailto:consult@cfoaccounting.co.uk" style="color:#0d2344;">consult@cfoaccounting.co.uk</a></td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function buildAdminText({ fullName, companyName, email, phone, service, message, submittedAt, submissionId }) {
  return [
    "New CFO Accounting website enquiry",
    "",
    `Name: ${fullName}`,
    `Company: ${companyName || "Not provided"}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Service: ${service || "Not selected"}`,
    `Submitted: ${formatDate(submittedAt)}`,
    `Submission ID: ${submissionId}`,
    "",
    "Message:",
    message
  ].join("\n");
}

function buildCustomerText({ fullName, service }) {
  return [
    `Thanks, ${firstNameFrom(fullName)}. We’ve received your enquiry${service ? ` about ${service}` : ""}.`,
    "",
    "A member of CFO Accounting will review the details and get back to you with a clear next step, usually within one business day.",
    "",
    "Need to add something? Reply to this email or contact consult@cfoaccounting.co.uk.",
    "",
    "This is an automatic confirmation. You do not need to submit the form again."
  ].join("\n");
}

function cleanText(value, maxLength) {
  return String(value || "").replace(/\u0000/g, "").trim().slice(0, maxLength);
}

function firstNameFrom(fullName) {
  return cleanText(fullName, 120).split(/\s+/)[0] || "there";
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/London"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function safeSubmissionId(value) {
  return cleanText(value, 120).replace(/[^A-Za-z0-9_-]/g, "");
}

function makeFallbackSubmissionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}
