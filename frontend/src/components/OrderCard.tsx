import React from 'react';
import {
  Volume2,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Check
} from 'lucide-react';
import { ParsedOrderResponse, ParsedOrderItem } from '../types';

interface OrderCardProps {
  order: ParsedOrderResponse;
  transcript: string;
  onUpdateItemQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onConfirmOrder: () => void;
  onReset: () => void;
  onReplaySpeech: () => void;
  isConfirming?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  transcript,
  onUpdateItemQuantity,
  onRemoveItem,
  onConfirmOrder,
  onReset,
  onReplaySpeech,
  isConfirming = false
}) => {
  const currentTotal = order.items.reduce((acc, it) => acc + it.line_total, 0);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl mx-auto my-6 animate-fadeIn">
      {/* Top Banner: Transcript & Spoken Hindi Response */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-5 border-b border-amber-100">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div>
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded">
                ग्राहक की आवाज (Customer Transcript)
              </span>
              <p className="text-base font-medium text-slate-900 mt-1 italic">
                "{transcript || order.transcript}"
              </p>
            </div>

            {order.hindi_reply && (
              <div className="pt-2 border-t border-amber-200/50">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                  दुकान साथी का जवाब (Voice Reply)
                </span>
                <p className="text-sm font-semibold text-emerald-950 mt-1">
                  "{order.hindi_reply}"
                </p>
              </div>
            )}
          </div>

          {/* Replay Voice button */}
          <button
            onClick={onReplaySpeech}
            className="p-2.5 bg-white hover:bg-amber-50 text-amber-700 rounded-xl border border-amber-200 shadow-xs transition hover:scale-105 shrink-0 flex items-center space-x-1"
            title="आवाज दोबारा सुनें (Replay voice response)"
          >
            <Volume2 className="w-5 h-5" />
            <span className="text-xs font-semibold hidden sm:inline">Play</span>
          </button>
        </div>

        {/* Engine badge */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center">
            <Sparkles className="w-3 h-3 mr-1 text-amber-600" />
            Parser: <strong className="ml-1 capitalize">{order.parse_method.replace('_', ' ')}</strong>
          </span>
          <span>Confidence: {Math.round(order.confidence * 100)}%</span>
        </div>
      </div>

      {/* Extracted Items List */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            ऑर्डर किए गए सामान (Extracted Items)
          </h4>
          <span className="text-xs text-slate-500">
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {order.items.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            कोई सामान नहीं मिला। कृपया स्पष्ट रूप से दोबारा बोलें।
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {order.items.map((item: ParsedOrderItem, index: number) => (
              <div key={index} className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition">
                {/* Item description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900 text-sm truncate">
                      {item.matched_product}
                    </span>
                    {item.in_stock ? (
                      <span className="inline-flex items-center text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        स्टॉक में है
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-medium text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                        स्टॉक कम ({item.available_stock} {item.unit})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ₹{item.unit_price} / {item.unit} • Subtotal: <strong className="text-slate-800">₹{item.line_total}</strong>
                  </p>
                </div>

                {/* Quantity adjuster */}
                <div className="flex items-center space-x-1.5 bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => onUpdateItemQuantity(index, Math.max(0.5, item.quantity - (item.unit === 'packet' || item.unit === 'bottle' || item.unit === 'tube' ? 1 : 0.5)))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs hover:bg-amber-50 active:scale-95 transition"
                    title="कम करें (Decrease)"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-slate-900">
                    {item.quantity} {item.unit}
                  </span>
                  <button
                    onClick={() => onUpdateItemQuantity(index, item.quantity + (item.unit === 'packet' || item.unit === 'bottle' || item.unit === 'tube' ? 1 : 0.5))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs hover:bg-amber-50 active:scale-95 transition"
                    title="बढ़ाएं (Increase)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(index)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                  title="हटाएं (Remove)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Unknown items note if any */}
        {order.unknown_items && order.unknown_items.length > 0 && (
          <div className="mt-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>अनजान सामान (Unmatched): </strong>
              {order.unknown_items.join(', ')} (दुकान सूची में नहीं मिला)
            </div>
          </div>
        )}

        {/* Order Bill Summary */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block">कुल बिल (Total Bill)</span>
            <span className="text-2xl font-black text-slate-900">
              ₹{Math.round(currentTotal)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onReset}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={onConfirmOrder}
              disabled={isConfirming || order.items.length === 0}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md flex items-center space-x-2 transition ${
                isConfirming || order.items.length === 0
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 active:scale-95'
              }`}
            >
              {isConfirming ? (
                <span>सेव हो रहा है...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>ऑर्डर कन्फर्म करें (Confirm ₹{Math.round(currentTotal)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
