# Admin Panel Architecture & Blueprint

**Target:** Enterprise-grade back-office, store management, and administrative control consoles.  
**Use Cases:** Dukaan Saathi Merchant Admin, System Audit Loggers, Khata Reconciliation Panels.

---

## 1. Ergonomic Requirements
Admin panels are used 8+ hours a day by operators. Every millisecond saved in navigation, data entry, and confirmation workflows translates to direct business velocity.

1. **Information Density**: High-density table view with configurable column visibility.
2. **Inline Fast Actions**: 1-click status updates (e.g. "Mark Paid", "Print KOT", "Restock").
3. **Keyboard Accelerators**:
   - `/` Focus search.
   - `J` / `K` Navigate table rows.
   - `Enter` Open detail modal or drawer.
   - `Esc` Close active drawer/modal.
4. **Destructive Action Safety**: Two-step confirmations for item deletion or ledger balance erasure with explicit typed confirmation for high-risk actions.
5. **Auditing**: Every record must display `created_at`, `updated_by`, and audit history.

---

## 2. Production Code Blueprint: High-Density Audit Table

```tsx
import React, { useState } from 'react';
import { Search, Filter, Download, MoreVertical, CheckCircle2, Clock } from 'lucide-react';

interface AuditRow {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  amount: number;
  status: 'completed' | 'pending';
}

const SAMPLE_LOGS: AuditRow[] = [
  { id: 'TX-901', timestamp: '10:45 AM', operator: 'Sahil (Admin)', action: 'Udhaar Settlement', amount: 450, status: 'completed' },
  { id: 'TX-902', timestamp: '10:52 AM', operator: 'Voice Assistant', action: 'Order #104 Placed', amount: 320, status: 'completed' },
  { id: 'TX-903', timestamp: '11:02 AM', operator: 'Ramesh Store', action: 'Credit Limit Adjusted', amount: 5000, status: 'pending' },
];

export const AdminAuditPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 overflow-hidden shadow-xl">
      {/* Control Toolbar */}
      <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search audit trail... (/)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-medium border border-neutral-700/60">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-medium border border-neutral-700/60">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-950/80 text-neutral-400 font-semibold uppercase tracking-wider border-b border-neutral-800">
            <tr>
              <th className="py-3 px-4">Ref ID</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Operator</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {SAMPLE_LOGS.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4 font-mono font-medium text-neutral-300">{row.id}</td>
                <td className="py-3 px-4 text-neutral-400">{row.timestamp}</td>
                <td className="py-3 px-4 text-neutral-200 font-medium">{row.operator}</td>
                <td className="py-3 px-4 text-neutral-300">{row.action}</td>
                <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-neutral-100">
                  ₹{row.amount.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4">
                  {row.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-850 px-2 py-0.5 rounded-full font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/60 border border-amber-850 px-2 py-0.5 rounded-full font-medium">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <button className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-neutral-200">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```
