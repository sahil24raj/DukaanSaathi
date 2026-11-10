export interface PrintReceiptOptions {
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  cashierName?: string;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
  gstin?: string;
  fssai?: string;
}

export function formatReceiptDate(isoString?: string): string {
  try {
    const d = isoString ? new Date(isoString) : new Date();
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ', ' + d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return new Date().toLocaleString('en-IN');
  }
}

export function generateReceiptHtml(order: any, options: PrintReceiptOptions = {}): string {
  const storeName = options.storeName || 'DUKAAN SAATHI • दुकान साथी';
  const storeSubtitle = 'स्मार्ट किराना एवं जनरल स्टोर (Kirana Store)';
  const storeAddress = options.storeAddress || 'मेन बाजार, गांधी चौक, नियर सेंट्रल बैंक';
  const storePhone = options.storePhone || '+91 98765 43210';
  const gstin = options.gstin || '07AAECD1234F1Z5';
  const fssai = options.fssai || '10019022009876';
  const orderId = order.id || Math.floor(1000 + Math.random() * 9000);
  const dateFormatted = formatReceiptDate(order.created_at);
  const customerName = options.customerName || order.customer_name || 'Walk-in Customer (नकद ग्राहक)';
  const paymentMethod = (options.paymentMethod || order.payment_method || 'CASH').toUpperCase();
  const cashier = options.cashierName || 'Counter #1 (Voice POS)';

  const items = Array.isArray(order.items) ? order.items : [];
  const grandTotal = Number(order.total_amount || order.total || 0);
  const subtotal = Math.round(grandTotal / 1.05);
  const gstAmount = grandTotal - subtotal;
  const totalQty = items.reduce((acc: number, it: any) => acc + (Number(it.quantity) || 1), 0);

  const itemsRowsHtml = items.map((it: any, idx: number) => {
    const name = it.matched_product || it.product_name || it.raw_item || `सामान #${idx + 1}`;
    const qty = it.quantity || 1;
    const unit = it.unit || 'नग';
    const rate = Number(it.unit_price || Math.round((it.line_total || 0) / (qty || 1)) || 0);
    const lineTotal = Number(it.line_total || Math.round(qty * rate) || 0);

    return `
      <tr>
        <td style="padding: 3px 0; text-align: left; vertical-align: top;">
          <div style="font-weight: 700; font-size: 11px; color: #000;">${idx + 1}. ${name}</div>
          <div style="font-size: 9.5px; color: #444;">${qty} ${unit} × ₹${rate}</div>
        </td>
        <td style="padding: 3px 0; text-align: right; vertical-align: top; font-weight: 700; font-size: 11px; white-space: nowrap;">
          ₹${lineTotal}
        </td>
      </tr>
    `;
  }).join('');

  const transcriptSection = order.customer_transcript ? `
    <div style="margin: 6px 0; padding: 4px; border: 1px dashed #666; background: #fafafa; font-size: 9.5px; border-radius: 3px;">
      <span style="font-weight: 700; color: #333;">ग्राहक की आवाज़ (Voice Input):</span><br/>
      <span style="font-style: italic; color: #111;">&ldquo;${order.customer_transcript}&rdquo;</span>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt #DS-${orderId} - Dukaan Saathi</title>
  <style>
    @page {
      size: 80mm auto;
      margin: 3mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Courier New", Courier, monospace;
      width: 74mm;
      max-width: 74mm;
      margin: 0 auto;
      padding: 6px 4px;
      color: #000000;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.25;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .divider {
      border-top: 1px dashed #000;
      margin: 5px 0;
    }
    .double-divider {
      border-top: 2px solid #000;
      margin: 5px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    .barcode {
      letter-spacing: 5px;
      font-size: 14px;
      font-weight: 900;
      margin: 4px 0 2px 0;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="text-center">
    <div style="font-size: 15px; font-weight: 900; letter-spacing: 0.5px; color: #000;">
      ${storeName}
    </div>
    <div style="font-size: 10px; font-weight: 700; margin-top: 1px; color: #222;">
      ${storeSubtitle}
    </div>
    <div style="font-size: 9px; color: #333; margin-top: 2px; line-height: 1.3;">
      ${storeAddress}<br/>
      फोन: ${storePhone}
    </div>
    <div style="font-size: 8.5px; color: #444; margin-top: 2px;">
      GSTIN: <strong>${gstin}</strong> • FSSAI: <strong>${fssai}</strong>
    </div>
  </div>

  <div class="divider"></div>

  <!-- Tax Invoice Header -->
  <div class="text-center" style="font-size: 11px; font-weight: 900; letter-spacing: 1px;">
    *** टैक्स इनवॉइस / TAX INVOICE ***
  </div>

  <div class="divider"></div>

  <!-- Metadata -->
  <div style="font-size: 10px; line-height: 1.4;">
    <div style="display: flex; justify-content: space-between;">
      <span>रसीद नं: <strong>#DS-${orderId}</strong></span>
      <span>काउंटर: <strong>${cashier}</strong></span>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span>दिनांक: ${dateFormatted}</span>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span>ग्राहक: <strong>${customerName}</strong></span>
      <span>भुगतान: <strong style="border: 1px solid #000; padding: 0 3px;">${paymentMethod}</strong></span>
    </div>
  </div>

  ${transcriptSection}

  <div class="double-divider"></div>

  <!-- Items Table -->
  <table>
    <thead>
      <tr style="border-bottom: 1px dashed #000; font-size: 10px; font-weight: 800;">
        <th style="text-align: left; padding-bottom: 3px;">सामान विवरण (Item)</th>
        <th style="text-align: right; padding-bottom: 3px;">रुपये (Amt)</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRowsHtml}
    </tbody>
  </table>

  <div class="double-divider"></div>

  <!-- Financial Totals -->
  <div style="font-size: 10.5px; line-height: 1.4;">
    <div style="display: flex; justify-content: space-between;">
      <span>उप-कुल (Subtotal):</span>
      <span style="font-weight: 600;">₹${subtotal}</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #333;">
      <span>CGST (2.5%):</span>
      <span>₹${(gstAmount / 2).toFixed(1)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #333;">
      <span>SGST (2.5%):</span>
      <span>₹${(gstAmount / 2).toFixed(1)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: #555;">
      <span>कुल सामान (Items/Qty):</span>
      <span>${items.length} सामान (${totalQty} मात्रा)</span>
    </div>

    <!-- Grand Total Box -->
    <div style="margin: 5px 0; padding: 4px 6px; border: 1.5px solid #000; display: flex; justify-content: space-between; align-items: center; background: #f3f4f6;">
      <span style="font-size: 12px; font-weight: 900;">कुल देय राशि (TOTAL):</span>
      <span style="font-size: 15px; font-weight: 900;">₹${grandTotal}</span>
    </div>
  </div>

  <!-- UPI QR & Barcode Simulation -->
  <div class="text-center" style="margin-top: 6px;">
    <div style="display: inline-block; padding: 4px; border: 1.5px solid #000; border-radius: 4px; margin-bottom: 2px;">
      <div style="font-size: 8px; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 1px;">UPI QR SCAN & PAY</div>
      <div style="width: 58px; height: 58px; margin: 0 auto; background: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50%/10px 10px; border: 2px solid #000;"></div>
      <div style="font-size: 7.5px; font-weight: 700; margin-top: 2px;">dukaansaathi@upi</div>
    </div>

    <div class="barcode">||| | | |||| || | || |||</div>
    <div style="font-size: 8px; color: #555;">*DS-${orderId}-IN*</div>
  </div>

  <div class="divider"></div>

  <!-- Footer -->
  <div class="text-center" style="font-size: 9.5px; line-height: 1.3; color: #222;">
    <div style="font-weight: 900; font-size: 11px;">*** धन्यवाद! फिर पधारें! ***</div>
    <div style="font-size: 8.5px; color: #444; margin-top: 2px;">
      सस्ता, शुद्ध और भरोसेमंद किराना<br/>
      (बिका हुआ माल 7 दिनों के अंदर रसीद के साथ बदला जा सकता है)
    </div>
    <div style="margin-top: 4px; font-size: 8px; color: #555; border-top: 1px dotted #888; padding-top: 3px;">
      Powered by <strong>Dukaan Saathi (दुकान साथी)</strong> • 100% Indian Retail AI
    </div>
    <div style="margin-top: 3px; font-size: 7.5px; color: #888;">
      ----------------- CUT HERE (यहाँ से फाड़ें) -----------------
    </div>
  </div>
</body>
</html>`;
}

/**
 * Gold-standard thermal receipt printing using a dedicated hidden iframe.
 * Prevents blank page bugs, media query CSS pollution, and modal overflows.
 */
export function printThermalSlip(order: any, options: PrintReceiptOptions = {}) {
  try {
    const html = generateReceiptHtml(order, options);

    // Remove existing print frame if any
    const existing = document.getElementById('dukaan-thermal-print-frame');
    if (existing) {
      existing.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'dukaan-thermal-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    // Allow iframe styles and images to settle before triggering print dialog
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.warn('Iframe print failed, falling back to window.print():', err);
        window.print();
      }
    }, 250);
  } catch (err) {
    console.error('printThermalSlip error:', err);
    window.print();
  }
}

/**
 * Generate formatted WhatsApp message for sending receipt directly to customer's phone
 */
export function generateWhatsAppMessage(order: any, options: PrintReceiptOptions = {}): string {
  const storeName = options.storeName || 'Dukaan Saathi (दुकान साथी)';
  const orderId = order.id || 'N/A';
  const date = formatReceiptDate(order.created_at);
  const items = Array.isArray(order.items) ? order.items : [];
  const grandTotal = Number(order.total_amount || order.total || 0);

  let msg = `🏪 *${storeName}*\n`;
  msg += `🧾 *रसीद नं:* #DS-${orderId}\n`;
  msg += `📅 *दिनांक:* ${date}\n`;
  msg += `--------------------------------\n`;
  msg += `*सामान विवरण (Items):*\n`;

  items.forEach((it: any, idx: number) => {
    const name = it.matched_product || it.product_name || it.raw_item || `Item #${idx + 1}`;
    const qty = it.quantity || 1;
    const unit = it.unit || 'नग';
    const total = it.line_total || Math.round(qty * (it.unit_price || 0));
    msg += `${idx + 1}. ${name} - ${qty} ${unit} = ₹${total}\n`;
  });

  msg += `--------------------------------\n`;
  msg += `💰 *कुल देय राशि (Total): ₹${grandTotal}*\n`;
  msg += `💳 *भुगतान प्रकार:* ${(options.paymentMethod || order.payment_method || 'CASH').toUpperCase()}\n`;
  msg += `--------------------------------\n`;
  msg += `🙏 *धन्यवाद! फिर पधारें!*\n`;
  msg += `_Powered by Dukaan Saathi POS_`;

  return msg;
}
