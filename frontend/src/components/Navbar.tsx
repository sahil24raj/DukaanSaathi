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
  ShoppingBag
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
    { id: 'udhaar', label: 'Udhaar', labelHi: 'उधार खाता', icon: CreditCard },
    { id: 'inventory', label: 'Stock', labelHi: 'इन्वेंटरी', icon: Boxes },
    { id: 'orders', label: 'Orders', labelHi: 'आर्डर लिस्ट', icon: ShoppingBag },
    { id: 'analytics', label: 'Analytics', labelHi: 'रिपोर्ट', icon: BarChart3 },
    { id: 'customers', label: 'Customers', labelHi: 'ग्राहक', icon: Users },
    { id: 'demo-audio', label: 'Benchmarks', labelHi: 'सैंपल्स', icon: Radio },
    { id: 'about', label: 'About', labelHi: 'जानकारी', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🏪</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Dukan Sathi</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  दुकान साथी
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Smart Digital Partner for Indian Kirana Stores
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
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
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* System Badge */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold">{systemStatus?.gnani_api_key_configured ? 'Gnani Live API' : 'Prisma & Timbre'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar with scrolling */}
      <div className="md:hidden border-t border-slate-200/60 bg-white px-2 py-1.5 flex justify-start space-x-3 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2.5 text-[10px] rounded-lg font-bold shrink-0 transition ${
                isActive ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
