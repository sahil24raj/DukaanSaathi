import React from 'react';
import { Mic, ShoppingBag, Boxes, BarChart3, Radio, Info } from 'lucide-react';
import { SystemStatus } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: SystemStatus | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemStatus }) => {
  const navItems = [
    { id: 'order', label: 'Boliye / Order', labelHi: 'बोलिए / ऑर्डर', icon: Mic },
    { id: 'orders', label: 'Orders', labelHi: 'आर्डर लिस्ट', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory', labelHi: 'स्टॉक / माल', icon: Boxes },
    { id: 'dashboard', label: 'Dashboard', labelHi: 'डैशबोर्ड', icon: BarChart3 },
    { id: 'demo-audio', label: 'Demo Audio', labelHi: 'ऑडियो सैंपल्स', icon: Radio },
    { id: 'about', label: 'About & Tech', labelHi: 'बारे में', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('order')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🏪</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Dukaan Saathi</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  दुकान साथी
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Kirana Voice AI • Powered by Gnani AI Prisma & Timbre
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* System Badge */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{systemStatus?.gnani_api_key_configured ? 'Gnani Live API' : 'Prisma & Timbre Ready'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden border-t border-slate-200/60 bg-white px-2 py-1.5 flex justify-around overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 text-[11px] rounded-md font-medium shrink-0 ${
                isActive ? 'text-amber-700 bg-amber-50' : 'text-slate-600'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label.split('/')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

