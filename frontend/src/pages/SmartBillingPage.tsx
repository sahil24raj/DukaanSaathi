import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product, Order, CustomerUdhaarRecord } from '../types';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  User, 
  Check, 
  ShoppingBag,
  Receipt,
  ArrowRight,
  RotateCcw,
  Share2,
  QrCode,
  Copy,
  CheckCheck
} from 'lucide-react';

interface SmartBillingPageProps {
  onOrderSaved?: () => void;
}

export const SmartBillingPage: React.FC<SmartBillingPageProps> = ({ onOrderSaved }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'udhaar'>('cash');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [applyGst, setApplyGst] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [khataCustomers, setKhataCustomers] = useState<CustomerUdhaarRecord[]>([]);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const prods = await api.getProducts();
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };
    fetchCatalog();
    setKhataCustomers(api.getKhataCustomers());
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.hindi_name && p.hindi_name.includes(search)) ||
    p.aliases.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setDiscountPercent(0);
    setApplyGst(false);
  };

  // Pricing calculations
  const subtotal = cart.reduce(
    (acc, it) => acc + Math.round(it.quantity * it.product.price),
    0
  );
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxable = subtotal - discountAmount;
  const gstAmount = applyGst ? Math.round(taxable * 0.05) : 0;
  const grandTotal = taxable + gstAmount;

  const handleShareWhatsApp = (order: Order) => {
    const itemsText = order.items.map(it => `• ${it.matched_product || it.raw_item} (${it.quantity} ${it.unit}) - ₹${it.line_total}`).join('%0A');
    const msg = `🏪 *दुकान साथी - किराना बिल रसीद*%0A*ऑर्डर नं:* %23${order.id}%0A*ग्राहक:* ${order.customer_name || 'काउंटर ग्राहक'}%0A*भुगतान:* ${paymentMethod.toUpperCase()}%0A----------------------%0A${itemsText}%0A----------------------%0A*कुल योग (Total):* ₹${order.total_amount}%0A%0A_दुकान साथी द्वारा जनरेटेड | धन्यवाद, फिर आएं!_`;
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('dukaansaathi@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Checkout submission
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const orderItems = cart.map(it => ({
        raw_item: it.product.name,
        matched_product: it.product.name,
        quantity: it.quantity,
        unit: it.product.unit,
        unit_price: it.product.price,
        line_total: Math.round(it.quantity * it.product.price),
        in_stock: it.product.stock >= it.quantity,
        available_stock: it.product.stock
      }));

      const transcriptDesc = customerName 
        ? `POS Counter Bill for ${customerName} (${paymentMethod.toUpperCase()})`
        : `POS Counter Bill (${paymentMethod.toUpperCase()})`;

      const hindiResponse = `Aapka kul bill ₹${grandTotal} hua. Shukriya!`;

      const saved = await api.createOrder({
        customer_name: customerName.trim() || undefined,
        customer_phone: customerPhone.trim() || undefined,
        payment_method: paymentMethod,
        discount: discountAmount,
        gst: gstAmount,
        customer_transcript: transcriptDesc,
        hindi_response: hindiResponse,
        items: orderItems
      });

      setCompletedOrder(saved);
      // Refresh catalog in background to show decremented stock
      api.getProducts().then(setProducts);
      clearCart();
      if (onOrderSaved) onOrderSaved();
    } catch (err: any) {
      alert(`बिल दर्ज करने में त्रुटि: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Receipt className="w-3.5 h-3.5" />
            <span>हाई-स्पीड POS काउंटर • 5-Second POS Station</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            स्मार्ट बिलिंग काउंटर (Point of Sale)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
            सामान पर क्लिक करें, मात्रा तय करें और 1-क्लिक में थर्मल रसीद प्रिंट करें।
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-white/[0.08] bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>कार्ट खाली करें (Reset)</span>
          </button>
        )}
      </div>

      {/* Completed Invoice View (Thermal Print Ready) */}
      {completedOrder ? (
        <div className="max-w-xl mx-auto bg-zinc-900/90 rounded-2xl border border-white/[0.08] p-6 shadow-2xl my-8 animate-fadeIn">
          <div className="text-center pb-5 border-b border-white/[0.08]">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2 text-emerald-400">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-bold text-white">बिल सफलतापूर्वक तैयार हुआ!</h2>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              ऑर्डर #{completedOrder.id} • {new Date(completedOrder.created_at).toLocaleTimeString('en-IN')}
            </p>
          </div>

          {/* Thermal Receipt Preview Area */}
          <div id="thermal-receipt" className="my-5 p-4 rounded-xl bg-black/60 border border-white/[0.08] text-xs font-mono text-zinc-300">
            <div className="text-center pb-3 border-b border-dashed border-zinc-700">
              <p className="font-bold text-sm text-white">DUKAAN SAATHI STORE</p>
              <p className="text-[10px] text-zinc-500">Main Bazaar, Kirana Counter</p>
              <p className="text-[10px] text-zinc-400">Order #{completedOrder.id} | Paid: {paymentMethod.toUpperCase()}</p>
            </div>

            <div className="py-3 border-b border-dashed border-zinc-700 space-y-1">
              {completedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="truncate max-w-[180px]">{item.matched_product || item.raw_item} x {item.quantity}{item.unit}</span>
                  <span className="font-bold tabular-nums text-white">₹{item.line_total}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 space-y-1">
              <div className="flex justify-between font-bold text-sm text-white">
                <span>GRAND TOTAL:</span>
                <span className="tabular-nums text-emerald-400">₹{completedOrder.total_amount}</span>
              </div>
              <p className="text-center text-[10px] text-zinc-500 mt-3 pt-2 border-t border-zinc-800">
                *** Dhanyawad! Phir Aaiyega ***
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-6">
            <button
              onClick={() => window.print()}
              className="flex-1 min-w-[130px] inline-flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-emerald-900/40 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>पर्चा प्रिंट (Thermal)</span>
            </button>
            <button
              onClick={() => handleShareWhatsApp(completedOrder)}
              className="flex-1 min-w-[130px] inline-flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp रसीद</span>
            </button>
            <button
              onClick={() => setCompletedOrder(null)}
              className="flex-1 min-w-[130px] inline-flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/[0.08] font-bold text-xs transition cursor-pointer"
            >
              <span>नया बिल बनाएं</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Main Dual-Pane POS Interface */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Catalog & Search Section (Left 7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="सामान खोजें (Type name or alias: chawal, tel, sugar, atta, biscuit)..."
                className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 rounded-xl border border-white/[0.08] text-xs sm:text-sm font-medium text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>

            {/* Product Quick-Select Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="bg-zinc-900/70 p-3.5 rounded-xl border border-white/[0.08] hover:border-emerald-500/50 hover:bg-zinc-800/70 transition text-left flex flex-col justify-between group active:scale-98 cursor-pointer"
                >
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-zinc-100 group-hover:text-emerald-400 transition">
                      {p.name}
                    </h4>
                    <span className="text-xs text-zinc-400 font-medium">{p.hindi_name}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between w-full">
                    <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-white">
                      ₹{p.price} <span className="text-[10px] font-normal text-zinc-400">/{p.unit}</span>
                    </span>
                    <span className="text-[10px] font-semibold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-white/[0.05]">
                      स्टॉक: {p.stock}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart & Billing Checkout Drawer (Right 5 Columns) */}
          <div className="lg:col-span-5 bg-zinc-900/80 rounded-2xl p-5 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-4">
            <div>
              {/* Customer Name Input */}
              <div className="mb-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    ग्राहक का नाम / खाता (Customer Name)
                  </label>
                  {khataCustomers.length > 0 && (
                    <span className="text-[10px] text-zinc-500">खाता से चुनें</span>
                  )}
                </div>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="उदा: Raju Bhai, Sharma ji (वैकल्पिक)"
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/[0.08] rounded-xl text-xs font-medium text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                {/* Quick Customer Chips */}
                {khataCustomers.length > 0 && !customerName && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {khataCustomers.slice(0, 4).map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCustomerName(c.customer_name);
                          setCustomerPhone(c.phone);
                        }}
                        className="text-[10px] bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-md border border-white/[0.06] transition cursor-pointer"
                      >
                        +{c.customer_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="border-b border-white/[0.08] pb-2 mb-2 flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
                <span>सामान (Item)</span>
                <span>मात्रा व दर (Qty & Price)</span>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs font-medium">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                  कार्ट खाली है। बाएं तरफ से सामान जोड़ें।
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04] max-h-60 overflow-y-auto pr-1">
                  {cart.map((it, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-zinc-100">{it.product.name}</span>
                        <span className="text-[11px] text-zinc-400 block tabular-nums">
                          ₹{it.product.price} / {it.product.unit}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Stepper */}
                        <div className="flex items-center bg-zinc-800 rounded-lg p-0.5 border border-white/[0.05]">
                          <button
                            onClick={() => updateQuantity(it.product.id, it.quantity - (it.product.unit === 'packet' || it.product.unit === 'bottle' ? 1 : 0.5))}
                            className="w-5 h-5 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center font-bold font-mono tabular-nums text-zinc-200">
                            {it.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(it.product.id, it.quantity + (it.product.unit === 'packet' || it.product.unit === 'bottle' ? 1 : 0.5))}
                            className="w-5 h-5 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold font-mono tabular-nums text-white w-12 text-right">
                          ₹{Math.round(it.quantity * it.product.price)}
                        </span>

                        <button
                          onClick={() => removeFromCart(it.product.id)}
                          className="text-zinc-500 hover:text-rose-400 transition p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculations & Payment Options */}
            <div className="pt-3 border-t border-white/[0.08] space-y-3">
              {/* Payment Method Selector */}
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  भुगतान का प्रकार (Payment Method)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-1 ring-emerald-400/30'
                        : 'bg-zinc-800/80 border-white/[0.06] text-zinc-400 hover:bg-zinc-700/80'
                    }`}
                  >
                    नकद (Cash)
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 ring-1 ring-indigo-400/30'
                        : 'bg-zinc-800/80 border-white/[0.06] text-zinc-400 hover:bg-zinc-700/80'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    onClick={() => setPaymentMethod('udhaar')}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      paymentMethod === 'udhaar'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 ring-1 ring-amber-400/30'
                        : 'bg-zinc-800/80 border-white/[0.06] text-zinc-400 hover:bg-zinc-700/80'
                    }`}
                  >
                    उधार (Credit)
                  </button>
                </div>

                {/* Dynamic UPI QR Code Display */}
                {paymentMethod === 'upi' && grandTotal > 0 && (
                  <div className="mt-3 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center space-x-3.5 animate-fadeIn">
                    <div className="p-1.5 bg-white rounded-lg shrink-0 shadow">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`upi://pay?pa=dukaansaathi@upi&pn=Dukaan+Saathi&am=${grandTotal}&cu=INR`)}`}
                        alt="UPI QR Code"
                        className="w-18 h-18"
                      />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-xs font-bold text-white">Dynamic UPI QR Code</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        PhonePe / GPay / Paytm से स्कैन कर ₹{grandTotal} का भुगतान करें
                      </p>
                      <button
                        onClick={copyUpiId}
                        className="inline-flex items-center space-x-1 text-[10px] text-indigo-300 hover:text-white bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-400/30 transition cursor-pointer"
                      >
                        {copiedUpi ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUpi ? 'UPI ID कॉपी हो गया!' : 'dukaansaathi@upi (Copy)'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Subtotal & Discounts */}
              <div className="space-y-1.5 text-xs text-zinc-400 font-medium">
                <div className="flex justify-between">
                  <span>उप-कुल (Subtotal):</span>
                  <span className="font-bold font-mono tabular-nums text-white">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>छूट (Discount %):</span>
                  <select
                    value={discountPercent}
                    onChange={e => setDiscountPercent(Number(e.target.value))}
                    className="text-xs bg-zinc-800 border border-white/[0.08] text-white rounded px-2 py-1 font-semibold focus:outline-none"
                  >
                    <option value={0}>0%</option>
                    <option value={2}>2%</option>
                    <option value={5}>5%</option>
                    <option value={10}>10%</option>
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyGst}
                      onChange={e => setApplyGst(e.target.checked)}
                      className="rounded bg-zinc-800 border-white/[0.1] text-emerald-500 focus:ring-0"
                    />
                    <span>5% GST लागू करें</span>
                  </label>
                  <span className="font-mono tabular-nums text-zinc-300">{applyGst ? `+ ₹${gstAmount}` : '₹0'}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center">
                <span className="text-sm font-bold text-zinc-300">कुल बिल (Total):</span>
                <span className="text-2xl font-black font-mono tabular-nums text-emerald-400">₹{grandTotal}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting || cart.length === 0}
                className={`w-full py-3 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center space-x-2 cursor-pointer ${
                  isSubmitting || cart.length === 0
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/[0.05]'
                    : 'bg-emerald-600 hover:bg-emerald-500 active:scale-98 shadow-emerald-900/50'
                }`}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>बिल पक्का करें (Confirm ₹{grandTotal})</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
