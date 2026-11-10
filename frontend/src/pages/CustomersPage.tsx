import React, { useState, useEffect } from 'react';
import { CustomerProfile } from '../types';
import { api } from '../services/api';
import { 
  Search, 
  UserPlus, 
  Phone, 
  MapPin, 
  X,
  Users,
  MessageSquare
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [search, setSearch] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  
  // New Customer Form State
  const [newName, setNewName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newAddress, setNewAddress] = useState<string>('');

  useEffect(() => {
    const list = api.getCustomerProfiles();
    setCustomers(list);
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateCustomer = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    api.createCustomerProfile(newName.trim(), newPhone.trim(), newAddress.trim());
    const refreshed = api.getCustomerProfiles();
    setCustomers(refreshed);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewAddress('');
  };

  return (
    <div className="py-6 px-4 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-1.5 backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Customer Khata & Profiles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            दुकान के ग्राहक <span className="text-emerald-400 font-normal text-xl">(Customer Directory)</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
            Maintain customer profiles, purchase history, contact directories, and active credit statuses.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition cursor-pointer active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>नया ग्राहक जोड़ें (Add Customer)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ग्राहक का नाम या फोन नंबर खोजें..."
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/70 backdrop-blur-md rounded-xl border border-white/[0.12] text-xs sm:text-sm font-medium text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/70 transition shadow-inner"
        />
      </div>

      {/* Customer Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(cust => (
          <div
            key={cust.id}
            className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-2xl hover:border-emerald-500/30 transition-all duration-300 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">{cust.name}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <a
                      href={`tel:${cust.phone}`}
                      className="text-xs text-neutral-400 hover:text-emerald-400 flex items-center space-x-1.5 transition"
                      title="Call customer"
                    >
                      <Phone className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="font-mono">{cust.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/91${cust.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1 transition"
                      title="Chat on WhatsApp"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    cust.outstanding_udhaar > 0 
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' 
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {cust.outstanding_udhaar > 0 ? `₹${cust.outstanding_udhaar} बाकी` : 'कोई उधार नहीं'}
                  </span>
                </div>
              </div>

              {cust.address && (
                <p className="text-xs text-neutral-400 flex items-center space-x-1.5 mt-2.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{cust.address}</span>
                </p>
              )}

              {/* Statistics Row */}
              <div className="mt-4 pt-3.5 border-t border-zinc-800/80 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-zinc-800/60 p-2.5 rounded-xl border border-white/[0.04]">
                  <span className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">कुल आर्डर</span>
                  <strong className="text-white text-sm">{cust.total_orders} बार</strong>
                </div>
                <div className="bg-zinc-800/60 p-2.5 rounded-xl border border-white/[0.04]">
                  <span className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">कुल खरीदारी</span>
                  <strong className="text-emerald-400 text-sm font-mono">₹{cust.total_spent.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-neutral-400 border-t border-zinc-800/80 flex items-center space-x-1 italic">
              <span className="truncate">गतिविधि: {cust.recent_activity}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900/95 backdrop-blur-2xl rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-white/[0.12] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-base text-white">नया ग्राहक जोड़ें (Add Customer)</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">पूरा नाम (Full Name)*</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="उदा: Ramesh Kumar"
                  className="w-full p-2.5 bg-zinc-800/80 border border-white/[0.1] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/70"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">मोबाइल नंबर (Phone)*</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="उदा: 9876543210"
                  className="w-full p-2.5 bg-zinc-800/80 border border-white/[0.1] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/70"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">पता / मोहल्ला (Address)</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  placeholder="उदा: Near Shiv Mandir"
                  className="w-full p-2.5 bg-zinc-800/80 border border-white/[0.1] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/70"
                />
              </div>
            </div>

            <div className="pt-3 flex gap-2.5">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-neutral-300 text-xs font-bold transition cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                onClick={handleCreateCustomer}
                disabled={!newName.trim() || !newPhone.trim()}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 text-xs font-bold transition cursor-pointer shadow-md shadow-emerald-500/20"
              >
                सेव करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
