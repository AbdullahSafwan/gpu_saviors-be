import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import prisma from "../../prisma";
import { systemConfigurationDao } from "../../dao/systemConfiguration";
import { debugLog } from "../helper";

interface BookingData {
  id: number;
  code: string | null;
  clientName: string;
  phoneNumber: string;
  whatsappNumber: string;
  payableAmount: number | null;
  paidAmount: number | null;
  createdAt: Date;
  status: string;
  clientType: string;
  booking_items: Array<{
    name: string;
    type: string;
    serialNumber: string | null;
    payableAmount: number;
    reportedIssue: string | null;
  }>;
  booking_payments: Array<{
    paidAmount: number | null;
    paymentMethod: string;
    status: string;
    createdAt: Date;
  }>;
}

/**
 * Generates the footer section for PDFs with warranty terms and contact information
 * Fetches WARRANTY_TERMS and CS_PHONE_NUMBER from system configuration
 */
const generateFooter = async (doc: PDFKit.PDFDocument): Promise<void> => {
  // Fetch warranty terms from system configuration
  let warrantyTerms: string | undefined;
  try {
    const warrantyConfig = await systemConfigurationDao.getSystemConfigurationByKey(prisma, "WARRANTY_TERMS");
    warrantyTerms = warrantyConfig?.value;
  } catch (error) {
    // If WARRANTY_TERMS doesn't exist, continue without it
    debugLog("WARRANTY_TERMS not found in system configuration");
    warrantyTerms = undefined;
  }

  // Fetch customer support phone number from system configuration
  let customerSupportPhone: string | undefined;
  try {
    const phoneConfig = await systemConfigurationDao.getSystemConfigurationByKey(prisma, "CS_PHONE_NUMBER");
    customerSupportPhone = phoneConfig?.value;
  } catch (error) {
    // If CS_PHONE_NUMBER doesn't exist, continue without it
    debugLog("CS_PHONE_NUMBER not found in system configuration");
    customerSupportPhone = undefined;
  }

  // Warranty Terms (if available)
  if (warrantyTerms) {
    doc.moveDown(2);
    const termsY = doc.y;

    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor("#000")
      .text("Warranty Terms & Conditions", 50, termsY);

    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#666")
      .text(warrantyTerms, 50, termsY + 15, { width: 495, align: "justify" })
      .fillColor("#000");
  }

  // Footer - Clean and minimal
  doc.moveDown(3);
  const footerY = doc.y;

  // Separator line before footer
  doc.moveTo(50, footerY).lineTo(545, footerY).strokeColor("#E5E5E5").lineWidth(1).stroke();

  doc.moveDown(1);
  const textY = doc.y;

  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor("#666")
    .text("Thank you for choosing GPU Saviors!", 50, textY, { align: "center", width: 495 });

  // Contact information
  if (customerSupportPhone) {
    doc
      .fontSize(8)
      .text(`Customer Support: ${customerSupportPhone}`, 50, textY + 15, { align: "center", width: 495 });
  }

  // Review request with Facebook link
  doc
    .fontSize(8)
    .fillColor("#666")
    .text("We’d love to hear from you! Share your experience with us on Facebook.", 50, customerSupportPhone ? textY + 30 : textY + 15, { align: "center", width: 495 })
    .fontSize(8)
    .fillColor("#000")
    .font("Helvetica-Bold")
    .text("https://www.facebook.com/gpusaviors", 50, customerSupportPhone ? textY + 43 : textY + 28, { align: "center", width: 495, link: "https://www.facebook.com/gpusaviors" })
    .fillColor("#000")
    .font("Helvetica");
};

/**
 * Generates a receipt PDF for a booking
 */
export const generateReceipt = async (bookingData: BookingData): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks: Uint8Array[] = [];

      // Collect PDF chunks
      doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
      doc.on("end", () => {
        // Calculate total length
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        // Create a single buffer
        const result = Buffer.allocUnsafe(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }
        resolve(result);
      });
      doc.on("error", reject);

      // Logo path (use process.cwd() for correct path in both dev and production)
      const logoPath = path.join(process.cwd(), "public/assets/logos/logo.png");
      const hasLogo = fs.existsSync(logoPath);

      // Simple header - Stripe style
      if (hasLogo) {
        doc.image(logoPath, 50, 45, { width: 60 });
      }

      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .fillColor("#000")
        .text("GPU SAVIORS", hasLogo ? 125 : 50, 50, { align: hasLogo ? "left" : "center" })
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666")
        .text("Professional GPU Repair Services", hasLogo ? 125 : 50, 72, { align: hasLogo ? "left" : "center" });

      // Receipt label on the right
      doc
        .fontSize(14)
        .font("Helvetica")
        .fillColor("#000")
        .text("Receipt", 450, 55, { width: 95, align: "right" })
        .fillColor("#000");

      // Thin separator line
      doc.moveDown(1.5);
      const lineY = doc.y;
      doc.moveTo(50, lineY).lineTo(545, lineY).strokeColor("#E5E5E5").lineWidth(1).stroke();

      doc.moveDown(1.5);

      // Booking Code - Simple box
      const bookingCode = bookingData.code || bookingData.id.toString();
      const codeBoxY = doc.y;

      // Light background box
      doc.rect(50, codeBoxY, 495, 45).fill("#F7F7F7");

      // Booking code text
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#666")
        .text("BOOKING CODE", 60, codeBoxY + 8)
        .fontSize(14)
        .fillColor("#000")
        .font("Helvetica-Bold")
        .text(bookingCode, 60, codeBoxY + 22);

      // Important notice - subtle
      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor("#666")
        .text("Save this code for tracking and support", 300, codeBoxY + 25)
        .fillColor("#000");

      doc.moveDown(3);

      // Receipt Information - Simple two column
      const infoY = doc.y;
      doc
        .fontSize(9)
        .fillColor("#666")
        .text("Date", 50, infoY)
        .fillColor("#000")
        .font("Helvetica")
        .text(new Date(bookingData.createdAt).toLocaleDateString(), 50, infoY + 12);

      doc
        .fontSize(9)
        .fillColor("#666")
        .text("Status", 300, infoY)
        .fillColor("#000")
        .font("Helvetica")
        .text(bookingData.status, 300, infoY + 12);

      doc.moveDown(2);

      // Customer Information - Clean layout
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#000")
        .text("Customer Information", 50)
        .moveDown(0.5);

      const custY = doc.y;
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666")
        .text("Name", 50, custY)
        .fillColor("#000")
        .text(bookingData.clientName, 50, custY + 12)
        .fillColor("#666")
        .text("Phone", 280, custY)
        .fillColor("#000")
        .text(bookingData.phoneNumber, 280, custY + 12);

      doc.moveDown(2);

      const custY2 = doc.y;
      doc
        .fillColor("#666")
        .text("WhatsApp", 50, custY2)
        .fillColor("#000")
        .text(bookingData.whatsappNumber, 50, custY2 + 12)
        .fillColor("#666")
        .text("Type", 280, custY2)
        .fillColor("#000")
        .text(bookingData.clientType, 280, custY2 + 12);

      doc.moveDown(3);

      // Items Section - Clean table
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#000")
        .text("Items", 50)
        .moveDown(0.5);

      // Simple table header with line
      const tableTop = doc.y;
      const itemX = 50;
      const typeX = 200;
      const serialX = 300;
      const amountX = 480;

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666")
        .text("Item", itemX, tableTop)
        .text("Type", typeX, tableTop)
        .text("Serial #", serialX, tableTop)
        .text("Amount", amountX, tableTop, { width: 65, align: "right" });

      // Line under header
      doc.moveTo(50, tableTop + 15).lineTo(545, tableTop + 15).strokeColor("#E5E5E5").lineWidth(1).stroke();

      // Table rows - clean, no background colors
      let itemY = tableTop + 25;
      doc.font("Helvetica").fontSize(9).fillColor("#000");

      bookingData.booking_items.forEach((item) => {
        if (itemY > 700) {
          doc.addPage();
          itemY = 50;
        }

        doc
          .fillColor("#000")
          .text(item.name, itemX, itemY, { width: 140 })
          .text(item.type, typeX, itemY)
          .fillColor("#666")
          .text(item.serialNumber || "—", serialX, itemY, { width: 140 })
          .fillColor("#000")
          .text(`Rs. ${item.payableAmount.toLocaleString()}`, amountX, itemY, { width: 65, align: "right" });

        if (item.reportedIssue) {
          itemY += 15;
          doc
            .fontSize(8)
            .fillColor("#666")
            .text(`Issue: ${item.reportedIssue}`, itemX, itemY, { width: 490 })
            .fillColor("#000")
            .fontSize(9);
        }

        itemY += item.reportedIssue ? 35 : 20;
      });

      // Line after items
      doc.moveTo(50, itemY).lineTo(545, itemY).strokeColor("#E5E5E5").lineWidth(1).stroke();

      // Payment Summary - Stripe style
      doc.moveDown(4);
      const summaryY = doc.y;
      const balance = (bookingData.payableAmount || 0) - (bookingData.paidAmount || 0);

      // Right-aligned summary
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666")
        .text("Total", 380, summaryY)
        .fillColor("#000")
        .text(`Rs. ${(bookingData.payableAmount || 0).toLocaleString()}`, 480, summaryY, { width: 65, align: "right" });

      doc
        .fillColor("#666")
        .text("Paid", 380, summaryY + 18)
        .fillColor("#000")
        .text(`Rs. ${(bookingData.paidAmount || 0).toLocaleString()}`, 480, summaryY + 18, { width: 65, align: "right" });

      // Line before final amount
      doc.moveTo(380, summaryY + 34).lineTo(545, summaryY + 34).strokeColor("#E5E5E5").lineWidth(1).stroke();

      // Show "Amount Due" if balance > 0, otherwise show "Total Paid"
      const finalLabel = balance > 0 ? "Amount Due" : "Total Paid";
      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("#000")
        .text(finalLabel, 380, summaryY + 42)
        .text(`Rs. ${balance > 0 ? balance.toLocaleString() : (bookingData.paidAmount || 0).toLocaleString()}`, 480, summaryY + 42, { width: 65, align: "right" });

      // Footer with warranty terms and contact info
      await generateFooter(doc);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generates an invoice PDF for a booking (only if payment is made)
 */
export const generateInvoice = async (bookingData: BookingData): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if there are any paid payments
      const paidPayments = bookingData.booking_payments.filter((p) => p.status === "PAID");

      if (paidPayments.length === 0) {
        return reject(new Error("Cannot generate invoice: No paid payments found for this booking"));
      }

      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks: Uint8Array[] = [];

      doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
      doc.on("end", () => {
        // Calculate total length
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        // Create a single buffer
        const result = Buffer.allocUnsafe(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }
        resolve(result);
      });
      doc.on("error", reject);

      // Logo (use process.cwd() for correct path in both dev and production)
      const logoPath = path.join(process.cwd(), "public/assets/logos/logo.png");
      const hasLogo = fs.existsSync(logoPath);

      // Simple header - Stripe style
      if (hasLogo) {
        doc.image(logoPath, 50, 45, { width: 60 });
      }

      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .fillColor("#000")
        .text("GPU SAVIORS", hasLogo ? 125 : 50, 50, { align: hasLogo ? "left" : "center" })
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666")
        .text("Professional GPU Repair Services", hasLogo ? 125 : 50, 72, { align: hasLogo ? "left" : "center" });

      // Invoice label on the right
      doc
        .fontSize(14)
        .font("Helvetica")
        .fillColor("#000")
        .text("Invoice", 450, 55, { width: 95, align: "right" })
        .fillColor("#000");

      // Thin separator line
      doc.moveDown(1.5);
      const lineY = doc.y;
      doc.moveTo(50, lineY).lineTo(545, lineY).strokeColor("#E5E5E5").lineWidth(1).stroke();

      doc.moveDown(1.5);

      // Booking Code - Simple box
      const bookingCode = bookingData.code || bookingData.id.toString();
      const codeBoxY = doc.y;

      // Light background box
      doc.rect(50, codeBoxY, 495, 45).fill("#F7F7F7");

      // Booking code text
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#666")
        .text("BOOKING CODE", 60, codeBoxY + 8)
        .fontSize(14)
        .fillColor("#000")
        .font("Helvetica-Bold")
        .text(bookingCode, 60, codeBoxY + 22);

      // Important notice - subtle
      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor("#666")
        .text("Save this code for tracking and support", 300, codeBoxY + 25)
        .fillColor("#000");

      doc.moveDown(3);

      // Invoice information - Simple layout
      const infoY = doc.y;
      doc
        .fontSize(9)
        .fillColor("#666")
        .text("Invoice No", 50, infoY)
        .fillColor("#000")
        .font("Helvetica")
        .text(`INV-${bookingCode}`, 50, infoY + 12);

      doc
        .fontSize(9)
        .fillColor("#666")
        .text("Date", 200, infoY)
        .fillColor("#000")
        .font("Helvetica")
        .text(new Date().toLocaleDateString(), 200, infoY + 12);

      doc
        .fontSize(9)
        .fillColor("#666")
        .text("Status", 350, infoY)
        .fillColor("#000")
        .font("Helvetica")
        .text(bookingData.status, 350, infoY + 12);

      doc.moveDown(2);

      // Bill To - Clean layout
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#000")
        .text("Bill To", 50)
        .moveDown(0.5);

      const billY = doc.y;
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666")
        .text("Name", 50, billY)
        .fillColor("#000")
        .text(bookingData.clientName, 50, billY + 12)
        .fillColor("#666")
        .text("Phone", 280, billY)
        .fillColor("#000")
        .text(bookingData.phoneNumber, 280, billY + 12);

      doc.moveDown(2);

      const billY2 = doc.y;
      doc
        .fillColor("#666")
        .text("WhatsApp", 50, billY2)
        .fillColor("#000")
        .text(bookingData.whatsappNumber, 50, billY2 + 12)
        .fillColor("#666")
        .text("Type", 280, billY2)
        .fillColor("#000")
        .text(bookingData.clientType, 280, billY2 + 12);

      doc.moveDown(3);

      // Items Section - Clean table
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#000")
        .text("Items", 50)
        .moveDown(0.5);

      // Simple table header with line
      const tableTop = doc.y;
      const itemX = 50;
      const typeX = 200;
      const serialX = 300;
      const amountX = 480;

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666")
        .text("Item", itemX, tableTop)
        .text("Type", typeX, tableTop)
        .text("Serial #", serialX, tableTop)
        .text("Amount", amountX, tableTop, { width: 65, align: "right" });

      // Line under header
      doc.moveTo(50, tableTop + 15).lineTo(545, tableTop + 15).strokeColor("#E5E5E5").lineWidth(1).stroke();

      // Table rows - clean
      let itemY = tableTop + 25;
      doc.font("Helvetica").fontSize(9).fillColor("#000");

      bookingData.booking_items.forEach((item) => {
        if (itemY > 650) {
          doc.addPage();
          itemY = 50;
        }

        doc
          .fillColor("#000")
          .text(item.name, itemX, itemY, { width: 140 })
          .text(item.type, typeX, itemY)
          .fillColor("#666")
          .text(item.serialNumber || "—", serialX, itemY, { width: 140 })
          .fillColor("#000")
          .text(`Rs. ${item.payableAmount.toLocaleString()}`, amountX, itemY, { width: 65, align: "right" });

        if (item.reportedIssue) {
          itemY += 15;
          doc
            .fontSize(8)
            .fillColor("#666")
            .text(`Service: ${item.reportedIssue}`, itemX, itemY, { width: 490 })
            .fillColor("#000")
            .fontSize(9);
        }

        itemY += item.reportedIssue ? 35 : 20;
      });

      // Line after items
      doc.moveTo(50, itemY).lineTo(545, itemY).strokeColor("#E5E5E5").lineWidth(1).stroke();

      // Payment details - Simple list
      doc.moveDown(2);
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#000")
        .text("Payments", 50)
        .moveDown(0.5);

      paidPayments.forEach((payment) => {
        const paymentY = doc.y;
        doc
          .fontSize(9)
          .font("Helvetica")
          .fillColor("#666")
          .text(new Date(payment.createdAt).toLocaleDateString(), 50, paymentY)
          .text(payment.paymentMethod, 150, paymentY)
          .fillColor("#000")
          .text(`Rs. ${(payment.paidAmount || 0).toLocaleString()}`, 280, paymentY);

        doc.moveDown(0.8);
      });

      // Payment Summary - Stripe style
      doc.moveDown(1);
      const summaryY = doc.y;
      const totalPaid = paidPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
      const balance = (bookingData.payableAmount || 0) - totalPaid;

      // Right-aligned summary
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#666")
        .text("Subtotal", 380, summaryY)
        .fillColor("#000")
        .text(`Rs. ${(bookingData.payableAmount || 0).toLocaleString()}`, 480, summaryY, { width: 65, align: "right" });

      doc
        .fillColor("#666")
        .text("Paid", 380, summaryY + 18)
        .fillColor("#000")
        .text(`Rs. ${totalPaid.toLocaleString()}`, 480, summaryY + 18, { width: 65, align: "right" });

      // Line before final amount
      doc.moveTo(380, summaryY + 34).lineTo(545, summaryY + 34).strokeColor("#E5E5E5").lineWidth(1).stroke();

      // Show "Amount Due" if balance > 0, otherwise show "Total Paid"
      const finalLabel = balance > 0 ? "Amount Due" : "Total Paid";
      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("#000")
        .text(finalLabel, 380, summaryY + 42)
        .text(`Rs. ${balance > 0 ? balance.toLocaleString() : totalPaid.toLocaleString()}`, 480, summaryY + 42, { width: 65, align: "right" });

      // Footer with warranty terms and contact info
      await generateFooter(doc);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
