import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Product } from '../types';
import { AlertTriangle, RefreshCw, Plus, Minus, Search, Database } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdjustStock = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    setUpdatingId(product.id);
    try {
      const updated = await api.updateProduct(product.id, { stock: newStock });
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      alert('स्टॉक अपडेट करने में विफल (Failed to update stock)');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReseed = async () => {
    if (confirm('क्या आप डिफ़ॉल्ट किराना कैटलॉग रीसेट करना चाहते हैं? (Reset to initial 10 products?)')) {
      try {
        await api.seedProducts();
        fetchProducts();
      } catch (err) {
        alert('Seed failed');
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.hindi_name && p.hindi_name.includes(searchQuery)) ||
      p.aliases.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = products.filter((p) => p.stock < 10).length;

  return (
    <div className="py-6 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900">दुकान का स्टॉक (Inventory Catalog)</h1>
            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {products.length} Products
            </span>
            {lowStockCount > 0 && (
              <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 mr-0.5" />
                <span>{lowStockCount} Low Stock (&lt;10)</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stock tracking with fuzzy alias matching for Hindi/Hinglish orders
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReseed}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-xs font-semibold text-amber-900 transition"
            title="Reset default catalog"
          >
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>Reseed</span>
          </button>
          <button
            onClick={fetchProducts}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="सर्च करें (उदा: chawal, tel, rice, salt, आटा)..."
          className="w-full pl-10 pr-4 py-2 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-2xs"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">स्टॉक लोड हो रहा है...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const isLow = p.stock < 10;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-3xl p-5 border transition-all hover:shadow-md ${
                  isLow ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                    <p className="text-xs font-medium text-amber-700">{p.hindi_name || '—'}</p>
                  </div>
                  <span className="text-base font-extrabold text-slate-900">
                    ₹{p.price} <span className="text-xs font-normal text-slate-500">/{p.unit}</span>
                  </span>
                </div>

                {/* Aliases */}
                <div className="mt-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Matched Aliases
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {p.aliases.split(',').slice(0, 4).map((alias, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {alias.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stock Controls */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">उपलब्ध स्टॉक</span>
                    <span className={`text-base font-black ${isLow ? 'text-red-600' : 'text-emerald-700'}`}>
                      {p.stock} <span className="text-xs font-normal text-slate-500">{p.unit}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => handleAdjustStock(p, -5)}
                      disabled={updatingId === p.id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-amber-50 active:scale-95 transition shadow-2xs font-bold text-xs"
                      title="5 घटाएं (-5)"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => handleAdjustStock(p, -1)}
                      disabled={updatingId === p.id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-amber-50 active:scale-95 transition shadow-2xs"
                      title="1 घटाएं (-1)"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleAdjustStock(p, 1)}
                      disabled={updatingId === p.id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-amber-50 active:scale-95 transition shadow-2xs"
                      title="1 बढ़ाएं (+1)"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleAdjustStock(p, 5)}
                      disabled={updatingId === p.id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-amber-50 active:scale-95 transition shadow-2xs font-bold text-xs"
                      title="5 बढ़ाएं (+5)"
                    >
                      +5
                    </button>
                  </div>
                </div>

                {isLow && (
                  <div className="mt-3 text-[11px] font-semibold text-red-600 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>स्टॉक 10 से कम है! कृपया नया माल मंगवाएं।</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
