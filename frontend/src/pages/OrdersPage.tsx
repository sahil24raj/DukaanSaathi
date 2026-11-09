import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Order } from '../types';
import { ShoppingBag, Eye, RefreshCw, X, Receipt, Printer } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="py-6 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-1.5 backdrop-blur-md">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Recorded Kirana Orders</span>
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              दुकान के ऑर्डर <span className="text-emerald-400 font-normal text-xl">(Order History)</span>
            </h1>
            <span className="bg-white/[0.08] text-neutral-300 border border-white/[0.1] text-xs px-2.5 py-0.5 rounded-full font-bold font-mono tabular-nums">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
            Voice-transcribed and POS counter orders saved in local SQLite database.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>रिफ्रेश</span>
        </button>
      </div>

      {/* Orders List Table */}
      {loading ? (
        <div className="text-center py-16 bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/[0.08] text-neutral-400">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium">ऑर्डर लोड हो रहे हैं...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/[0.08] text-neutral-400">
          <Receipt className="w-12 h-12 mx-auto mb-3 text-neutral-600 stroke-[1.5]" />
          <h3 className="font-bold text-white text-sm">अभी कोई ऑर्डर दर्ज नहीं है</h3>
          <p className="text-xs text-neutral-500 mt-1">वॉयस असिस्टेंट या POS काउंटर से पहला ऑर्डर बनाएं</p>
        </div>
      ) : (
        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-white/[0.04] text-neutral-400 font-bold uppercase tracking-wider border-b border-white/[0.08]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">ऑर्डर नं. (ID)</th>
                  <th className="py-3.5 px-4">समय (Date/Time)</th>
                  <th className="py-3.5 px-4">सामान (Items)</th>
                  <th className="py-3.5 px-4 text-right">कुल बिल (Total)</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">विवरण (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-white">
                      #{o.id}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 text-xs">
                      {formatDate(o.created_at)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-md">
                        {o.items.map((it, idx) => (
                          <span key={idx} className="text-[11px] bg-white/[0.06] text-neutral-300 border border-white/[0.08] px-2 py-0.5 rounded font-medium">
                            {it.matched_product || it.raw_item} ({it.quantity}{it.unit})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold font-mono tabular-nums text-emerald-400 text-sm sm:text-base">
                      ₹{o.total_amount}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-white/[0.12] bg-zinc-800/80 hover:bg-zinc-700 hover:border-emerald-500/50 text-neutral-200 text-xs font-bold transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>रसीद</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail & Print Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950/90 backdrop-blur-2xl rounded-2xl border border-white/[0.12] max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="font-black text-base text-white">
                  ऑर्डर रसीद #{selectedOrder.id}
                </h3>
                <span className="text-xs text-neutral-400 font-mono">
                  {formatDate(selectedOrder.created_at)}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Transcript Quote */}
            {selectedOrder.customer_transcript && (
              <div className="p-3 rounded-xl bg-black/50 border border-white/[0.08]">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  ग्राहक की आवाज़:
                </span>
                <p className="text-xs font-semibold text-emerald-300 mt-1 italic">
                  &ldquo;{selectedOrder.customer_transcript}&rdquo;
                </p>
              </div>
            )}

            {/* Item Breakdown */}
            <div className="divide-y divide-white/[0.06] py-2">
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="py-2 flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-neutral-200">{it.matched_product || it.raw_item}</span>
                    <span className="text-neutral-400 block tabular-nums">
                      {it.quantity} {it.unit} @ ₹{it.unit_price}
                    </span>
                  </div>
                  <span className="font-bold font-mono tabular-nums text-white">
                    ₹{it.line_total}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Callout */}
            <div className="pt-3 border-t border-white/[0.08] flex justify-between items-center">
              <span className="font-bold text-neutral-300 text-sm">कुल भुगतान (Paid):</span>
              <span className="text-2xl font-black font-mono tabular-nums text-emerald-400">
                ₹{selectedOrder.total_amount}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>थर्मल प्रिंट (80mm)</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2.5 px-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-neutral-300 font-bold text-xs transition cursor-pointer border border-white/[0.08]"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
