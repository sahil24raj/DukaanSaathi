import React from 'react';
import { 
  Globe, 
  Mic, 
  Receipt, 
  Boxes, 
  CreditCard, 
  BarChart3, 
  Users, 
  Radio, 
  Info,
  ShoppingBag,
  Store
} from 'lucide-react';
import { SystemStatus } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: SystemStatus | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemStatus }) => {
  const navItems = [
    { id: 'landing', label: 'Home', labelHi: 'होम', icon: Globe },
    { id: 'order', label: 'Voice AI', labelHi: 'बोलिए', icon: Mic },
    { id: 'billing', label: 'POS Billing', labelHi: 'बिलिंग', icon: Receipt },
    { id: 'udhaar', label: 'Udhaar Khata', labelHi: 'उधार खाता', icon: CreditCard },
    { id: 'inventory', label: 'Stock', labelHi: 'स्टॉक', icon: Boxes },
    { id: 'orders', label: 'Orders', labelHi: 'आर्डर लिस्ट', icon: ShoppingBag },
    { id: 'analytics', label: 'Reports', labelHi: 'रिपोर्ट्स', icon: BarChart3 },
    { id: 'customers', label: 'Customers', labelHi: 'ग्राहक', icon: Users },
    { id: 'demo-audio', label: 'Audio Samples', labelHi: 'सैंपल्स', icon: Radio },
    { id: 'about', label: 'About', labelHi: 'जानकारी', icon: Info },
  ];

  const isConnected = systemStatus?.gnani_api_key_configured || false;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('landing')}
          >
            {/* Professional SVG Brand Glyph (No cartoon emojis!) */}
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20 group-hover:bg-emerald-700 transition-colors">
              <Store className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Dukaan Saathi</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                  दुकान साथी
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Voice Assistant for Indian Kirana & Retail
              </p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Medium Screen Navigation (Main shortcuts) */}
          <nav className="hidden md:flex xl:hidden items-center space-x-1">
            {[navItems[0], navItems[1], navItems[2], navItems[3], navItems[4], navItems[6]].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action / System Status Badge */}
          <div className="flex items-center space-x-2.5">
            <div 
              onClick={() => setActiveTab('about')}
              title={isConnected ? 'Gnani AI Cloud Connected' : 'Running in Local Fallback Mode'}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border cursor-pointer transition-colors ${
                isConnected 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="hidden sm:inline font-semibold">
                {isConnected ? 'Gnani v2.5 Online' : 'Local Fallback Engine'}
              </span>
            </div>

            {/* Quick POS Action Button */}
            <button
              onClick={() => setActiveTab('billing')}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>POS Bill</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-1 border-t border-slate-100 bg-slate-50/90 overflow-x-auto text-[11px]">
        {[navItems[0], navItems[1], navItems[2], navItems[3], navItems[4], navItems[5]].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg ${
                isActive ? 'text-emerald-700 font-bold bg-white shadow-2xs' : 'text-slate-500 font-medium'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.labelHi}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
