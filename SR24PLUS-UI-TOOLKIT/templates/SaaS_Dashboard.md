# SaaS Dashboard Architecture & Blueprint

**Target:** High-density, high-usability business and analytics dashboards.  
**Use Cases:** Dukan Sathi Store Manager, SR24Plus Cloud Console, FinTech / Logistics monitors.

---

## 1. Blueprint Structure

```
+-------------------------------------------------------------------------------+
| TopBar: [Brand Logo] [Search Cmd+K]                [Notifications] [Profile]  |
+---------+---------------------------------------------------------------------+
| Sidebar | Main Content Area                                                   |
| - Home  |  +---------------------------------------------------------------+  |
| - Sales |  | Page Header: Title + Context Description      [Primary Action] |  |
| - Khata |  +---------------------------------------------------------------+  |
| - Stock |  | KPI Strip: [Metric 1]  [Metric 2]  [Metric 3]   [Metric 4]    |  |
| - Sttgs |  +---------------------------------------------------------------+  |
|         |  | Interactive Chart / Feed   | Recent Activity / Quick Actions  |  |
|         |  +----------------------------+----------------------------------+  |
|         |  | Data Table: Filters, Bulk Actions, Paginated Rows             |  |
+---------+---------------------------------------------------------------------+
```

---

## 2. Key Component Checklist
1. **Collapsible Semantic Sidebar**: Accessible navigation with active indicator (`layoutId`), keyboard shortcuts, and responsive drawer on mobile.
2. **Command Palette (`Cmd+K`)**: Fast search across transactions, customers, and inventory items.
3. **KPI Metrics Grid**:
   - Primary metric value formatted with `font-mono` and `tabular-nums`.
   - Comparative delta (`+12.4% vs last week`) with contextual badge.
   - Micro sparkline or bar chart for trend comprehension.
4. **Data Table Engine**:
   - Column sorting.
   - Status chips with consistent color semantics (Active: emerald, Pending: amber, Overdue: red).
   - Empty state illustration with clear primary recovery action ("No orders found. Create your first order").
5. **Real-Time Toast Notifications**: Non-intrusive bottom-right feedback for completed actions.

---

## 3. Production Code Snippet: KPI Metric Card

```tsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  isPositive,
  subtext,
}) => {
  return (
    <div className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/80 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-neutral-400 tracking-wide uppercase">
          {label}
        </span>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive
              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-850'
              : 'bg-rose-950/60 text-rose-400 border border-rose-850'
          }`}
        >
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <div>
        <div className="text-2xl font-bold font-mono tracking-tight text-neutral-100 tabular-nums">
          {value}
        </div>
        <p className="text-xs text-neutral-400 mt-1">{subtext}</p>
      </div>
    </div>
  );
};
```
