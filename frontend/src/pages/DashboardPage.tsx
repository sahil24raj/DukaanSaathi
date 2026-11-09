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
  CheckCircle2
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
          <h1 className="text-2xl font-black text-slate-900">दुकान एनालिटिक्स (Kirana Dashboard)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time sales performance, revenue breakdown, and inventory warnings
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Stats</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">डैशबोर्ड लोड हो रहा है...</p>
        </div>
      ) : stats ? (
        <>
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Orders */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">कुल आर्डर (Total Orders)</span>
                <h3 className="text-2xl font-black text-slate-900">{stats.total_orders}</h3>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">कुल बिक्री (Total Revenue)</span>
                <h3 className="text-2xl font-black text-slate-900">₹{Math.round(stats.total_revenue)}</h3>
              </div>
            </div>

            {/* Top Seller */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">सबसे ज्यादा बिका (Top Seller)</span>
                <h3 className="text-base font-bold text-slate-900 truncate max-w-[140px]">
                  {stats.top_selling_items[0]?.name || 'N/A'}
                </h3>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                stats.low_stock_products.length > 0 ? 'bg-red-500/10 text-red-600' : 'bg-slate-100 text-slate-400'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">कम स्टॉक चेतावनी (&lt;10)</span>
                <h3 className="text-2xl font-black text-slate-900">
                  {stats.low_stock_products.length}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Products Visual Chart */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>शीर्ष 5 उत्पाद (Top 5 Products by Sales)</span>
                </h3>
                <span className="text-xs text-slate-400">By revenue generated</span>
              </div>

              {stats.top_selling_items.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No sales data recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {stats.top_selling_items.map((prod, idx) => {
                    const pct = Math.round((prod.revenue / maxRevenue) * 100) || 5;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-800">
                            {idx + 1}. {prod.name} ({prod.units_sold} {prod.unit})
                          </span>
                          <span className="font-bold text-slate-900">₹{Math.round(prod.revenue)}</span>
                        </div>
                        {/* Bar meter */}
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
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
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>स्टॉक चेतावनी अलर्ट (Low Stock Notice)</span>
                </h3>
                <span className="text-xs font-semibold text-red-600">
                  Threshold: &lt; 10 units
                </span>
              </div>

              {stats.low_stock_products.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs flex flex-col items-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                  <span>शानदार! सभी सामान पर्याप्त स्टॉक में उपलब्ध हैं (All items well stocked).</span>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {stats.low_stock_products.map((p) => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800">{p.name}</span>
                        <span className="text-[11px] text-slate-500 block">
                          ₹{p.price}/{p.unit}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>हाल के 5 आर्डर (Recent Activity)</span>
            </h3>

            {stats.recent_orders.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No recent orders.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {stats.recent_orders.map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">Order #{ord.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="italic text-slate-600 truncate max-w-xs">
                          "{ord.customer_transcript || 'Voice order'}"
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {ord.items.length} items ({ord.items.map(i => i.matched_product).join(', ')})
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{Math.round(ord.total_amount)}
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

