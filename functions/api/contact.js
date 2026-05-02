const CONTACT_EMAIL = 'advertise@flask-media.com';
const DEFAULT_FROM_EMAIL = `Flask Media <${CONTACT_EMAIL}>`;

const fieldLabels = {
  name: 'Full Name',
  company: 'Company Name',
  website: 'Website',
  email: 'Email',
  phone: 'WhatsApp Number',
  monthly_ad_spend: 'Monthly Ad Spend',
  service: 'Main Service Needed',
  message: 'Message',
};

export async function onRequestPost({ request, env }) {
  const resendApiKey = env.RESEND_API_KEY || env.RESEND_API_TOKEN || env.RESEND_SECRET_API_KEY;

  if (!resendApiKey) {
    return jsonResponse({ message: 'Email service is not configured yet.' }, 500);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (error) {
    return jsonResponse({ message: 'Please submit the contact form again.' }, 400);
  }

  const submission = {
    name: cleanField(formData.get('name'), 160),
    company: cleanField(formData.get('company'), 160),
    website: cleanField(formData.get('website'), 240),
    email: cleanField(formData.get('email'), 240),
    phone: cleanField(formData.get('phone'), 80),
    monthly_ad_spend: cleanField(formData.get('monthly_ad_spend'), 120),
    service: cleanField(formData.get('service'), 160),
    message: cleanField(formData.get('message'), 4000),
  };

  if (!submission.name || !isValidEmail(submission.email)) {
    return jsonResponse({ message: 'Please add your name and a valid email address.' }, 400);
  }

  const subject = `New Flask Media inquiry from ${submission.name}`;
  const fromEmail = env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;
  const toEmail = env.CONTACT_EMAIL || CONTACT_EMAIL;

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: submission.email,
      subject,
      html: buildHtmlEmail(submission),
      text: buildTextEmail(submission),
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    console.error('Resend contact form error:', errorText);
    return jsonResponse({ message: 'We could not send your inquiry. Please try WhatsApp or email us directly.' }, 502);
  }

  return jsonResponse({ message: 'Thanks. Your inquiry has been sent.' });
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
    },
  });
}

function cleanField(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildHtmlEmail(submission) {
  const rows = Object.entries(fieldLabels)
    .map(([key, label]) => {
      const value = submission[key] || 'Not provided';
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-weight:700;width:180px;">${escapeHtml(label)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(value)}</td>
      </tr>`;
    })
    .join('');

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f6f7fb;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="padding:22px 24px;background:#09090b;color:#ffffff;">
        <h1 style="margin:0;font-size:22px;line-height:1.3;">New Flask Media inquiry</h1>
        <p style="margin:8px 0 0;color:#c7cbd6;">A visitor submitted the contact form.</p>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
        ${rows}
      </table>
    </div>
  </body>
</html>`;
}

function buildTextEmail(submission) {
  return Object.entries(fieldLabels)
    .map(([key, label]) => `${label}: ${submission[key] || 'Not provided'}`)
    .join('\n');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
