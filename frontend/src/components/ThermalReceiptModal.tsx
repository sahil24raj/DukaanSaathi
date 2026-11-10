import React from 'react';
import { X, Printer, Share2, Store } from 'lucide-react';
import { printThermalSlip, generateWhatsAppMessage, formatReceiptDate } from '../utils/thermalReceipt';

interface ThermalReceiptModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
  paymentMethod?: string;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
  customerName,
  paymentMethod = 'CASH'
}) => {
  if (!isOpen || !order) return null;

  const items = Array.isArray(order.items) ? order.items : [];
  const grandTotal = Number(order.total_amount || order.total || 0);
  const subtotal = Math.round(grandTotal / 1.05);
  const gstAmount = grandTotal - subtotal;
  const totalQty = items.reduce((acc: number, it: any) => acc + (Number(it.quantity) || 1), 0);
  const dateFormatted = formatReceiptDate(order.created_at);
  const displayCustomer = customerName || order.customer_name || 'Walk-in Customer (नकद)';
  const displayPayment = (paymentMethod || order.payment_method || 'CASH').toUpperCase();

  const handlePrint = () => {
    printThermalSlip(order, {
      customerName: displayCustomer,
      paymentMethod: displayPayment
    });
  };

  const handleWhatsApp = () => {
    const text = generateWhatsAppMessage(order, {
      customerName: displayCustomer,
      paymentMethod: displayPayment
    });
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-md my-auto">
        
        {/* Top Floating Control Bar */}
        <div className="flex items-center justify-between bg-zinc-900 border border-white/10 rounded-t-2xl px-4 py-3 text-white shadow-xl">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm">रसीद पूर्वावलोकन (Thermal Receipt)</h3>
              <p className="text-[10px] text-zinc-400">80mm POS Roll Format • Order #{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Realistic Thermal Paper Slip */}
        <div className="bg-white text-black p-5 sm:p-6 shadow-2xl font-mono text-xs select-text border-x border-zinc-300">
          
          {/* Header Branding */}
          <div className="text-center space-y-0.5">
            <h2 className="text-base sm:text-lg font-black tracking-tight text-black">
              DUKAAN SAATHI • दुकान साथी
            </h2>
            <p className="text-[11px] font-bold text-zinc-800">
              स्मार्ट किराना एवं जनरल स्टोर
            </p>
            <p className="text-[10px] text-zinc-600 leading-tight">
              मेन बाजार, गांधी चौक, नियर सेंट्रल बैंक<br/>
              फोन: +91 98765 43210
            </p>
            <p className="text-[9px] text-zinc-500 pt-0.5">
              GSTIN: <strong>07AAECD1234F1Z5</strong> • FSSAI: <strong>10019022009876</strong>
            </p>
          </div>

          <div className="border-t border-dashed border-black my-3" />

          {/* Tax Invoice Banner */}
          <div className="text-center font-black text-xs tracking-wider">
            *** टैक्स इनवॉइस / TAX INVOICE ***
          </div>

          <div className="border-t border-dashed border-black my-2.5" />

          {/* Receipt Metadata */}
          <div className="text-[10.5px] space-y-1 text-zinc-800">
            <div className="flex justify-between">
              <span>रसीद नं: <strong className="text-black">#DS-{order.id}</strong></span>
              <span>काउंटर: <strong>Counter #1 (Voice POS)</strong></span>
            </div>
            <div className="flex justify-between">
              <span>दिनांक: {dateFormatted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>ग्राहक: <strong className="text-black">{displayCustomer}</strong></span>
              <span className="border border-black px-1.5 py-0.2 text-[9.5px] font-bold">
                {displayPayment}
              </span>
            </div>
          </div>

          {/* Voice Transcript (if present) */}
          {order.customer_transcript && (
            <div className="mt-2.5 p-2 bg-zinc-100 border border-dashed border-zinc-400 rounded text-[10px] text-zinc-700">
              <span className="font-bold block text-zinc-900">ग्राहक की आवाज़ (Voice Input):</span>
              <span className="italic font-sans">&ldquo;{order.customer_transcript}&rdquo;</span>
            </div>
          )}

          <div className="border-t-2 border-black my-3" />

          {/* Items Table */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dashed border-black text-[10px] font-black uppercase">
                <th className="pb-1">सामान विवरण (Item)</th>
                <th className="pb-1 text-right">रुपये (Amt)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-zinc-200">
              {items.map((it: any, idx: number) => {
                const name = it.matched_product || it.product_name || it.raw_item || `सामान #${idx + 1}`;
                const qty = it.quantity || 1;
                const unit = it.unit || 'नग';
                const rate = Number(it.unit_price || Math.round((it.line_total || 0) / (qty || 1)) || 0);
                const lineTotal = Number(it.line_total || Math.round(qty * rate) || 0);

                return (
                  <tr key={idx} className="text-[11px]">
                    <td className="py-1.5 pr-2">
                      <div className="font-bold text-black">{idx + 1}. {name}</div>
                      <div className="text-[9.5px] text-zinc-600 font-sans">{qty} {unit} × ₹{rate}</div>
                    </td>
                    <td className="py-1.5 text-right font-bold text-black whitespace-nowrap">
                      ₹{lineTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="border-t-2 border-black my-3" />

          {/* Breakdown & Grand Total */}
          <div className="space-y-1 text-[11px] text-zinc-800">
            <div className="flex justify-between">
              <span>उप-कुल (Subtotal):</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-600">
              <span>CGST (2.5%):</span>
              <span>₹{(gstAmount / 2).toFixed(1)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-600">
              <span>SGST (2.5%):</span>
              <span>₹{(gstAmount / 2).toFixed(1)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-zinc-600">
              <span>कुल सामान (Total Items):</span>
              <span>{items.length} सामान ({totalQty} मात्रा)</span>
            </div>

            {/* Total Highlight */}
            <div className="my-2.5 p-2 bg-zinc-100 border-2 border-black flex justify-between items-center text-black">
              <span className="font-black text-xs uppercase">कुल राशि (TOTAL):</span>
              <span className="font-black text-base">₹{grandTotal}</span>
            </div>
          </div>

          {/* UPI QR & Barcode */}
          <div className="text-center my-3 pt-1">
            <div className="inline-block p-2 border-2 border-black rounded">
              <div className="text-[8px] font-black uppercase tracking-wider mb-1">UPI QR SCAN & PAY</div>
              <div className="w-14 h-14 mx-auto border border-black bg-zinc-100 flex items-center justify-center font-bold text-[8px] text-zinc-500">
                [ QR CODE ]
              </div>
              <div className="text-[8px] font-bold mt-1 text-zinc-700">dukaansaathi@upi</div>
            </div>

            <div className="font-mono font-black text-xs tracking-widest mt-2">
              ||| | | |||| || | || |||
            </div>
            <div className="text-[8px] text-zinc-500">*DS-{order.id}-IN*</div>
          </div>

          <div className="border-t border-dashed border-black my-2.5" />

          {/* Footer Notes */}
          <div className="text-center space-y-1 text-[9px] text-zinc-600">
            <div className="font-black text-[10.5px] text-black">*** धन्यवाद! फिर पधारें! ***</div>
            <p>सस्ता, शुद्ध और भरोसेमंद किराना • सामान 7 दिन में रसीद के साथ बदला जा सकता है</p>
            <p className="font-bold text-zinc-700 pt-1">
              Powered by Dukaan Saathi • 100% Indian Retail AI
            </p>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-zinc-900 border border-white/10 rounded-b-2xl p-4 flex flex-wrap gap-2.5 shadow-2xl">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg shadow-emerald-950/60"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>थर्मल पर्चा प्रिंट करें</span>
          </button>
          
          <button
            onClick={handleWhatsApp}
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-98 text-emerald-400 border border-emerald-500/30 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp रसीद</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white font-semibold text-xs transition cursor-pointer"
          >
            बंद करें (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
