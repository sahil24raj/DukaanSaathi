import React, { useState } from 'react';
import { CustomerUdhaarRecord } from '../types';
import { 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Send, 
  CheckCircle2, 
  X,
  CreditCard,
  Plus
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
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUdhaarRecord | null>(INITIAL_CUSTOMERS[0]);
  const [search, setSearch] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [txType, setTxType] = useState<'given' | 'received'>('given');
  const [txAmount, setTxAmount] = useState<string>('');
  const [txDesc, setTxDesc] = useState<string>('');
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  const totalPendingUdhaar = customers.reduce((acc, c) => acc + c.total_due, 0);

  const filteredCustomers = customers.filter(c => 
    c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.customer_name_hi && c.customer_name_hi.includes(search)) ||
    c.phone.includes(search)
  );

  const handleAddTransaction = () => {
    if (!selectedCustomer) return;
    const amt = parseFloat(txAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newTx = {
      id: Date.now(),
      type: txType,
      amount: amt,
      description: txDesc || (txType === 'given' ? 'सामान उधारी' : 'भुगतान प्राप्त'),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedDue = txType === 'given' 
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
    setReminderToast(`WhatsApp रिमाइंडर भेजा गया: "नमस्ते ${customer.customer_name} जी, दुकान साथी पर आपका ₹${customer.total_due} बाकी है।"`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-6">
      
      {/* Header & KPI Summary Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>डिजिटल बही-खाता • Digital Khata Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ग्राहक उधार बही-खाता (Khata Ledger)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
            ग्राहकों का हिसाब-किताब रखें, जमा व उधारी दर्ज करें और 1-क्लिक में WhatsApp पर बिल रिमाइंडर भेजें।
          </p>
        </div>

        {/* Total Outstanding Callout Card */}
        <div className="bg-zinc-950/60 border border-white/[0.08] rounded-2xl p-4 flex items-center space-x-4 shadow-xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-bold font-mono text-xl text-rose-400">
            ₹
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              कुल बकाया उधारी (Total Outstanding)
            </span>
            <span className="text-2xl font-black font-mono tabular-nums text-rose-400">
              ₹{totalPendingUdhaar.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {reminderToast && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-semibold flex items-center space-x-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Main Grid: Customer List & Detail Transaction Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Customer Accounts (Left 5 Columns) */}
        <div className="md:col-span-5 bg-zinc-900/60 rounded-2xl p-4 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ग्राहक खोजें (Name or Phone)..."
              className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/[0.08] rounded-xl text-xs font-medium text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="divide-y divide-white/[0.04] max-h-[500px] overflow-y-auto">
            {filteredCustomers.map(cust => {
              const isSelected = selectedCustomer?.id === cust.id;
              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between ${
                    isSelected ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200' : 'hover:bg-zinc-800/50'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-zinc-100">{cust.customer_name}</h4>
                    <p className="text-[11px] text-zinc-400">{cust.customer_name_hi} • {cust.phone}</p>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs sm:text-sm font-bold font-mono tabular-nums ${cust.total_due > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      ₹{cust.total_due}
                    </span>
                    <span className={`text-[10px] font-semibold block ${cust.total_due > 0 ? 'text-rose-400/80' : 'text-emerald-400/80'}`}>
                      {cust.total_due > 0 ? 'बाकी है' : 'चुकता'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Customer Statement (Right 7 Columns) */}
        {selectedCustomer && (
          <div className="md:col-span-7 bg-zinc-900/60 rounded-2xl p-5 border border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4">
            <div>
              {/* Customer Statement Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base sm:text-lg font-bold text-white">{selectedCustomer.customer_name}</h2>
                    <span className="text-xs text-zinc-400">({selectedCustomer.customer_name_hi})</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">📞 +91 {selectedCustomer.phone}</p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  {selectedCustomer.total_due > 0 && (
                    <button
                      onClick={() => handleSendReminder(selectedCustomer)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp तगादा</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer active:scale-95 shadow-md shadow-amber-900/40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>हिसाब लिखें</span>
                  </button>
                </div>
              </div>

              {/* Outstanding Amount Callout Banner */}
              <div className="my-4 p-3.5 rounded-xl bg-black/40 border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    कुल शेष बाकी (Net Balance)
                  </span>
                  <span className="text-xs text-zinc-500">अंतिम लेन-देन: {selectedCustomer.last_transaction_date}</span>
                </div>
                <div className="text-right">
                  <span className={`text-xl sm:text-2xl font-black font-mono tabular-nums ${selectedCustomer.total_due > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ₹{selectedCustomer.total_due}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase">
                    {selectedCustomer.total_due > 0 ? 'लेने हैं (Receivable)' : 'हिसाब चुकता'}
                  </span>
                </div>
              </div>

              {/* Transactions Timeline */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                  लेन-देन इतिहास (Transaction History)
                </span>
                {selectedCustomer.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-zinc-950/40 flex items-center justify-between text-xs transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.type === 'given' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {tx.type === 'given' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="font-bold text-zinc-200">{tx.description}</span>
                        <span className="text-[10px] text-zinc-500 block">{tx.date}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-bold font-mono tabular-nums text-sm ${
                        tx.type === 'given' ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {tx.type === 'given' ? `+ ₹${tx.amount}` : `- ₹${tx.amount}`}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">
                        {tx.type === 'given' ? 'उधार दिया' : 'जमा हुआ'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl border border-white/[0.1] max-w-sm w-full p-5 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="font-bold text-sm text-white">
                नया लेन-देन लिखें ({selectedCustomer?.customer_name})
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTxType('given')}
                className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  txType === 'given' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-zinc-800 border-white/[0.06] text-zinc-400'
                }`}
              >
                उधार दिया (+ उधारी)
              </button>
              <button
                onClick={() => setTxType('received')}
                className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  txType === 'received' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-white/[0.06] text-zinc-400'
                }`}
              >
                जमा मिला (- उधारी)
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">रकम (Amount in ₹)</label>
              <input
                type="number"
                value={txAmount}
                onChange={e => setTxAmount(e.target.value)}
                placeholder="उदा: 500"
                className="w-full px-3 py-2 bg-black/50 border border-white/[0.08] rounded-xl text-sm font-bold font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">विवरण (Description)</label>
              <input
                type="text"
                value={txDesc}
                onChange={e => setTxDesc(e.target.value)}
                placeholder="उदा: 2kg Chawal, ya PhonePe"
                className="w-full px-3 py-2 bg-black/50 border border-white/[0.08] rounded-xl text-xs font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 border border-white/[0.06] transition cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                onClick={handleAddTransaction}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-md shadow-emerald-900/40 cursor-pointer"
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
