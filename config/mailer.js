const { Resend } = require("resend");
const generateInvoicePDF = require("../utils/invoicePdf");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendInvoiceMail = async ({ to, order }) => {
  const pdfBuffer = await generateInvoicePDF(order);

  await resend.emails.send({
    from: "KRIZOO <orders@resend.dev>",
    to,
    subject: `KRIZOO Invoice • ${order.orderId}`,
    html: `
      <p>Your order has been successfully placed.</p>
      <p>Please find your invoice attached.</p>
      <br/>
      <strong>KRIZOO</strong>
    `,
    attachments: [
      {
        filename: `KRIZOO-INVOICE-${order.orderId}.pdf`,
        content: pdfBuffer
      }
    ]
  });
};