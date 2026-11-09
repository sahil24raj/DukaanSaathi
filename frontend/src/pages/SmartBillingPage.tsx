import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Product, Order } from '../types';
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
  RotateCcw
} from 'lucide-react';

interface SmartBillingPageProps {
  onOrderSaved?: () => void;
}

export const SmartBillingPage: React.FC<SmartBillingPageProps> = ({ onOrderSaved }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'udhaar'>('cash');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [applyGst, setApplyGst] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

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
        customer_transcript: transcriptDesc,
        hindi_response: hindiResponse,
        items: orderItems
      });

      setCompletedOrder(saved);
      clearCart();
      if (onOrderSaved) onOrderSaved();
    } catch (err: any) {
      alert(`बिल दर्ज करने में त्रुटि: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-1.5">
            <Receipt className="w-3.5 h-3.5 text-emerald-700" />
            <span>5-Second POS Billing Station</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            स्मार्ट बिलिंग काउंटर (Point of Sale)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            सामान पर क्लिक करें, तुरंत मात्रा व छूट जोड़ें और 1-क्लिक में रसीद प्रिंट करें।
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>कार्ट खाली करें (Reset)</span>
          </button>
        )}
      </div>

      {/* Completed Invoice View (Thermal Print Ready) */}
      {completedOrder ? (
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-xs my-8 animate-fadeIn">
          <div className="text-center pb-5 border-b border-slate-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2 text-emerald-700">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-black text-slate-900">बिल सफलतापूर्वक तैयार हुआ!</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              ऑर्डर #{completedOrder.id} • {new Date(completedOrder.created_at).toLocaleTimeString('en-IN')}
            </p>
          </div>

          {/* Thermal Receipt Preview Area */}
          <div id="thermal-receipt" className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <p className="font-bold text-sm text-slate-900">DUKAAN SAATHI STORE</p>
              <p className="text-[10px] text-slate-500">Main Bazaar, Kirana Counter</p>
              <p className="text-[10px] text-slate-500">Order #{completedOrder.id} | Paid: {paymentMethod.toUpperCase()}</p>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 space-y-1">
              {completedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="truncate max-w-[180px]">{item.matched_product || item.raw_item} x {item.quantity}{item.unit}</span>
                  <span className="font-bold tabular-nums">₹{item.line_total}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 space-y-1">
              <div className="flex justify-between font-bold text-sm text-slate-900">
                <span>GRAND TOTAL:</span>
                <span className="tabular-nums">₹{completedOrder.total_amount}</span>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-200">
                *** Dhanyawad! Phir Aaiyega ***
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => window.print()}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>पर्चा प्रिंट (Thermal Print)</span>
            </button>
            <button
              onClick={() => setCompletedOrder(null)}
              className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
            >
              <span>नया बिल बनाएं (Next Bill)</span>
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
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="सामान खोजें (Type name or alias: chawal, tel, sugar, atta, biscuit)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500 shadow-2xs"
              />
            </div>

            {/* Product Quick-Select Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition text-left flex flex-col justify-between group active:scale-98 cursor-pointer"
                >
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition">
                      {p.name}
                    </h4>
                    <span className="text-xs text-emerald-700 font-medium">{p.hindi_name}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between w-full">
                    <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-slate-900">
                      ₹{p.price} <span className="text-[10px] font-normal text-slate-500">/{p.unit}</span>
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      स्टॉक: {p.stock}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart & Billing Checkout Drawer (Right 5 Columns) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              {/* Customer Name Input */}
              <div className="mb-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                  ग्राहक का नाम / खाता (Customer Name)
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="उदा: Raju Bhai, Sharma ji (वैकल्पिक)"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="border-b border-slate-200 pb-2 mb-2 flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>सामान (Item)</span>
                <span>मात्रा व दर (Qty & Price)</span>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  कार्ट खाली है। बाएं तरफ से सामान जोड़ें।
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                  {cart.map((it, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{it.product.name}</span>
                        <span className="text-[11px] text-slate-500 block tabular-nums">
                          ₹{it.product.price} / {it.product.unit}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Stepper */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(it.product.id, it.quantity - (it.product.unit === 'packet' || it.product.unit === 'bottle' ? 1 : 0.5))}
                            className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-2xs hover:bg-emerald-50 text-slate-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center font-bold font-mono tabular-nums text-slate-800">
                            {it.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(it.product.id, it.quantity + (it.product.unit === 'packet' || it.product.unit === 'bottle' ? 1 : 0.5))}
                            className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-2xs hover:bg-emerald-50 text-slate-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold font-mono tabular-nums text-slate-900 w-12 text-right">
                          ₹{Math.round(it.quantity * it.product.price)}
                        </span>

                        <button
                          onClick={() => removeFromCart(it.product.id)}
                          className="text-slate-300 hover:text-rose-600 transition p-1"
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
            <div className="pt-3 border-t border-slate-200 space-y-3">
              {/* Payment Method Selector */}
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                  भुगतान का प्रकार (Payment Method)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    नकद (Cash)
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-800 ring-2 ring-indigo-400/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    onClick={() => setPaymentMethod('udhaar')}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      paymentMethod === 'udhaar'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    उधार (Credit)
                  </button>
                </div>
              </div>

              {/* Subtotal & Discounts */}
              <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>उप-कुल (Subtotal):</span>
                  <span className="font-bold font-mono tabular-nums text-slate-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>छूट (Discount %):</span>
                  <select
                    value={discountPercent}
                    onChange={e => setDiscountPercent(Number(e.target.value))}
                    className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold"
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
                      className="rounded text-emerald-600 focus:ring-0"
                    />
                    <span>5% GST लागू करें</span>
                  </label>
                  <span className="font-mono tabular-nums">{applyGst ? `+ ₹${gstAmount}` : '₹0'}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">कुल बिल (Total):</span>
                <span className="text-2xl font-black font-mono tabular-nums text-emerald-700">₹{grandTotal}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting || cart.length === 0}
                className={`w-full py-3 rounded-xl text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer ${
                  isSubmitting || cart.length === 0
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-emerald-700/20'
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
