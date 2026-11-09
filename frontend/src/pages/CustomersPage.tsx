import React, { useState } from 'react';
import { CustomerProfile } from '../types';
import { 
  Search, 
  UserPlus, 
  Phone, 
  MapPin, 
  X
} from 'lucide-react';

const INITIAL_PROFILES: CustomerProfile[] = [
  {
    id: 1,
    name: 'Raju Sharma (राजू शर्मा)',
    phone: '9876543210',
    address: 'Gali No. 4, Main Bazaar',
    total_orders: 14,
    total_spent: 4850,
    outstanding_udhaar: 640,
    recent_activity: 'कल 2kg चावल, 1L तेल खरीदा'
  },
  {
    id: 2,
    name: 'Manoj Verma (काका)',
    phone: '9812345678',
    address: 'Near Old Water Tank',
    total_orders: 28,
    total_spent: 12400,
    outstanding_udhaar: 1250,
    recent_activity: '7 Nov को महीने का राशन लिया'
  },
  {
    id: 3,
    name: 'Sunita Devi (सुनीता देवी)',
    phone: '9823456789',
    address: 'Ward 2, Shiv Mandir Marg',
    total_orders: 9,
    total_spent: 2150,
    outstanding_udhaar: 210,
    recent_activity: '5 Nov को PhonePe से ₹200 जमा किए'
  },
  {
    id: 4,
    name: 'Amit Tailor (अमित टेलर)',
    phone: '9834567890',
    address: 'Tailor Gali, Shop #12',
    total_orders: 22,
    total_spent: 6900,
    outstanding_udhaar: 0,
    recent_activity: '2 Nov को सारा बकाया चुकता किया'
  }
];

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_PROFILES);
  const [search, setSearch] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  
  // New Customer Form State
  const [newName, setNewName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newAddress, setNewAddress] = useState<string>('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateCustomer = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    const newCust: CustomerProfile = {
      id: Date.now(),
      name: newName.trim(),
      phone: newPhone.trim(),
      address: newAddress.trim() || 'Local Customer',
      total_orders: 0,
      total_spent: 0,
      outstanding_udhaar: 0,
      recent_activity: 'नया ग्राहक खाता खोला'
    };

    setCustomers([newCust, ...customers]);
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
          <h1 className="text-2xl font-black text-slate-900">
            दुकान के ग्राहक (Customer Directory)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain customer profiles, purchase history, contact directories, and active credit statuses.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>नया ग्राहक जोड़ें (Add Customer)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ग्राहक का नाम या फोन नंबर खोजें..."
          className="w-full pl-9 pr-3 py-2 bg-white rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      {/* Customer Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cust => (
          <div
            key={cust.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{cust.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{cust.phone}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    cust.outstanding_udhaar > 0 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {cust.outstanding_udhaar > 0 ? `₹${cust.outstanding_udhaar} बाकी` : 'कोई उधार नहीं'}
                  </span>
                </div>
              </div>

              {cust.address && (
                <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-2">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{cust.address}</span>
                </p>
              )}

              {/* Statistics Row */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">कुल आर्डर</span>
                  <strong className="text-slate-800">{cust.total_orders} बार</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">कुल खरीदारी</span>
                  <strong className="text-slate-800">₹{cust.total_spent.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 flex items-center space-x-1 italic">
              <span className="truncate">गतिविधि: {cust.recent_activity}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">नया ग्राहक जोड़ें (Add Customer)</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">पूरा नाम (Full Name)*</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="उदा: Ramesh Kumar"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">मोबाइल नंबर (Phone)*</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="उदा: 9876543210"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">पता / मोहल्ला (Address)</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  placeholder="उदा: Near Shiv Mandir"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                रद्द करें
              </button>
              <button
                onClick={handleCreateCustomer}
                disabled={!newName.trim() || !newPhone.trim()}
                className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
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
