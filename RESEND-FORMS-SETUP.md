# Resend form email setup — CFO Accounting

The website forms are already wired to Vercel serverless functions and Resend. **Do not paste the Resend API key into HTML, JavaScript, GitHub, or this project folder.** Keep it only in Vercel environment variables.

## What happens after a form submission

### Main enquiry form
1. The visitor submits the form on `/contact-us`.
2. `/api/contact` validates the data and sends two transactional emails through Resend:
   - an admin notification containing the full submitted enquiry;
   - a branded confirmation email to the visitor saying the enquiry was received.
3. The admin email uses the visitor's email as `reply_to`, so replying goes directly to the lead.
4. The visitor confirmation uses the business inbox as `reply_to`.
5. After both messages are accepted by Resend, the visitor is sent to `/thank-you`.

### Callback form
The same flow is used by `/api/callback`. The callback form now asks for an email address so the visitor can receive a confirmation email as well as providing their telephone number.

## Required Vercel environment variables

Set these under **Vercel → Project → Settings → Environment Variables**:

```text
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=consult@cfoaccounting.co.uk
CONTACT_FROM_EMAIL=CFO Accounting <website@cfoaccounting.co.uk>
CONTACT_REPLY_TO_EMAIL=consult@cfoaccounting.co.uk
```

Recommended scope: Production, Preview and Development if you want forms to work in every Vercel environment.

After adding or changing environment variables, redeploy the project.

## Resend domain setup

For production sending to real customers, add and verify the sending domain in Resend first. The address in `CONTACT_FROM_EMAIL` must use a domain that your Resend account is authorised to send from.

A good production sender is:

```text
CFO Accounting <website@cfoaccounting.co.uk>
```

You can keep replies going to the main inbox with:

```text
CONTACT_REPLY_TO_EMAIL=consult@cfoaccounting.co.uk
```

## Security and reliability already included

- API key is server-side only and never exposed to visitors.
- Honeypot spam field remains enabled.
- Consent is required server-side before sending.
- Email addresses are validated server-side.
- User-provided values are escaped before being inserted into HTML emails.
- Form values have server-side maximum lengths.
- Every browser submission receives a unique submission ID.
- Resend idempotency keys are used for the admin email and customer confirmation to reduce accidental duplicate emails if a request is retried.
- Admin and customer messages include plain-text fallbacks as well as HTML.
- Resend errors are logged server-side without exposing the API key or raw provider response to the visitor.

## Test after deployment

1. Submit the main contact form using an email address you can access.
2. Confirm the admin inbox receives the full enquiry.
3. Confirm the visitor receives the branded acknowledgement.
4. Reply to the admin notification and confirm the reply is addressed to the visitor.
5. Repeat with the callback form and confirm both emails arrive.
6. Check the Resend dashboard email logs if either message does not arrive.
