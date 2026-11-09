import React from 'react';
import {
  Volume2,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  RotateCcw,
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
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden max-w-2xl mx-auto my-6">
      
      {/* Top Banner: Transcript & Spoken Hindi Response */}
      <div className="bg-slate-50 p-5 border-b border-slate-200/80">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            {/* Customer Speech Transcript */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-200/80 px-2 py-0.5 rounded">
                  ग्राहक की आवाज (Customer Transcript)
                </span>
                <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Gnani Prisma STT
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-900 mt-1.5 leading-snug">
                &ldquo;{transcript || order.transcript}&rdquo;
              </p>
            </div>

            {/* Dukaan Saathi Hindi Response */}
            {order.hindi_reply && (
              <div className="pt-2.5 border-t border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                    दुकान साथी का जवाब (Voice Response)
                  </span>
                  <span className="text-[10px] font-mono font-medium text-slate-500">
                    Gnani Timbre TTS
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-900 mt-1">
                  &ldquo;{order.hindi_reply}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Replay Speech Button */}
          <button
            onClick={onReplaySpeech}
            title="आवाज़ दोबारा सुनें (Replay Hindi Audio)"
            className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            <Volume2 className="w-5 h-5 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Extracted Items Table */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            ऑर्डर लिस्ट ({order.items.length} आइटम)
          </h4>
          <span className="text-xs text-slate-400 font-medium">
            मात्रा बदलें (+ / -)
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {order.items.map((item: ParsedOrderItem, idx: number) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-3">
              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {item.matched_product || item.raw_item}
                  </span>
                  {!item.in_stock && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      <AlertTriangle className="w-3 h-3" /> आउट ऑफ स्टॉक
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 tabular-nums">
                  ₹{item.unit_price} प्रति {item.unit}
                </p>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                <button
                  onClick={() => onUpdateItemQuantity(idx, Math.max(1, item.quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-xs font-bold font-mono tabular-nums text-slate-800">
                  {item.quantity} {item.unit}
                </span>
                <button
                  onClick={() => onUpdateItemQuantity(idx, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Line Total */}
              <div className="text-right w-20">
                <span className="text-sm font-bold font-mono tabular-nums text-slate-900">
                  ₹{item.line_total}
                </span>
              </div>

              {/* Remove Action */}
              <button
                onClick={() => onRemoveItem(idx)}
                className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Bill Summary */}
        <div className="mt-4 pt-4 border-t border-slate-200/90 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              कुल बिल (Total Amount)
            </span>
            <p className="text-[11px] text-slate-400">GST और राउंड-ऑफ शामिल</p>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-emerald-700">
              ₹{currentTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>नया आर्डर (Reset)</span>
        </button>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={onConfirmOrder}
            disabled={isConfirming || order.items.length === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{isConfirming ? 'बिल बन रहा है...' : 'पक्का बिल बनाएं (Confirm Bill)'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
