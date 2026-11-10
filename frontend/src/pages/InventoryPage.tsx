import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Product } from '../types';
import { 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  Minus, 
  Search, 
  Database, 
  Boxes, 
  PackagePlus, 
  Trash2, 
  X
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // New Product Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [hindiName, setHindiName] = useState<string>('');
  const [aliases, setAliases] = useState<string>('');
  const [unit, setUnit] = useState<string>('kg');
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [category, setCategory] = useState<string>('Grains & Staples');

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

  const handleAddProduct = async () => {
    if (!name.trim() || !price || isNaN(parseFloat(price))) return;
    try {
      const newProd = await api.addProduct({
        name: name.trim(),
        hindi_name: hindiName.trim() || undefined,
        aliases: aliases.trim() || name.toLowerCase().trim(),
        unit: unit.trim(),
        price: parseFloat(price),
        stock: parseFloat(stock) || 0,
        category: category
      });
      setProducts(prev => [newProd, ...prev]);
      setShowAddModal(false);
      setName('');
      setHindiName('');
      setAliases('');
      setPrice('');
      setStock('');
    } catch (err: any) {
      alert(`सामान जोड़ने में विफल: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`क्या आप सच में "${product.name}" को कैटलॉग से हटाना चाहते हैं?`)) {
      try {
        await api.deleteProduct(product.id);
        setProducts(prev => prev.filter(p => p.id !== product.id));
      } catch (err) {
        alert('हटाने में विफल');
      }
    }
  };

  const handleReseed = async () => {
    if (confirm('क्या आप डिफ़ॉल्ट किराना कैटलॉग रीसेट करना चाहते हैं? (Reset to default catalog?)')) {
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
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-1.5 backdrop-blur-md">
            <Boxes className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Kirana Inventory</span>
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              दुकान का स्टॉक <span className="text-emerald-400 font-normal text-xl">(Inventory)</span>
            </h1>
            <span className="bg-white/[0.08] text-neutral-300 border border-white/[0.1] text-xs px-2.5 py-0.5 rounded-full font-bold font-mono tabular-nums">
              {products.length} Items
            </span>
            {lowStockCount > 0 && (
              <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>{lowStockCount} Low Stock (&lt;10)</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
            Real-time stock tracking with fuzzy alias matching for Hindi/Hinglish speech orders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95"
          >
            <PackagePlus className="w-4 h-4 text-neutral-950 stroke-[2.5]" />
            <span>+ नया सामान जोड़ें</span>
          </button>
          <button
            onClick={handleReseed}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-white/[0.12] bg-zinc-900/60 hover:bg-zinc-800/80 text-xs font-bold text-neutral-300 transition cursor-pointer backdrop-blur-md"
            title="Reset default catalog"
          >
            <Database className="w-3.5 h-3.5 text-neutral-400" />
            <span>कैटलॉग रीसेट</span>
          </button>
          <button
            onClick={fetchProducts}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-white/[0.12] bg-zinc-900/60 hover:bg-zinc-800/80 text-xs font-bold text-neutral-300 transition cursor-pointer backdrop-blur-md active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>रिफ्रेश</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="सर्च करें (उदा: chawal, tel, rice, salt, आटा)..."
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/70 backdrop-blur-md rounded-xl border border-white/[0.12] text-xs sm:text-sm font-medium text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/70 transition shadow-inner"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16 bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/[0.08] text-neutral-400">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium">स्टॉक लोड हो रहा है...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const isLow = p.stock < 10;
            const isOut = p.stock === 0;
            return (
              <div
                key={p.id}
                className={`bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-5 border transition-all hover:border-emerald-500/40 flex flex-col justify-between ${
                  isOut 
                    ? 'border-rose-500/40 bg-rose-950/20' 
                    : isLow 
                    ? 'border-amber-500/40 bg-amber-950/20' 
                    : 'border-white/[0.08]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white text-sm sm:text-base">{p.name}</h3>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="text-zinc-600 hover:text-rose-400 p-0.5 transition cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-emerald-400">{p.hindi_name || '—'}</p>
                    </div>
                    <span className="text-sm sm:text-base font-bold font-mono tabular-nums text-white">
                      ₹{p.price} <span className="text-xs font-normal text-neutral-400">/{p.unit}</span>
                    </span>
                  </div>

                  {/* Aliases */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      वॉयस उपनाम (Matched Aliases)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {p.aliases.split(',').slice(0, 4).map((alias, i) => (
                        <span key={i} className="text-[10px] bg-white/[0.06] text-neutral-300 border border-white/[0.08] px-2 py-0.5 rounded font-medium">
                          {alias.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stock Controls */}
                <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase block font-bold">उपलब्ध स्टॉक</span>
                    <span className={`text-base font-black font-mono tabular-nums ${
                      isOut ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {p.stock} <span className="text-xs font-normal text-neutral-400">{p.unit}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleAdjustStock(p, -1)}
                      disabled={p.stock <= 0 || updatingId === p.id}
                      className="w-8 h-8 rounded-lg border border-white/[0.12] bg-zinc-800/80 hover:bg-zinc-700/80 disabled:opacity-30 flex items-center justify-center text-white transition cursor-pointer"
                      title="Decrease stock"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleAdjustStock(p, 1)}
                      disabled={updatingId === p.id}
                      className="w-8 h-8 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 transition cursor-pointer"
                      title="Increase stock"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="font-bold text-white text-base flex items-center space-x-2">
                <PackagePlus className="w-5 h-5 text-emerald-400" />
                <span>नया सामान जोड़ें (Add New Product)</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-300 block mb-1">सामान का नाम (English) *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="उदा: Masoor Dal"
                  className="w-full px-3 py-2 bg-black/50 border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">हिंदी नाम (Hindi Name)</label>
                <input
                  type="text"
                  value={hindiName}
                  onChange={e => setHindiName(e.target.value)}
                  placeholder="उदा: मसूर दाल"
                  className="w-full px-3 py-2 bg-black/50 border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">दर प्रति इकाई (Price ₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="उदा: 120"
                    className="w-full px-3 py-2 bg-black/50 border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-300 block mb-1">इकाई (Unit)</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-white/[0.08] rounded-xl text-white focus:outline-none"
                  >
                    <option value="kg">kg (किलो)</option>
                    <option value="litre">litre (लीटर)</option>
                    <option value="packet">packet (पैकेट)</option>
                    <option value="bottle">bottle (बोतल)</option>
                    <option value="piece">piece (नग)</option>
                    <option value="gm">gm (ग्राम)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">शुरुआती स्टॉक (Stock)</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    placeholder="उदा: 50"
                    className="w-full px-3 py-2 bg-black/50 border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-300 block mb-1">कैटेगरी (Category)</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-white/[0.08] rounded-xl text-white focus:outline-none"
                  >
                    <option value="Grains & Staples">अनाज व आटा</option>
                    <option value="Edible Oils">तेल व घी</option>
                    <option value="Pulses & Spices">दालें व मसाले</option>
                    <option value="Snacks & Bakery">बिस्कुट व स्नैक्स</option>
                    <option value="FMCG & Hygiene">साफ-सफाई व प्रसाधन</option>
                    <option value="General">सामान्य (General)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">वॉयस उपनाम (Voice Aliases - Comma separated)</label>
                <input
                  type="text"
                  value={aliases}
                  onChange={e => setAliases(e.target.value)}
                  placeholder="उदा: masoor, masur daal, laal daal"
                  className="w-full px-3 py-2 bg-black/50 border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  ग्राहक माइक में जो नाम बोल सकते हैं, वो सभी अल्पविराम (comma) लगाकर लिखें।
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2.5">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!name.trim() || !price}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 text-xs font-bold transition cursor-pointer shadow-md shadow-emerald-500/20"
              >
                सामान जोड़ें (Save)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
