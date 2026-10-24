import { APP_DOMAIN, APP_NAME, APP_URL, BRAND, CURRENT_YEAR } from "@/constant";

export function getVerificationEmailHTML({
  userFullname,
  verificationUrl,
}: {
  userFullname: string;
  verificationUrl: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Verify your ${APP_NAME} account</title>
</head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6; padding:20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header – blue brand -->
          <tr>
            <td align="center" style="padding:40px 20px;">
              <img src="${APP_URL}/logo.png" alt="${APP_NAME}" width="180" style="display:block;" />
              <h1 style="color:${BRAND.textOnPrimary}; font-size:28px; margin:20px 0 0;">Welcome to ${APP_NAME}!</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;">
              <h2 style="font-size:22px; color:#111827; margin:0 0 20px;">Hello ${userFullname},</h2>
              <p style="font-size:16px; line-height:1.6; color:#374151; margin:0 0 20px;">
                Thank you for signing up! We're excited to have you in our community.<br />
                To complete your registration and activate your account, please verify your email address.
              </p>
              <p style="font-size:16px; line-height:1.6; color:#374151; margin:0 0 30px;">
                This step keeps your account secure and ensures you receive important updates about listings, purchases, and sales.
              </p>
              <!-- CTA -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${verificationUrl}" style="display:inline-block; background:${BRAND.primary}; color:${BRAND.textOnPrimary}; font-size:18px; font-weight:bold; padding:16px 32px; border-radius:8px; text-decoration:none; box-shadow:0 4px 10px ${BRAND.shadow};">Verify Email Address</a>
              </div>
              <p style="font-size:14px; color:#6b7280; margin:30px 0 0;">
                Or copy and paste this link:<br />
                <a href="${verificationUrl}" style="color:${BRAND.link}; word-break:break-all;">${verificationUrl}</a>
              </p>
              <p style="font-size:14px; color:#6b7280; margin:30px 0 0;">
                If you didn't create an account, please ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f3f4f6; padding:20px; font-size:13px; color:#6b7280;">
              © ${CURRENT_YEAR} ${APP_NAME}. All rights reserved.<br />
              Lagos, Nigeria • <a href="${APP_URL}" style="color:${BRAND.link};">${APP_DOMAIN}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export function getPasswordResetEmailHTML({
  userFullname,
  resetUrl,
}: {
  userFullname: string;
  resetUrl: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reset your ${APP_NAME} password</title>
</head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6; padding:20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header – blue brand -->
          <tr>
            <td align="center" style="padding:40px 20px;">
              <img src="${APP_URL}/logo.png" alt="${APP_NAME}" width="180" style="display:block;" />
              <h1 style="color:${BRAND.textOnPrimary}; font-size:28px; margin:20px 0 0;">Password Reset Request</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;">
              <h2 style="font-size:22px; color:#111827; margin:0 0 20px;">Hello ${userFullname},</h2>
              <p style="font-size:16px; line-height:1.6; color:#374151; margin:0 0 20px;">
                We received a request to reset your password.<br />
                If you made this request, click below to set a new password.
              </p>
              <p style="font-size:16px; line-height:1.6; color:#374151; margin:0 0 30px;">
                This link expires in 1 hour for security reasons.
              </p>
              <!-- CTA -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${resetUrl}" style="display:inline-block; background:${BRAND.primary}; color:${BRAND.textOnPrimary}; font-size:18px; font-weight:bold; padding:16px 32px; border-radius:8px; text-decoration:none; box-shadow:0 4px 10px ${BRAND.shadow};">Reset Password</a>
              </div>
              <p style="font-size:14px; color:#6b7280; margin:30px 0 0;">
                Or copy and paste:<br />
                <a href="${resetUrl}" style="color:${BRAND.link}; word-break:break-all;">${resetUrl}</a>
              </p>
              <p style="font-size:14px; color:#6b7280; margin:30px 0 0; font-weight:bold;">
                If you didn't request this, ignore this email or contact support. Your account remains secure.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f3f4f6; padding:20px; font-size:13px; color:#6b7280;">
              © ${CURRENT_YEAR} ${APP_NAME}. All rights reserved.<br />
              Lagos, Nigeria • <a href="${APP_URL}" style="color:${BRAND.link};">${APP_DOMAIN}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Welcome Series – fully branded with brand blue
 *
 * Blue evokes trust, reliability, and professionalism – ideal for a marketplace selling social media accounts.
 */
export function getWelcomeEmailHTML({
  userFullname,
}: {
  userFullname: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to ${APP_NAME}</title>
</head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6; padding:20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header – blue brand -->
          <tr>
            <td align="center" style="padding:40px 20px;">
              <img src="${APP_URL}/logo.png" alt="${APP_NAME}" width="180" style="display:block;" />
              <h1 style="color:${BRAND.primary}; font-size:28px; margin:20px 0 0;">Welcome aboard, ${userFullname}!</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;">
              <p style="font-size:18px; line-height:1.6; color:#111827; margin:0 0 20px;">
                Congratulations on joining ${APP_NAME} – the trusted marketplace for buying social media accounts.
              </p>
              <p style="font-size:16px; line-height:1.6; color:#374151; margin:0 0 30px;">
                Your account is now fully activated. You can browse verified accounts, and conduct secure transactions.
              </p>
              <!-- CTA -->
              <div style="text-align:center; margin:40px 0;">
                <a href="${APP_URL}/dashboard" style="display:inline-block; background:${BRAND.primary}; color:${BRAND.textOnPrimary}; font-size:18px; font-weight:bold; padding:16px 32px; border-radius:8px; text-decoration:none; box-shadow:0 4px 10px ${BRAND.shadow};">Go to Your Dashboard</a>
              </div>
              <p style="font-size:16px; line-height:1.6; color:#374151; margin:30px 0 0;">
                Over the next few days, we'll send you tips to help you buy accounts safely and effectively.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="background:#f3f4f6; padding:20px; font-size:13px; color:#6b7280;">
              © ${CURRENT_YEAR} ${APP_NAME}. All rights reserved.<br />
              Lagos, Nigeria • <a href="${APP_URL}" style="color:${BRAND.link};">${APP_DOMAIN}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
