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
    <div className="py-6 px-4 max-w-6xl mx-auto space-y-6">
      
      {/* Header & KPI Summary Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-1.5">
            <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
            <span>Khatabook / Digital Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            डिजिटल उधार बही-खाता (Khata Ledger)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            ग्राहकों का हिसाब-किताब रखें, जमा व उधारी दर्ज करें और WhatsApp पर रिमाइंडर भेजें।
          </p>
        </div>

        {/* Total Outstanding Callout Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center space-x-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center font-bold font-mono text-xl text-rose-600">
            ₹
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              कुल बकाया उधारी (Total Outstanding)
            </span>
            <span className="text-2xl font-black font-mono tabular-nums text-slate-900">
              ₹{totalPendingUdhaar.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {reminderToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center space-x-2 animate-fadeIn shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Main Grid: Customer List & Detail Transaction Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Customer Accounts (Left 5 Columns) */}
        <div className="md:col-span-5 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ग्राहक खोजें (Name or Phone)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {filteredCustomers.map(cust => {
              const isSelected = selectedCustomer?.id === cust.id;
              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between ${
                    isSelected ? 'bg-emerald-50/70 border border-emerald-300' : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{cust.customer_name}</h4>
                    <p className="text-[11px] text-slate-500">{cust.customer_name_hi} • {cust.phone}</p>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs sm:text-sm font-bold font-mono tabular-nums ${cust.total_due > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      ₹{cust.total_due}
                    </span>
                    <span className={`text-[10px] font-semibold block ${cust.total_due > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
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
          <div className="md:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              {/* Customer Statement Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900">{selectedCustomer.customer_name}</h2>
                    <span className="text-xs text-slate-500">({selectedCustomer.customer_name_hi})</span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">📞 +91 {selectedCustomer.phone}</p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  {selectedCustomer.total_due > 0 && (
                    <button
                      onClick={() => handleSendReminder(selectedCustomer)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-700" />
                      <span>WhatsApp तगादा</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>हिसाब लिखें</span>
                  </button>
                </div>
              </div>

              {/* Outstanding Amount Callout Banner */}
              <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    कुल शेष बाकी (Net Balance)
                  </span>
                  <span className="text-xs text-slate-400">अंतिम लेन-देन: {selectedCustomer.last_transaction_date}</span>
                </div>
                <div className="text-right">
                  <span className={`text-xl sm:text-2xl font-black font-mono tabular-nums ${selectedCustomer.total_due > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    ₹{selectedCustomer.total_due}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">
                    {selectedCustomer.total_due > 0 ? 'लेने हैं (Receivable)' : 'हिसाब चुकता'}
                  </span>
                </div>
              </div>

              {/* Transactions Timeline */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  लेन-देन इतिहास (Transaction History)
                </span>
                {selectedCustomer.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-white flex items-center justify-between text-xs transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.type === 'given' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {tx.type === 'given' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800">{tx.description}</span>
                        <span className="text-[10px] text-slate-400 block">{tx.date}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-bold font-mono tabular-nums text-sm ${
                        tx.type === 'given' ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        {tx.type === 'given' ? `+ ₹${tx.amount}` : `- ₹${tx.amount}`}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                नया लेन-देन लिखें ({selectedCustomer?.customer_name})
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTxType('given')}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  txType === 'given' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                उधार दिया (+ उधारी)
              </button>
              <button
                onClick={() => setTxType('received')}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  txType === 'received' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                जमा मिला (- उधारी)
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">रकम (Amount in ₹)</label>
              <input
                type="number"
                value={txAmount}
                onChange={e => setTxAmount(e.target.value)}
                placeholder="उदा: 500"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">विवरण (Description)</label>
              <input
                type="text"
                value={txDesc}
                onChange={e => setTxDesc(e.target.value)}
                placeholder="उदा: 2kg Chawal, ya PhonePe"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
              >
                रद्द करें
              </button>
              <button
                onClick={handleAddTransaction}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition shadow-xs"
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
