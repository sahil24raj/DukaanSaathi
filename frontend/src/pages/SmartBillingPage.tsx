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
  ShoppingBag
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
            ? { ...item, quantity: item.quantity + (product.unit === 'packet' || product.unit === 'bottle' || product.unit === 'tube' ? 1 : 0.5) }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity: newQty } : item
    ));
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

  // Calculations
  const subtotal = cart.reduce((acc, it) => acc + (it.product.price * it.quantity), 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const gstAmount = applyGst ? Math.round((subtotal - discountAmount) * 0.05) : 0; // 5% standard kirana GST
  const grandTotal = Math.max(0, subtotal - discountAmount + gstAmount);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const itemsPayload = cart.map(it => ({
        raw_item: it.product.name.toLowerCase(),
        matched_product: it.product.name,
        quantity: it.quantity,
        unit: it.product.unit,
        unit_price: it.product.price,
        line_total: Math.round(it.quantity * it.product.price),
        in_stock: it.product.stock >= it.quantity,
        available_stock: it.product.stock
      }));

      const res = await api.createOrder({
        customer_transcript: `POS Billing: ${customerName || 'Walk-in'} (${paymentMethod.toUpperCase()})`,
        hindi_response: `Aapka bill ₹${grandTotal}. Dhanyawad!`,
        items: itemsPayload
      });

      setCompletedOrder(res);
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            स्मार्ट बिलिंग काउंटर (Fast POS Billing)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rapid point of sale with instant barcode/search, cash/UPI/udhaar split, and thermal printing.
          </p>
        </div>

        <button 
          onClick={clearCart}
          className="text-xs font-semibold text-slate-600 hover:text-red-700 bg-slate-100 px-3 py-1.5 rounded-xl transition"
        >
          नया बिल (Clear)
        </button>
      </div>

      {completedOrder ? (
        /* Printable Receipt / Invoice View */
        <div className="max-w-md mx-auto bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
          <div className="text-center pb-4 border-b border-slate-200">
            <span className="text-2xl block mb-1">🏪</span>
            <h2 className="text-lg font-black text-slate-900">दुकान साथी किराना स्टोर</h2>
            <p className="text-xs text-slate-500">कच्चा/पक्का बिल पर्चा #00{completedOrder.id}</p>
            <p className="text-[11px] text-slate-400 mt-1">{new Date().toLocaleString('en-IN')}</p>
          </div>

          <div className="space-y-2 text-xs">
            {completedOrder.items.map((it, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-800">{it.matched_product}</span>
                  <span className="text-slate-400 block text-[11px]">{it.quantity} {it.unit} @ ₹{it.unit_price}</span>
                </div>
                <span className="font-bold text-slate-900">₹{it.line_total}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-1 text-xs">
            <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t-2 border-slate-900">
              <span>कुल राशि (Total):</span>
              <span className="text-xl text-emerald-700">₹{Math.round(completedOrder.total_amount)}</span>
            </div>
            <p className="text-[11px] text-slate-500 text-center pt-2 italic">
              "धन्यवाद! फिर पधारें।"
            </p>
          </div>

          <div className="pt-4 flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>प्रिंट पर्चा (Print Receipt)</span>
            </button>
            <button
              onClick={() => setCompletedOrder(null)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
            >
              अगला बिल (Next)
            </button>
          </div>
        </div>
      ) : (
        /* Regular Billing Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Catalog & Product Search Section (Left 7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="सामान खोजें (Type name or alias: chawal, tel, sugar, atta, manjan)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-2xs"
              />
            </div>

            {/* Product Quick-Select Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-left flex flex-col justify-between group active:scale-98"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition">
                      {p.name}
                    </h4>
                    <span className="text-xs text-amber-600 font-medium">{p.hindi_name}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between w-full">
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{p.price} <span className="text-[10px] font-normal text-slate-500">/{p.unit}</span>
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      स्टॉक: {p.stock}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart & Billing Checkout Section (Right 5 Columns) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              {/* Customer Name / Phone */}
              <div className="mb-4 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                  ग्राहक का नाम / खाता (Customer Name)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="उदा: Raju Bhai, Sharma ji (वैकल्पिक)"
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="border-b border-slate-200 pb-2 mb-2 flex justify-between text-xs font-bold text-slate-400 uppercase">
                <span>सामान (Item)</span>
                <span>मात्रा व दर (Qty & Price)</span>
              </div>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  कार्ट खाली है। बाएं तरफ से सामान जोड़ें।
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                  {cart.map((it, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{it.product.name}</span>
                        <span className="text-[11px] text-slate-500 block">
                          ₹{it.product.price} / {it.product.unit}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Stepper */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(it.product.id, it.quantity - (it.product.unit === 'packet' || it.product.unit === 'bottle' ? 1 : 0.5))}
                            className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-2xs hover:bg-amber-50"
                          >
                            <Minus className="w-3 h-3 text-slate-600" />
                          </button>
                          <span className="w-10 text-center font-bold text-slate-800">
                            {it.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(it.product.id, it.quantity + (it.product.unit === 'packet' || it.product.unit === 'bottle' ? 1 : 0.5))}
                            className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-2xs hover:bg-amber-50"
                          >
                            <Plus className="w-3 h-3 text-slate-600" />
                          </button>
                        </div>

                        <span className="font-bold text-slate-900 w-12 text-right">
                          ₹{Math.round(it.quantity * it.product.price)}
                        </span>

                        <button
                          onClick={() => removeFromCart(it.product.id)}
                          className="text-slate-400 hover:text-red-600 transition"
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
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">
                  भुगतान का प्रकार (Payment Method)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    नकद (Cash)
                  </button>
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                      paymentMethod === 'upi'
                        ? 'bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    onClick={() => setPaymentMethod('udhaar')}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                      paymentMethod === 'udhaar'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 ring-1 ring-amber-400'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    उधार (Credit)
                  </button>
                </div>
              </div>

              {/* Subtotal & Discounts */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>उप-कुल (Subtotal):</span>
                  <span className="font-semibold text-slate-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>छूट (Discount %):</span>
                  <select
                    value={discountPercent}
                    onChange={e => setDiscountPercent(Number(e.target.value))}
                    className="text-xs bg-slate-50 border border-slate-200 rounded p-1"
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
                      className="rounded text-amber-600 focus:ring-0"
                    />
                    <span>5% GST लागू करें</span>
                  </label>
                  <span>{applyGst ? `+ ₹${gstAmount}` : '₹0'}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">कुल बिल (Total):</span>
                <span className="text-2xl font-black text-slate-900">₹{grandTotal}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting || cart.length === 0}
                className={`w-full py-3 rounded-2xl text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 ${
                  isSubmitting || cart.length === 0
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-emerald-600/20'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>बिल पक्का करें (Confirm ₹{grandTotal})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
