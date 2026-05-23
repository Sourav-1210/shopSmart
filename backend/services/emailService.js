const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configure SMTP transport (uses Ethereal mock/test email service if no ENV vars are set)
const getTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate a test SMTP service account from ethereal.email if no custom credentials are provided
    try {
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (err) {
      console.warn('⚠️ Ethereal mail account generation failed, falling back to mock logger:', err.message);
      return null;
    }
  }
};

const sendOrderConfirmationEmail = async (order, userEmail) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain; margin-right: 10px; vertical-align: middle;" />
        <span style="font-weight: 600; font-size: 14px; color: #212121;">${item.name}</span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">₹${item.price.toLocaleString()}</td>
    </tr>
  `
    )
    .join('');

  const emailContent = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <!-- Header -->
      <div style="background-color: #2874F0; padding: 25px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 800; font-style: italic;">
          Shop<span style="color: #FFE11B;">Smart</span>
        </h1>
        <p style="color: #FFE11B; margin: 5px 0 0 0; font-size: 12px; font-style: italic; font-weight: 500;">
          Explore Plus ✦
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 25px; bg-color: #ffffff;">
        <h2 style="color: #212121; font-size: 18px; margin-top: 0;">🎉 Order Placed Successfully!</h2>
        <p style="color: #878787; font-size: 14px; line-height: 1.5;">
          Hi <strong>${order.shippingAddress.name}</strong>,<br/>
          Thank you for shopping with ShopSmart. Your order has been placed successfully and is being processed. Below are your order details:
        </p>

        <!-- Order Info Summary -->
        <div style="background-color: #F0F5FF; border-left: 4px solid #2874F0; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #212121;">
            <tr>
              <td style="padding: 3px 0; color: #878787;">Order ID:</td>
              <td style="padding: 3px 0; font-weight: 700; text-align: right;">${order.orderId}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; color: #878787;">Order Date:</td>
              <td style="padding: 3px 0; font-weight: 600; text-align: right;">${new Date(order.placedAt).toLocaleDateString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; color: #878787;">Estimated Delivery:</td>
              <td style="padding: 3px 0; font-weight: 600; text-align: right; color: #388E3C;">${new Date(order.deliveryDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; color: #878787;">Payment Method:</td>
              <td style="padding: 3px 0; font-weight: 600; text-align: right;">${order.paymentMethod}</td>
            </tr>
          </table>
        </div>

        <!-- Items Table -->
        <h3 style="color: #212121; font-size: 15px; margin-top: 25px; border-bottom: 2px solid #2874F0; padding-bottom: 5px;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #F1F3F6; font-size: 12px; color: #878787;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center; width: 60px;">Qty</th>
              <th style="padding: 10px; text-align: right; width: 100px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Pricing Summary -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; color: #212121;">
          <tr>
            <td style="padding: 5px 10px; text-align: right; color: #878787;">Subtotal:</td>
            <td style="padding: 5px 10px; text-align: right; font-weight: 600; width: 120px;">₹${order.itemsPrice.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 5px 10px; text-align: right; color: #878787;">Delivery Charges:</td>
            <td style="padding: 5px 10px; text-align: right; font-weight: 600; color: ${order.shippingPrice === 0 ? '#388E3C' : '#212121'}">${order.shippingPrice === 0 ? 'FREE' : '₹' + order.shippingPrice}</td>
          </tr>
          <tr style="border-top: 1px dashed #e0e0e0; font-size: 16px; font-weight: 700;">
            <td style="padding: 15px 10px 5px 10px; text-align: right;">Total Amount:</td>
            <td style="padding: 15px 10px 5px 10px; text-align: right; color: #2874F0;">₹${order.totalPrice.toLocaleString()}</td>
          </tr>
        </table>

        <!-- Shipping Address -->
        <h3 style="color: #212121; font-size: 15px; margin-top: 30px; border-bottom: 2px solid #2874F0; padding-bottom: 5px;">Delivery Address</h3>
        <div style="background-color: #F1F3F6; padding: 15px; border-radius: 6px; font-size: 13px; color: #212121; margin-top: 10px; line-height: 1.4;">
          <strong>${order.shippingAddress.name}</strong><br/>
          ${order.shippingAddress.address}, ${order.shippingAddress.locality}<br/>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} - <strong>${order.shippingAddress.pincode}</strong><br/>
          Phone: ${order.shippingAddress.phone}
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #F1F3F6; text-align: center; padding: 20px; font-size: 11px; color: #878787; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0;">This is an auto-generated transaction confirmation email from ShopSmart.</p>
        <p style="margin: 5px 0 0 0;">© 2026 ShopSmart Private Limited. All rights reserved.</p>
      </div>
    </div>
  `;

  // Write a backup log file in backend folder for easy demonstration & verification
  const emailLogPath = path.join(__dirname, '../orders_emails.log');
  const logEntry = `\n========================================\n[${new Date().toISOString()}] EMAIL SENT TO: ${userEmail}\nSUBJECT: Order Confirmation - ${order.orderId}\n----------------------------------------\n${emailContent}\n========================================\n`;
  
  fs.appendFileSync(emailLogPath, logEntry, 'utf8');
  console.log(`✉️ Email notification logged to backend/orders_emails.log for order ${order.orderId}`);

  // Try to send via SMTP
  const transporter = await getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: '"ShopSmart Plus" <noreply@shopsmart.com>',
        to: userEmail,
        subject: `🎉 Your ShopSmart order has been placed! (Order ID: ${order.orderId})`,
        html: emailContent,
      });

      console.log(`✉️ Real/Test Email Sent! Message ID: ${info.messageId}`);
      if (nodemailer.getTestMessageUrl(info)) {
        console.log(`🔗 Preview Test Email URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
      return true;
    } catch (err) {
      console.error('❌ SMTP sending failed:', err.message);
    }
  }
  return false;
};

module.exports = { sendOrderConfirmationEmail };
