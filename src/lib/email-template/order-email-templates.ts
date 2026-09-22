// import type { Order } from "@/payload-types";
// import {
//   BRAND_COLOR,
//   BRAND_SHADOW,
//   LINK_COLOR,
//   TEXT_ON_BRAND,
// } from "../../../../teesvendorshub-cms/src/lib/branding";
// import {
//   appDomain,
//   appName,
//   appUrl,
// } from "../../../../teesvendorshub-cms/src/lib/config";

// export function getOrderConfirmationEmailHTML({
//   order,
//   account,
//   buyerName,
// }: {
//   order: Order;
//   account: any;
//   buyerName: string;
// }) {
//   return `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1">
//   <title>Order Confirmation - ${order.id}</title>
// </head>
// <body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">
//   <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6; padding:20px;">
//     <tr>
//       <td align="center">
//         <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
//           <!-- Header – blue brand -->
//           <tr>
//             <td align="center" style="padding:40px 20px;">
//               <img src="${appUrl}/logo.png" alt="${appName}" width="180" style="display:block;" />
//               <h1 style="color:${TEXT_ON_BRAND}; font-size:28px; margin:20px 0 0;">Order Confirmed!</h1>
//             </td>
//           </tr>
//           <!-- Body -->
//           <tr>
//             <td style="padding:40px 30px;">
//               <h2 style="font-size:22px; color:#111827; margin:0 0 20px;">Hello ${buyerName},</h2>
//               <p style="font-size:16px; line-height:1.6; color:#374151; margin:0 0 20px;">
//                 Thank you for your order! We've received your request to purchase the following social media account:
//               </p>
//               <div style="background:#f8fafc; padding:20px; border-radius:8px; margin:20px 0;">
//                 <p style="margin:0 0 10px;"><strong>Order ID:</strong> ${order.id}</p>
//                 <p style="margin:0 0 10px;"><strong>Account:</strong> ${account.title}</p>
//                 <p style="margin:0 0 10px;"><strong>Price:</strong> ₦${order.total.toLocaleString()}</p>
//                 <p style="margin:0;"><strong>Payment Method:</strong> ${order.orderStatus === "manual" ? "Bank Transfer" : order.paymentMethod === "wallet" ? "Wallet" : "Crypto"}</p>
//               </div>
//               <p style="font-size:16px; line-height:1.6; color:#374151; margin:20px 0;">
//                 Please complete payment and submit proof (if manual transfer) via your dashboard.
//               </p>
//               <div style="text-align:center; margin:30px 0;">
//                 <a href="${appUrl}/dashboard/orders/${order.id}" style="display:inline-block; background:${BRAND_COLOR}; color:${TEXT_ON_BRAND}; font-size:18px; font-weight:bold; padding:16px 32px; border-radius:8px; text-decoration:none; box-shadow:0 4px 10px ${BRAND_SHADOW};">View Order</a>
//               </div>
//               <p style="font-size:14px; color:#6b7280; margin:30px 0 0;">
//                 We'll notify you once payment is verified and the account is delivered.
//               </p>
//             </td>
//           </tr>
//           <!-- Footer -->
//           <tr>
//             <td align="center" style="background:#f3f4f6; padding:20px; font-size:13px; color:#6b7280;">
//               © ${new Date().getFullYear()} ${appName}. All rights reserved.<br />
//               Lagos, Nigeria • <a href="${appUrl}" style="color:${LINK_COLOR};">${appDomain}</a>
//             </td>
//           </tr>
//         </table>
//       </td>
//     </tr>
//   </table>
// </body>
// </html>
// `;
// }

// export function getOrderDeliveredEmailHTML({
//   order,
//   account,
//   buyerName,
//   deliveryNote,
// }: {
//   order: any;
//   account: any;
//   buyerName: string;
//   deliveryNote: string;
// }) {
//   return `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1">
//   <title>Order Delivered - ${order.orderId}</title>
// </head>
// <body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">
//   <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6; padding:20px;">
//     <tr>
//       <td align="center">
//         <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
//           <!-- Header – blue brand -->
//           <tr>
//             <td align="center" style="padding:40px 20px;">
//               <img src="${appUrl}/logo.png" alt="${appName}" width="180" style="display:block;" />
//               <h1 style="color:${TEXT_ON_BRAND}; font-size:28px; margin:20px 0 0;">Account Delivered! 🎉</h1>
//             </td>
//           </tr>
//           <!-- Body -->
//           <tr>
//             <td style="padding:40px 30px;">
//               <h2 style="font-size:22px; color:#111827; margin:0 0 20px;">Hello ${buyerName},</h2>
//               <p style="font-size:16px; line-height:1.6; color:#374151; margin:0 0 20px;">
//                 Great news! Your payment has been verified and the account has been delivered.
//               </p>
//               <div style="background:#f8fafc; padding:20px; border-radius:8px; margin:20px 0;">
//                 <p style="margin:0 0 10px;"><strong>Order ID:</strong> ${order.orderId}</p>
//                 <p style="margin:0 0 10px;"><strong>Account:</strong> ${account.title}</p>
//                 <p style="margin:0;"><strong>Price Paid:</strong> ₦${order.price.toLocaleString()}</p>
//               </div>
//               ${deliveryNote ? `<p style="font-size:16px; line-height:1.6; color:#374151; margin:20px 0;"><strong>Delivery Instructions:</strong></p><div style="background:#e0f2fe; padding:20px; border-radius:8px; margin:20px 0;">${deliveryNote}</div>` : ""}
//               <div style="text-align:center; margin:30px 0;">
//                 <a href="${appUrl}/dashboard/orders/${order.id}" style="display:inline-block; background:${BRAND_COLOR}; color:${TEXT_ON_BRAND}; font-size:18px; font-weight:bold; padding:16px 32px; border-radius:8px; text-decoration:none; box-shadow:0 4px 10px ${BRAND_SHADOW};">View Order Details</a>
//               </div>
//               <p style="font-size:14px; color:#6b7280; margin:30px 0 0;">
//                 Enjoy your new account! If you have any issues, contact support.
//               </p>
//             </td>
//           </tr>
//           <!-- Footer -->
//           <tr>
//             <td align="center" style="background:#f3f4f6; padding:20px; font-size:13px; color:#6b7280;">
//               © ${new Date().getFullYear()} ${appName}. All rights reserved.<br />
//               Lagos, Nigeria • <a href="${appUrl}" style="color:${LINK_COLOR};">${appDomain}</a>
//             </td>
//           </tr>
//         </table>
//       </td>
//     </tr>
//   </table>
// </body>
// </html>
// `;
// }
console.log("HHHH");
