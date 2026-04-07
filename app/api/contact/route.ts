import { NextResponse } from 'next/server';
import { businessInfo } from '@/lib/data';
import { CONTACT_INSURANCE_OTHER_VALUE, contactFormSchema, type ContactFormInput } from '@/lib/contactForm';

export const runtime = 'nodejs';

const MAILGUN_API_BASE_URL = 'https://api.mailgun.net';
const MAILGUN_DOMAIN = 'mg.fba-wizard.com';
const MAILGUN_FROM_EMAIL = 'Mailgun Sandbox <postmaster@mg.fba-wizard.com>';
const MAILGUN_TO_EMAIL = businessInfo.email;

function escapeHtml(value: string): string {
      return value
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
}

function buildSubmissionSummary(data: ContactFormInput) {
      const insuranceValue =
            data.insurance === CONTACT_INSURANCE_OTHER_VALUE ? data.insuranceOther.trim() : data.insurance;
      const therapistRequested = data.therapistRequested.trim() || 'No preference';
      const preferredDays = data.preferredDays.trim() || 'Not specified';
      const submittedAt = new Date().toISOString();

      return {
            insuranceValue,
            therapistRequested,
            preferredDays,
            submittedAt,
      };
}

function buildEmailText(data: ContactFormInput): string {
      const { insuranceValue, therapistRequested, preferredDays, submittedAt } = buildSubmissionSummary(data);

      return [
            'New contact form submission from the DPS website',
            '',
            `Submitted at: ${submittedAt}`,
            `Name: ${data.firstName} ${data.lastName}`,
            `Email: ${data.email}`,
            `Phone: ${data.phone}`,
            `Preferred contact method: ${data.preferredContactMethod}`,
            `Location: ${data.city}, ${data.state} ${data.zip}`,
            `Inquiry for a minor: ${data.isMinor ? 'Yes' : 'No'}`,
            `Age range: ${data.ageRange}`,
            `Insurance: ${insuranceValue}`,
            `Requested therapist: ${therapistRequested}`,
            `Appointment preference: ${data.appointmentPreference}`,
            `Preferred days/times: ${preferredDays}`,
            '',
            'Message:',
            data.message,
      ].join('\n');
}

function buildEmailHtml(data: ContactFormInput): string {
      const { insuranceValue, therapistRequested, preferredDays, submittedAt } = buildSubmissionSummary(data);
      const rows = [
            ['Submitted at', submittedAt],
            ['Name', `${data.firstName} ${data.lastName}`],
            ['Email', data.email],
            ['Phone', data.phone],
            ['Preferred contact method', data.preferredContactMethod],
            ['Location', `${data.city}, ${data.state} ${data.zip}`],
            ['Inquiry for a minor', data.isMinor ? 'Yes' : 'No'],
            ['Age range', data.ageRange],
            ['Insurance', insuranceValue],
            ['Requested therapist', therapistRequested],
            ['Appointment preference', data.appointmentPreference],
            ['Preferred days/times', preferredDays],
      ];

      const rowsHtml = rows
            .map(([label, value]) => {
                  return `
                        <tr>
                              <td style="padding:8px 12px;border:1px solid #d6d3d1;font-weight:600;background:#fafaf9;">${escapeHtml(label)}</td>
                              <td style="padding:8px 12px;border:1px solid #d6d3d1;">${escapeHtml(value)}</td>
                        </tr>
                  `;
            })
            .join('');

      return `
            <div style="font-family:Arial,sans-serif;color:#1f2933;line-height:1.5;">
                  <h2 style="margin-bottom:16px;">New contact form submission from the DPS website</h2>
                  <table style="border-collapse:collapse;width:100%;max-width:720px;margin-bottom:20px;">
                        <tbody>${rowsHtml}</tbody>
                  </table>
                  <h3 style="margin-bottom:8px;">Message</h3>
                  <div style="border:1px solid #d6d3d1;border-radius:12px;padding:16px;background:#fcfaf7;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
            </div>
      `;
}

function getMailgunConfig() {
      return {
            apiKey: process.env.MAILGUN_API_KEY?.trim() || '',
            domain: MAILGUN_DOMAIN,
            from: MAILGUN_FROM_EMAIL,
            to: MAILGUN_TO_EMAIL,
            apiBaseUrl: MAILGUN_API_BASE_URL,
      };
}

export async function POST(request: Request) {
      let body: unknown;

      try {
            body = await request.json();
      } catch {
            return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
      }

      const parsed = contactFormSchema.safeParse(body);
      if (!parsed.success) {
            return NextResponse.json(
                  { error: parsed.error.issues[0]?.message || 'Please review the form and try again.' },
                  { status: 400 }
            );
      }

      const data = parsed.data;
      if (data.company.trim()) {
            return NextResponse.json({ ok: true });
      }

      const config = getMailgunConfig();
      if (!config.apiKey || !config.domain || !config.from) {
            return NextResponse.json(
                  { error: 'Contact form email is not configured yet. Please call or email the office directly.' },
                  { status: 503 }
            );
      }

      const formBody = new URLSearchParams({
            from: config.from,
            to: config.to,
            subject: `New DPS contact form submission from ${data.firstName} ${data.lastName}`,
            text: buildEmailText(data),
            html: buildEmailHtml(data),
            'h:Reply-To': data.email,
            'o:tag': 'contact-form',
      });

      try {
            const response = await fetch(`${config.apiBaseUrl}/v3/${config.domain}/messages`, {
                  method: 'POST',
                  headers: {
                        Authorization: `Basic ${Buffer.from(`api:${config.apiKey}`).toString('base64')}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: formBody.toString(),
                  cache: 'no-store',
            });

            if (!response.ok) {
                  const errorText = await response.text();
                  console.error('Mailgun contact form request failed:', errorText);
                  return NextResponse.json(
                        { error: 'We could not send your message right now. Please call or email the office directly.' },
                        { status: 502 }
                  );
            }

            return NextResponse.json({ ok: true });
      } catch (error) {
            console.error('Mailgun contact form request threw an error:', error);
            return NextResponse.json(
                  { error: 'We could not send your message right now. Please call or email the office directly.' },
                  { status: 502 }
            );
      }
}
