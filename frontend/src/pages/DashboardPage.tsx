import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DashboardStats } from '../types';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  Award,
  RefreshCw,
  Clock,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboard();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const maxRevenue = stats?.top_selling_items?.reduce(
    (max, item) => Math.max(max, item.revenue),
    0
  ) || 1;

  return (
    <div className="py-6 px-4 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-1.5 backdrop-blur-md">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Store Intelligence & Insights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            दुकान एनालिटिक्स <span className="text-emerald-400 font-normal text-xl">(Kirana Dashboard)</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
            Real-time sales performance, revenue breakdown, and inventory warnings
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-white/[0.12] bg-zinc-900/60 hover:bg-zinc-800/80 text-xs font-bold text-neutral-200 transition cursor-pointer backdrop-blur-md shadow-sm active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Stats</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-white/[0.08] text-neutral-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium">डैशबोर्ड लोड हो रहा है...</p>
        </div>
      ) : stats ? (
        <>
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Orders */}
            <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-2xl flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">कुल आर्डर (Total Orders)</span>
                <h3 className="text-2xl font-black text-white mt-0.5">{stats.total_orders}</h3>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-2xl flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">कुल बिक्री (Total Revenue)</span>
                <h3 className="text-2xl font-black text-emerald-400 mt-0.5">₹{Math.round(stats.total_revenue).toLocaleString('en-IN')}</h3>
              </div>
            </div>

            {/* Top Seller */}
            <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-2xl flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">शीर्ष उत्पाद (Top Seller)</span>
                <h3 className="text-base font-bold text-white truncate max-w-[140px] mt-0.5">
                  {stats.top_selling_items[0]?.name || 'N/A'}
                </h3>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-2xl flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                stats.low_stock_products.length > 0 
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' 
                  : 'bg-zinc-800 text-neutral-400 border border-white/[0.05]'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">कम स्टॉक (&lt;10)</span>
                <h3 className={`text-2xl font-black mt-0.5 ${stats.low_stock_products.length > 0 ? 'text-rose-400' : 'text-white'}`}>
                  {stats.low_stock_products.length}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Products Visual Chart */}
            <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/[0.08] shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>शीर्ष 5 उत्पाद (Top 5 Products by Sales)</span>
                </h3>
                <span className="text-xs text-neutral-400">By revenue generated</span>
              </div>

              {stats.top_selling_items.length === 0 ? (
                <p className="text-xs text-neutral-400 py-6 text-center">No sales data recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {stats.top_selling_items.map((prod, idx) => {
                    const pct = Math.round((prod.revenue / maxRevenue) * 100) || 5;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-neutral-200">
                            {idx + 1}. {prod.name} ({prod.units_sold} {prod.unit})
                          </span>
                          <span className="font-bold text-emerald-400">₹{Math.round(prod.revenue).toLocaleString('en-IN')}</span>
                        </div>
                        {/* Bar meter */}
                        <div className="w-full h-2.5 bg-zinc-800/80 rounded-full overflow-hidden border border-white/[0.05]">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(6, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Low Stock Alerts Card */}
            <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/[0.08] shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>स्टॉक चेतावनी अलर्ट (Low Stock Notice)</span>
                </h3>
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                  Threshold: &lt; 10 units
                </span>
              </div>

              {stats.low_stock_products.length === 0 ? (
                <div className="text-center py-10 text-neutral-400 text-xs flex flex-col items-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                  <span>शानदार! सभी सामान पर्याप्त स्टॉक में उपलब्ध हैं (All items well stocked).</span>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/80">
                  {stats.low_stock_products.map((p) => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-neutral-200">{p.name}</span>
                        <span className="text-[11px] text-neutral-400 block">
                          ₹{p.price}/{p.unit}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-mono">
                          केवल {p.stock} {p.unit} शेष
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders Stream */}
          <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/[0.08] shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span>हाल के 5 आर्डर (Recent Activity)</span>
            </h3>

            {stats.recent_orders.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">No recent orders.</p>
            ) : (
              <div className="divide-y divide-zinc-800/80 text-xs">
                {stats.recent_orders.map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">Order #{ord.id}</span>
                        <span className="text-neutral-500">•</span>
                        <span className="italic text-neutral-300 truncate max-w-xs sm:max-w-md">
                          "{ord.customer_transcript || 'Voice order'}"
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-400 mt-0.5 block">
                        {ord.items.length} items ({ord.items.map(i => i.matched_product).join(', ')})
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">
                      ₹{Math.round(ord.total_amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
