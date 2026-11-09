import React, { useState } from 'react';
import { 
  TrendingUp 
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  const reportData = {
    today: {
      sales: 3840,
      profit: 760,
      expenses: 250,
      orders: 14,
      avgOrder: 274,
      cashVsUpi: { cash: 60, upi: 32, udhaar: 8 }
    },
    week: {
      sales: 28450,
      profit: 5820,
      expenses: 1850,
      orders: 98,
      avgOrder: 290,
      cashVsUpi: { cash: 55, upi: 35, udhaar: 10 }
    },
    month: {
      sales: 118400,
      profit: 24600,
      expenses: 8200,
      orders: 412,
      avgOrder: 287,
      cashVsUpi: { cash: 52, upi: 38, udhaar: 10 }
    }
  };

  const current = reportData[timeRange];

  const salesTrend = [
    { day: 'Mon', sales: 3400 },
    { day: 'Tue', sales: 4200 },
    { day: 'Wed', sales: 3900 },
    { day: 'Thu', sales: 4600 },
    { day: 'Fri', sales: 5100 },
    { day: 'Sat', sales: 6200 },
    { day: 'Sun', sales: 5800 },
  ];

  const maxSale = Math.max(...salesTrend.map(s => s.sales));

  const topCategories = [
    { name: 'अनाज व आटा (Grains & Flours)', percent: 38, revenue: 10811 },
    { name: 'तेल व घी (Edible Oils)', percent: 27, revenue: 7681 },
    { name: 'दालें व मसाले (Pulses & Spices)', percent: 18, revenue: 5121 },
    { name: 'साफ-सफाई व प्रसाधन (FMCG)', percent: 12, revenue: 3414 },
    { name: 'बिस्कुट व स्नैक्स (Snacks)', percent: 5, revenue: 1422 }
  ];

  return (
    <div className="py-6 px-4 max-w-6xl mx-auto space-y-6">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            दुकान एनालिटिक्स व हिसाब (Business Analytics)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track daily profit, revenue trends, expense ratios, and payment method distributions.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              timeRange === 'today' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            आज (Today)
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              timeRange === 'week' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            इस हफ्ते (This Week)
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              timeRange === 'month' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            इस महीने (This Month)
          </button>
        </div>
      </div>

      {/* KPI Highlight Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            कुल बिक्री (Gross Sales)
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-slate-900">₹{current.sales.toLocaleString('en-IN')}</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">औसत बिल: ₹{current.avgOrder}</p>
        </div>

        {/* Estimated Profit */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            शुद्ध लाभ (Net Profit Margin)
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-emerald-700">₹{current.profit.toLocaleString('en-IN')}</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              ~20.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">मार्जिन दर अनुसार</p>
        </div>

        {/* Operating Expenses */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            दुकान खर्च (Shop Expenses)
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-slate-800">₹{current.expenses.toLocaleString('en-IN')}</h3>
            <span className="text-xs font-bold text-slate-500">बिजली, किराया, भाड़ा</span>
          </div>
          <p className="text-[11px] text-slate-400">कटौती पश्चात लाभ: ₹{current.profit - current.expenses}</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            कुल आर्डर (Order Volume)
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-slate-900">{current.orders} ग्राहकी</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400">प्रति दिन औसत: ~14 आर्डर</p>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Bar Chart (Left 7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                साप्ताहिक बिक्री ट्रेंड (Weekly Sales Trend)
              </h3>
              <p className="text-xs text-slate-500">दैनिक बिक्री व व्यस्ततम दिन</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              शनिवार सबसे व्यस्त
            </span>
          </div>

          {/* Clean Functional Bar Graph */}
          <div className="pt-6 pb-2 grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 border-b border-slate-200">
            {salesTrend.map((s, idx) => {
              const heightPct = Math.round((s.sales / maxSale) * 100);
              return (
                <div key={idx} className="flex flex-col items-center space-y-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition">
                    ₹{s.sales}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-amber-500 hover:bg-amber-600 rounded-t-xl transition-all duration-300"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-xs font-semibold text-slate-600 pt-1">
                    {s.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-xs text-slate-500 pt-1">
            <span>सोमवार से रविवार की दैनिक ग्राहकी</span>
            <span className="font-semibold text-slate-800">औसत: ₹4,742/दिन</span>
          </div>
        </div>

        {/* Category Breakdown & Payment Methods (Right 5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Payment Split */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="font-bold text-sm text-slate-900">भुगतान का माध्यम (Payment Split)</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[11px] text-emerald-800 font-semibold block">नकद (Cash)</span>
                <strong className="text-base font-black text-emerald-950">{current.cashVsUpi.cash}%</strong>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                <span className="text-[11px] text-blue-800 font-semibold block">UPI / QR</span>
                <strong className="text-base font-black text-blue-950">{current.cashVsUpi.upi}%</strong>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-[11px] text-amber-800 font-semibold block">उधार (Credit)</span>
                <strong className="text-base font-black text-amber-950">{current.cashVsUpi.udhaar}%</strong>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h4 className="font-bold text-sm text-slate-900">श्रेणी अनुसार बिक्री (Top Categories)</h4>
            <div className="space-y-2 text-xs">
              {topCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-700">{cat.name}</span>
                    <span className="font-bold text-slate-900">₹{cat.revenue.toLocaleString('en-IN')} ({cat.percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-800 rounded-full"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
