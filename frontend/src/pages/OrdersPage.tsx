import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Order } from '../types';
import { ShoppingBag, Eye, RefreshCw, X, Receipt } from 'lucide-react';

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
        year: 'numeric',
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
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900">दुकान के आर्डर (Recent Orders)</h1>
            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {orders.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Voice-transcribed and saved customer transactions in SQLite database
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">आर्डर लोड हो रहे हैं (Loading orders)...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">अभी कोई आर्डर नहीं है (No orders yet)</h3>
          <p className="text-xs text-slate-500 mt-1">
            Use the mic in the 'Boliye' tab to place your first voice order!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Customer Transcript</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4 text-right">Total (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-amber-50/40 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      #{ord.id}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(ord.created_at)}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-800" title={ord.customer_transcript}>
                      {ord.customer_transcript || 'Voice order'}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                      {ord.items.map(i => `${i.quantity} ${i.unit} ${i.matched_product}`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900 text-sm">
                      ₹{Math.round(ord.total_amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-100/60 transition"
                        title="View Receipt"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="bg-amber-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Receipt className="w-5 h-5" />
                <h3 className="font-bold text-sm">कच्चा पर्चा / बिल Receipt #{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg hover:bg-white/20 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-xs text-slate-500 flex justify-between border-b pb-2">
                <span>Date: {formatDate(selectedOrder.created_at)}</span>
                <span className="font-bold text-emerald-700 uppercase">Confirmed</span>
              </div>

              {selectedOrder.customer_transcript && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-0.5">Transcript:</span>
                  <p className="italic text-slate-800">"{selectedOrder.customer_transcript}"</p>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700 uppercase">सामान की सूची</h5>
                <div className="divide-y divide-slate-100 text-xs">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-800">{it.matched_product}</span>
                        <span className="text-slate-500 block text-[11px]">
                          {it.quantity} {it.unit} @ ₹{it.unit_price}/{it.unit}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">₹{it.line_total}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-center text-base font-bold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-xl text-emerald-700">₹{Math.round(selectedOrder.total_amount)}</span>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
