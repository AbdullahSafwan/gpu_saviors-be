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
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#000")
      .text("WARRANTY TERMS & CONDITIONS", 50, termsY);

    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#333")
      .text(warrantyTerms, 50, termsY + 15, { width: 500, align: "justify" })
      .fillColor("#000");
  }

  // Footer
  const footerY = warrantyTerms ? doc.y + 20 : 750;
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor("#666")
    .text("Thank you for your business!", 50, footerY, { align: "center" })
    .text("GPU Saviors - Professional GPU Repair Services", 50, footerY + 15, { align: "center" });

  // Contact information
  if (customerSupportPhone) {
    doc.text(`Customer Support: ${customerSupportPhone}`, 50, footerY + 30, { align: "center" });
  }

  doc
    .text("Visit us: https://www.facebook.com/gpusaviors", 50, customerSupportPhone ? footerY + 45 : footerY + 30, { align: "center" })
    .fillColor("#000");
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

      // Logo path
      const logoPath = path.join(__dirname, "../../../public/assets/logos/logo.png");
      const hasLogo = fs.existsSync(logoPath);

      // Header with logo
      if (hasLogo) {
        doc.image(logoPath, 50, 45, { width: 100 });
      }

      doc
        .fontSize(20)
        .text("GPU SAVIORS", hasLogo ? 160 : 50, 50, { align: hasLogo ? "left" : "center" })
        .fontSize(10)
        .text("Booking Receipt", hasLogo ? 160 : 50, 75, { align: hasLogo ? "left" : "center" });

      doc.moveDown(2);
      const topY = doc.y;

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("RECEIPT", 50, topY)
        .font("Helvetica")
        .fontSize(10);

      doc.moveDown(0.5);

      // Receipt Information
      doc
        .text(`Receipt No: ${bookingData.code || bookingData.id}`, 50)
        .text(`Date: ${new Date(bookingData.createdAt).toLocaleDateString()}`)
        .text(`Status: ${bookingData.status}`);

      doc.moveDown(1);

      // Customer Information
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("CUSTOMER INFORMATION", 50)
        .font("Helvetica")
        .fontSize(10)
        .moveDown(0.5);

      doc
        .text(`Name: ${bookingData.clientName}`)
        .text(`Phone: ${bookingData.phoneNumber}`)
        .text(`WhatsApp: ${bookingData.whatsappNumber}`)
        .text(`Type: ${bookingData.clientType}`);

      doc.moveDown(1);

      // Items Table
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("ITEMS", 50)
        .moveDown(0.5);

      // Table header
      const tableTop = doc.y;
      const itemX = 50;
      const typeX = 200;
      const serialX = 300;
      const amountX = 450;

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Item", itemX, tableTop)
        .text("Type", typeX, tableTop)
        .text("Serial #", serialX, tableTop)
        .text("Amount", amountX, tableTop);

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // Table rows
      let itemY = tableTop + 25;
      doc.font("Helvetica").fontSize(9);

      bookingData.booking_items.forEach((item) => {
        if (itemY > 700) {
          doc.addPage();
          itemY = 50;
        }

        doc
          .text(item.name, itemX, itemY, { width: 140 })
          .text(item.type, typeX, itemY)
          .text(item.serialNumber || "N/A", serialX, itemY, { width: 140 })
          .text(`Rs. ${item.payableAmount.toLocaleString()}`, amountX, itemY);

        if (item.reportedIssue) {
          itemY += 15;
          doc.fontSize(8).fillColor("#666").text(`Issue: ${item.reportedIssue}`, itemX + 10, itemY, { width: 490 }).fillColor("#000").fontSize(9);
        }

        itemY += 25;
      });

      // Payment Summary
      doc.moveDown(2);
      const summaryY = doc.y;

      doc.moveTo(350, summaryY).lineTo(550, summaryY).stroke();

      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Total Amount:", 350, summaryY + 10)
        .font("Helvetica-Bold")
        .text(`Rs. ${(bookingData.payableAmount || 0).toLocaleString()}`, amountX, summaryY + 10);

      doc
        .font("Helvetica")
        .text("Amount Paid:", 350, summaryY + 30)
        .font("Helvetica-Bold")
        .fillColor("#27ae60")
        .text(`Rs. ${(bookingData.paidAmount || 0).toLocaleString()}`, amountX, summaryY + 30)
        .fillColor("#000");

      const balance = (bookingData.payableAmount || 0) - (bookingData.paidAmount || 0);
      doc
        .font("Helvetica")
        .text("Balance:", 350, summaryY + 50)
        .font("Helvetica-Bold")
        .fillColor(balance > 0 ? "#e74c3c" : "#27ae60")
        .text(`Rs. ${balance.toLocaleString()}`, amountX, summaryY + 50)
        .fillColor("#000");

      doc.moveTo(350, summaryY + 70).lineTo(550, summaryY + 70).stroke();

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

      // Logo
      const logoPath = path.join(__dirname, "../../../public/assets/logos/logo.png");
      const hasLogo = fs.existsSync(logoPath);

      if (hasLogo) {
        doc.image(logoPath, 50, 45, { width: 100 });
      }

      // Header
      doc
        .fontSize(20)
        .text("GPU SAVIORS", hasLogo ? 160 : 50, 50, { align: hasLogo ? "left" : "center" })
        .fontSize(10)
        .text("Payment Invoice", hasLogo ? 160 : 50, 75, { align: hasLogo ? "left" : "center" });

      doc.moveDown(2);
      const topY = doc.y;

      // Invoice details
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("INVOICE", 50, topY)
        .font("Helvetica")
        .fontSize(10);

      doc.moveDown(0.5);

      doc
        .text(`Invoice No: INV-${bookingData.code || bookingData.id}`, 50)
        .text(`Date: ${new Date().toLocaleDateString()}`)
        .text(`Booking Status: ${bookingData.status}`);

      // Bill To
      doc.moveDown(1);
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("BILL TO", 50)
        .font("Helvetica")
        .fontSize(10)
        .moveDown(0.5);

      doc
        .text(bookingData.clientName)
        .text(`Phone: ${bookingData.phoneNumber}`)
        .text(`WhatsApp: ${bookingData.whatsappNumber}`)
        .text(`Customer Type: ${bookingData.clientType}`);

      doc.moveDown(1);

      // Items table
      doc.fontSize(12).font("Helvetica-Bold").text("SERVICES / ITEMS", 50).moveDown(0.5);

      const tableTop = doc.y;
      const itemX = 50;
      const typeX = 200;
      const serialX = 300;
      const amountX = 450;

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Item", itemX, tableTop)
        .text("Type", typeX, tableTop)
        .text("Serial #", serialX, tableTop)
        .text("Amount", amountX, tableTop);

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      let itemY = tableTop + 25;
      doc.font("Helvetica").fontSize(9);

      bookingData.booking_items.forEach((item) => {
        if (itemY > 650) {
          doc.addPage();
          itemY = 50;
        }

        doc
          .text(item.name, itemX, itemY, { width: 140 })
          .text(item.type, typeX, itemY)
          .text(item.serialNumber || "N/A", serialX, itemY, { width: 140 })
          .text(`Rs. ${item.payableAmount.toLocaleString()}`, amountX, itemY);

        if (item.reportedIssue) {
          itemY += 15;
          doc.fontSize(8).fillColor("#666").text(`Service: ${item.reportedIssue}`, itemX + 10, itemY, { width: 490 }).fillColor("#000").fontSize(9);
        }

        itemY += 25;
      });

      // Payment details
      doc.moveDown(2);
      let summaryY = doc.y;

      doc.fontSize(12).font("Helvetica-Bold").text("PAYMENT DETAILS", 50).font("Helvetica").fontSize(9).moveDown(0.5);

      paidPayments.forEach((payment) => {
        doc
          .text(`Payment Date: ${new Date(payment.createdAt).toLocaleDateString()}`)
          .text(`Method: ${payment.paymentMethod}`)
          .text(`Amount: Rs. ${(payment.paidAmount || 0).toLocaleString()}`)
          .moveDown(0.5);
      });

      // Summary
      summaryY = doc.y + 20;
      doc.moveTo(350, summaryY).lineTo(550, summaryY).stroke();

      const totalPaid = paidPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Subtotal:", 350, summaryY + 10)
        .font("Helvetica-Bold")
        .text(`Rs. ${(bookingData.payableAmount || 0).toLocaleString()}`, amountX, summaryY + 10);

      doc
        .font("Helvetica")
        .text("Total Paid:", 350, summaryY + 30)
        .font("Helvetica-Bold")
        .fillColor("#27ae60")
        .text(`Rs. ${totalPaid.toLocaleString()}`, amountX, summaryY + 30)
        .fillColor("#000");

      const balance = (bookingData.payableAmount || 0) - totalPaid;
      if (balance > 0) {
        doc
          .font("Helvetica")
          .text("Outstanding:", 350, summaryY + 50)
          .font("Helvetica-Bold")
          .fillColor("#e74c3c")
          .text(`Rs. ${balance.toLocaleString()}`, amountX, summaryY + 50)
          .fillColor("#000");
      }

      doc.moveTo(350, summaryY + 70).lineTo(550, summaryY + 70).stroke();

      // Footer with warranty terms and contact info
      await generateFooter(doc);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
