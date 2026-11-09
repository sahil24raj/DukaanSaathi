import React, { useState } from 'react';
import { CustomerUdhaarRecord } from '../types';
import { 
  Users, 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Send, 
  CheckCircle2, 
  X
} from 'lucide-react';

const INITIAL_CUSTOMERS: CustomerUdhaarRecord[] = [
  {
    id: 1,
    customer_name: 'Raju Sharma',
    customer_name_hi: 'राजू शर्मा',
    phone: '9876543210',
    total_due: 640.0,
    last_transaction_date: '2026-11-08',
    transactions: [
      { id: 101, type: 'given', amount: 320, description: '2kg Chawal, 1L Tel', date: '2026-11-06' },
      { id: 102, type: 'given', amount: 520, description: '5kg Atta, 2 Parle-G', date: '2026-11-07' },
      { id: 103, type: 'received', amount: 200, description: 'नकद जमा (Cash payment)', date: '2026-11-08' }
    ]
  },
  {
    id: 2,
    customer_name: 'Manoj Verma (Kaka)',
    customer_name_hi: 'मनोज वर्मा (काका)',
    phone: '9812345678',
    total_due: 1250.0,
    last_transaction_date: '2026-11-07',
    transactions: [
      { id: 201, type: 'given', amount: 1250, description: 'महीने का राशन (Monthly grocery)', date: '2026-11-07' }
    ]
  },
  {
    id: 3,
    customer_name: 'Sunita Devi',
    customer_name_hi: 'सुनीता देवी',
    phone: '9823456789',
    total_due: 210.0,
    last_transaction_date: '2026-11-05',
    transactions: [
      { id: 301, type: 'given', amount: 410, description: 'Detergent, Shampoo', date: '2026-11-04' },
      { id: 302, type: 'received', amount: 200, description: 'PhonePe जमा', date: '2026-11-05' }
    ]
  },
  {
    id: 4,
    customer_name: 'Amit Tailor',
    customer_name_hi: 'अमित दर्जी',
    phone: '9834567890',
    total_due: 0.0,
    last_transaction_date: '2026-11-02',
    transactions: [
      { id: 401, type: 'given', amount: 300, description: 'Biscuits & Tea', date: '2026-11-01' },
      { id: 402, type: 'received', amount: 300, description: 'हिसाब पूरा चुकता', date: '2026-11-02' }
    ]
  }
];

export const UdhaarManagementPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerUdhaarRecord[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUdhaarRecord | null>(null);
  
  // Modal states for new udhaar / payment
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'given' | 'received'>('given');
  const [txAmount, setTxAmount] = useState<string>('');
  const [txDesc, setTxDesc] = useState<string>('');

  // Reminder alert
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  const filteredCustomers = customers.filter(c =>
    c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.customer_name_hi && c.customer_name_hi.includes(search)) ||
    c.phone.includes(search)
  );

  const totalPendingUdhaar = customers.reduce((acc, c) => acc + c.total_due, 0);

  const handleSaveTransaction = () => {
    const amt = parseFloat(txAmount);
    if (!selectedCustomer || isNaN(amt) || amt <= 0) return;

    const newTx = {
      id: Date.now(),
      type: modalType,
      amount: amt,
      description: txDesc || (modalType === 'given' ? 'सामान उधारी' : 'रुपये जमा'),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedDue = modalType === 'given' 
      ? selectedCustomer.total_due + amt 
      : Math.max(0, selectedCustomer.total_due - amt);

    const updatedCustomer: CustomerUdhaarRecord = {
      ...selectedCustomer,
      total_due: updatedDue,
      last_transaction_date: newTx.date,
      transactions: [newTx, ...selectedCustomer.transactions]
    };

    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setSelectedCustomer(updatedCustomer);
    setShowAddModal(false);
    setTxAmount('');
    setTxDesc('');
  };

  const handleSendReminder = (customer: CustomerUdhaarRecord) => {
    setReminderToast(`पेमेंट रिमाइंडर एसएमएस ${customer.customer_name} (${customer.phone}) को भेजा गया: "प्रिय ग्राहक, दुकान साथी पर आपका ₹${customer.total_due} बकाया है।"`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  return (
    <div className="py-6 px-4 max-w-6xl mx-auto space-y-6">
      {/* Header & Pending Total Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            डिजिटल उधार बही-खाता (Udhaar Ledger)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain customer-wise credit balances, record repayments, and send payment reminders.
          </p>
        </div>

        {/* Total Outstanding Callout */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center space-x-3 text-amber-950">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center font-black text-amber-700">
            ₹
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              कुल बकाया उधारी (Total Market Udhaar)
            </span>
            <span className="text-xl font-black text-slate-900">
              ₹{totalPendingUdhaar.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {reminderToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Main Grid: Customer List & Detail Transaction Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Customer Accounts (Left 5 Columns) */}
        <div className="md:col-span-5 bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ग्राहक खोजें (Name or Phone)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {filteredCustomers.map(cust => {
              const isSelected = selectedCustomer?.id === cust.id;
              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`p-3 rounded-2xl cursor-pointer transition flex items-center justify-between ${
                    isSelected ? 'bg-amber-50/80 border border-amber-300' : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{cust.customer_name}</h4>
                    <p className="text-[11px] text-slate-500">{cust.customer_name_hi} • {cust.phone}</p>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-black ${cust.total_due > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                      ₹{cust.total_due}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {cust.total_due > 0 ? 'बाकी है' : 'चुकता'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Customer Statement & Timeline (Right 7 Columns) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
          {selectedCustomer ? (
            <>
              <div>
                {/* Customer Profile Banner */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedCustomer.customer_name}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      फोन: {selectedCustomer.phone} • अंतिम लेन-देन: {selectedCustomer.last_transaction_date}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">कुल बकाया</span>
                    <span className="text-2xl font-black text-red-600">₹{selectedCustomer.total_due}</span>
                  </div>
                </div>

                {/* Action Buttons: Add Udhaar, Receive Payment, Send Reminder */}
                <div className="py-4 flex flex-wrap gap-2 border-b border-slate-100">
                  <button
                    onClick={() => { setModalType('given'); setShowAddModal(true); }}
                    className="flex-1 py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center space-x-1 transition"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>उधार दिया (+ Udhaar)</span>
                  </button>

                  <button
                    onClick={() => { setModalType('received'); setShowAddModal(true); }}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center space-x-1 transition"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>रुपये मिले (- Jama)</span>
                  </button>

                  {selectedCustomer.total_due > 0 && (
                    <button
                      onClick={() => handleSendReminder(selectedCustomer)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 font-semibold text-xs flex items-center space-x-1 transition"
                      title="Send WhatsApp / SMS reminder"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>रिमाइंडर भेजें</span>
                    </button>
                  )}
                </div>

                {/* Statement Ledger History */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    खाता विवरणी (Ledger History)
                  </h4>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {selectedCustomer.transactions.map(tx => (
                      <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            tx.type === 'given' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {tx.type === 'given' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 block">{tx.description}</span>
                            <span className="text-[10px] text-slate-400">{tx.date}</span>
                          </div>
                        </div>

                        <span className={`font-black ${tx.type === 'given' ? 'text-red-600' : 'text-emerald-700'}`}>
                          {tx.type === 'given' ? `+ ₹${tx.amount}` : `- ₹${tx.amount}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Guidance */}
              <div className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-100">
                * सभी लेन-देन स्थानीय बही-खाते में सुरक्षित दर्ज होते हैं।
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              बाएं सूची में से किसी ग्राहक का चयन करें।
            </div>
          )}
        </div>
      </div>

      {/* Add / Receive Udhaar Modal */}
      {showAddModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {modalType === 'given' ? 'उधार जोड़ें (+ Udhaar)' : 'जमा दर्ज करें (- Payment)'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ग्राहक</label>
                <div className="p-2 bg-slate-50 rounded-xl text-slate-800 font-semibold">
                  {selectedCustomer.customer_name} ({selectedCustomer.customer_name_hi})
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">रुपये (Amount in ₹)*</label>
                <input
                  type="number"
                  value={txAmount}
                  onChange={e => setTxAmount(e.target.value)}
                  placeholder="उदा: 250"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">विवरण (Description)</label>
                <input
                  type="text"
                  value={txDesc}
                  onChange={e => setTxDesc(e.target.value)}
                  placeholder="उदा: 2kg Chawal, ya PhonePe"
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
                onClick={handleSaveTransaction}
                disabled={!txAmount || parseFloat(txAmount) <= 0}
                className={`flex-1 py-2 rounded-xl text-white text-xs font-bold ${
                  modalType === 'given' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                दर्ज करें (Save)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
