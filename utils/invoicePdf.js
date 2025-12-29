const PDFDocument = require("pdfkit");

module.exports = function generateInvoicePDF(order) {
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));

  /* ================= HEADER ================= */
  doc
    .fontSize(26)
    .font("Helvetica-Bold")
    .text("KRIZOO", 40, 40);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#555")
    .text("Self Improvement Meets Comfort", 40, 70);

  doc
    .fontSize(10)
    .fillColor("#000")
    .text(`Invoice # ${order.orderId}`, 400, 45, { align: "right" })
    .text(`Date: ${order.date}`, 400, 60, { align: "right" })
    .text(`Payment: ${order.paymentMethod}`, 400, 75, {
      align: "right"
    });

  doc.moveDown(3);

  /* ================= CUSTOMER & ADDRESS ================= */
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("BILL TO");

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      `${order.customer.firstname} ${order.customer.lastname}`
    )
    .text(order.customer.address)
    .moveDown(2);

  /* ================= TABLE HEADER ================= */
  const tableTop = doc.y;

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Item", 40, tableTop)
    .text("Qty", 320, tableTop, { width: 40, align: "right" })
    .text("Price", 380, tableTop, { width: 80, align: "right" })
    .text("Total", 470, tableTop, { width: 80, align: "right" });

  doc
    .moveTo(40, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  /* ================= TABLE ROWS ================= */
  let y = tableTop + 25;

  doc.font("Helvetica").fontSize(10);

  order.items.forEach(item => {
    doc
      .text(`${item.name} (${item.size})`, 40, y)
      .text(item.quantity, 320, y, {
        width: 40,
        align: "right"
      })
      .text(`₹${item.price}`, 380, y, {
        width: 80,
        align: "right"
      })
      .text(`₹${item.price * item.quantity}`, 470, y, {
        width: 80,
        align: "right"
      });

    y += 20;
  });

  doc.moveDown(2);

  doc
    .moveTo(40, y)
    .lineTo(550, y)
    .stroke();

  /* ================= TOTALS ================= */
  y += 20;

  doc
    .font("Helvetica")
    .fontSize(11)
    .text(`Subtotal`, 380, y, { width: 100, align: "right" })
    .text(`₹${order.subtotal}`, 470, y, {
      width: 80,
      align: "right"
    });

  y += 18;

  doc
    .text(`Discount`, 380, y, { width: 100, align: "right" })
    .text(`-₹${order.discount}`, 470, y, {
      width: 80,
      align: "right"
    });

  y += 18;

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(`TOTAL`, 380, y, { width: 100, align: "right" })
    .text(`₹${order.total}`, 470, y, {
      width: 80,
      align: "right"
    });

  /* ================= FOOTER ================= */
  doc.moveDown(4);

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#555")
    .text(
      "This is a system generated invoice. No signature required.",
      40,
      doc.y,
      { align: "center" }
    );

  doc.end();

  return new Promise(resolve => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });
};