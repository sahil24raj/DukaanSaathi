import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart2, 
  CreditCard, 
  PieChart 
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
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-1.5 backdrop-blur-md">
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Store Performance Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            दुकान एनालिटिक्स व हिसाब <span className="text-emerald-400 font-normal text-xl">(Business Analytics)</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
            Track daily profit, revenue trends, expense ratios, and payment method distributions.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center space-x-1 bg-zinc-900/70 p-1.5 rounded-2xl border border-white/[0.1] backdrop-blur-md self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              timeRange === 'today' 
                ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20' 
                : 'text-neutral-400 hover:text-white hover:bg-zinc-800/80'
            }`}
          >
            आज (Today)
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              timeRange === 'week' 
                ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20' 
                : 'text-neutral-400 hover:text-white hover:bg-zinc-800/80'
            }`}
          >
            इस हफ्ते (This Week)
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              timeRange === 'month' 
                ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20' 
                : 'text-neutral-400 hover:text-white hover:bg-zinc-800/80'
            }`}
          >
            इस महीने (This Month)
          </button>
        </div>
      </div>

      {/* KPI Highlight Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-2xl space-y-2">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            कुल बिक्री (Gross Sales)
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-white">₹{current.sales.toLocaleString('en-IN')}</h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">औसत बिल: ₹{current.avgOrder}</p>
        </div>

        {/* Estimated Profit */}
        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-2xl space-y-2">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            शुद्ध लाभ (Net Profit Margin)
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-emerald-400">₹{current.profit.toLocaleString('en-IN')}</h3>
            <span className="text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
              ~20.4%
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">मार्जिन दर अनुसार</p>
        </div>

        {/* Operating Expenses */}
        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-2xl space-y-2">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            दुकान खर्च (Shop Expenses)
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-neutral-200">₹{current.expenses.toLocaleString('en-IN')}</h3>
            <span className="text-xs font-semibold text-neutral-400">बिजली, किराया, भाड़ा</span>
          </div>
          <p className="text-[11px] text-neutral-400">कटौती पश्चात लाभ: ₹{(current.profit - current.expenses).toLocaleString('en-IN')}</p>
        </div>

        {/* Total Orders */}
        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-2xl space-y-2">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            कुल आर्डर (Order Volume)
          </span>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-white">{current.orders} <span className="text-sm font-normal text-neutral-400">ग्राहकी</span></h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">प्रति दिन औसत: ~14 आर्डर</p>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Bar Chart (Left 7 Columns) */}
        <div className="lg:col-span-7 bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/[0.08] shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">
                साप्ताहिक बिक्री ट्रेंड (Weekly Sales Trend)
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">दैनिक बिक्री व व्यस्ततम दिन</p>
            </div>
            <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full">
              शनिवार सबसे व्यस्त
            </span>
          </div>

          {/* Clean Functional Bar Graph */}
          <div className="pt-8 pb-3 grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 border-b border-zinc-800">
            {salesTrend.map((s, idx) => {
              const heightPct = Math.round((s.sales / maxSale) * 100);
              return (
                <div key={idx} className="flex flex-col items-center space-y-2 group h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition duration-200">
                    ₹{s.sales}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-emerald-500 hover:bg-emerald-400 rounded-t-xl transition-all duration-300 shadow-lg shadow-emerald-500/20"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-xs font-semibold text-neutral-300 pt-1">
                    {s.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-xs text-neutral-400 pt-1">
            <span>सोमवार से रविवार की दैनिक ग्राहकी</span>
            <span className="font-bold text-white">औसत: ₹4,742/दिन</span>
          </div>
        </div>

        {/* Category Breakdown & Payment Methods (Right 5 Columns) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Payment Split */}
          <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-2xl space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>भुगतान का माध्यम (Payment Split)</span>
            </h4>
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 bg-zinc-800/60 rounded-2xl border border-white/[0.06]">
                <span className="text-[11px] text-neutral-400 font-semibold block">नकद (Cash)</span>
                <strong className="text-lg font-black text-emerald-400 mt-1 block">{current.cashVsUpi.cash}%</strong>
              </div>
              <div className="p-3 bg-zinc-800/60 rounded-2xl border border-white/[0.06]">
                <span className="text-[11px] text-neutral-400 font-semibold block">UPI / QR</span>
                <strong className="text-lg font-black text-teal-400 mt-1 block">{current.cashVsUpi.upi}%</strong>
              </div>
              <div className="p-3 bg-zinc-800/60 rounded-2xl border border-white/[0.06]">
                <span className="text-[11px] text-neutral-400 font-semibold block">उधार (Credit)</span>
                <strong className="text-lg font-black text-amber-400 mt-1 block">{current.cashVsUpi.udhaar}%</strong>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-2xl space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-teal-400" />
              <span>श्रेणी अनुसार बिक्री (Top Categories)</span>
            </h4>
            <div className="space-y-3 text-xs">
              {topCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-300">{cat.name}</span>
                    <span className="font-bold text-white">₹{cat.revenue.toLocaleString('en-IN')} <span className="text-emerald-400 font-normal">({cat.percent}%)</span></span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800/80 rounded-full overflow-hidden border border-white/[0.04]">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
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
