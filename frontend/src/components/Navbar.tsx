import React, { useState } from 'react';
import { 
  Globe, 
  Mic, 
  Receipt, 
  Boxes, 
  CreditCard, 
  BarChart3, 
  ShoppingBag,
  Store,
  ChevronDown,
  Sparkles,
  Plus
} from 'lucide-react';
import { SystemStatus } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: SystemStatus | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemStatus }) => {
  const [moreOpen, setMoreOpen] = useState(false);

  const mainNavItems = [
    { id: 'landing', label: 'Overview', labelHi: 'होम', icon: Globe },
    { id: 'order', label: 'Voice AI', labelHi: 'वॉयस काउंटर', icon: Mic, badge: 'Live' },
    { id: 'billing', label: 'POS Billing', labelHi: 'बिलिंग', icon: Receipt },
    { id: 'udhaar', label: 'Udhaar Khata', labelHi: 'खाता', icon: CreditCard },
    { id: 'inventory', label: 'Stock', labelHi: 'स्टॉक', icon: Boxes },
    { id: 'orders', label: 'Orders', labelHi: 'आर्डर', icon: ShoppingBag },
  ];

  const secondaryNavItems = [
    { id: 'analytics', label: 'Analytics & Reports', labelHi: 'रिपोर्ट', icon: BarChart3 },
    { id: 'customers', label: 'Customer Directory', labelHi: 'ग्राहक', icon: Store },
    { id: 'demo-audio', label: 'Benchmark Audio Lab', labelHi: 'सैंपल्स', icon: Sparkles },
    { id: 'about', label: 'System & Architecture', labelHi: 'जानकारी', icon: Store },
  ];

  const isConnected = systemStatus?.gnani_api_key_configured || false;

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/85 backdrop-blur-xl border-b border-white/[0.08] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brandmark */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group select-none"
            onClick={() => setActiveTab('landing')}
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 flex items-center justify-center shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#09090b] rounded-[6px] flex items-center justify-center">
                <Store className="w-4 h-4 text-emerald-400 stroke-[2.2]" />
              </div>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-bold text-sm tracking-tight text-white font-sans">
                Dukaan<span className="text-emerald-400">Saathi</span>
              </span>
              <span className="text-[10px] font-medium text-neutral-400 font-sans tracking-wide">
                दुकान साथी
              </span>
            </div>
          </div>

          {/* Central Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMoreOpen(false);
                  }}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-white bg-white/[0.08] shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-emerald-400 rounded-full" />
                  )}
                </button>
              );
            })}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  moreOpen ? 'text-white bg-white/[0.08]' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-[#121215] border border-white/[0.1] shadow-2xl p-1.5 z-50 animate-fadeIn">
                  {secondaryNavItems.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveTab(sec.id);
                        setMoreOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] transition text-left cursor-pointer"
                    >
                      <sec.icon className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{sec.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action & Connectivity Indicators */}
          <div className="flex items-center space-x-3">
            {/* Live Engine Status Chip */}
            <div 
              onClick={() => setActiveTab('about')}
              title="Voice AI Engine Ready (Web Speech & Kirana Rule Parser)"
              className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer transition text-[11px]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-emerald-300 font-bold text-[11px]">
                {isConnected ? 'Gnani v2.5' : 'Voice AI Ready'}
              </span>
            </div>

            {/* Quick POS Trigger Action */}
            <button
              onClick={() => setActiveTab('billing')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-neutral-950 font-bold text-xs transition-all shadow-sm shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>New Bill</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sticky Tab Scroll Strip */}
      <div className="lg:hidden flex items-center space-x-1 px-3 py-1.5 border-t border-white/[0.06] bg-[#09090b] overflow-x-auto text-xs">
        {mainNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 rounded-md shrink-0 text-xs font-medium transition ${
                isActive ? 'text-white bg-white/[0.1] font-bold' : 'text-neutral-400'
              }`}
            >
              {item.labelHi}
            </button>
          );
        })}
      </div>
    </header>
  );
};
