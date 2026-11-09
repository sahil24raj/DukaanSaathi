import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ApiKeyBanner } from './components/ApiKeyBanner';
import { LandingPage } from './pages/LandingPage';
import { OrderTakingPage } from './pages/OrderTakingPage';
import { SmartBillingPage } from './pages/SmartBillingPage';
import { UdhaarManagementPage } from './pages/UdhaarManagementPage';
import { InventoryPage } from './pages/InventoryPage';
import { OrdersPage } from './pages/OrdersPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CustomersPage } from './pages/CustomersPage';
import { DemoAudioPage } from './pages/DemoAudioPage';
import { AboutPage } from './pages/AboutPage';
import { api } from './services/api';
import { SystemStatus } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await api.getSystemStatus();
        setSystemStatus(status);
      } catch (err) {
        console.warn('Could not connect to backend status endpoint:', err);
      }
    };
    fetchStatus();
  }, []);

  const handleLoadSampleIntoAssistant = (text: string) => {
    setActiveTab('order');
    setTimeout(() => {
      const quickButton = document.querySelector(`button[title="${text}"]`) as HTMLButtonElement;
      if (quickButton) {
        quickButton.click();
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300 antialiased">
      {/* API Key Notification Banner */}
      <ApiKeyBanner
        systemStatus={systemStatus}
        onOpenSettings={() => setActiveTab('about')}
      />

      {/* Main App Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setActiveTab('billing')}
            onOpenVoiceDemo={() => setActiveTab('order')}
          />
        )}
        {activeTab === 'order' && (
          <OrderTakingPage
            systemStatus={systemStatus}
            onNavigateToOrders={() => setActiveTab('orders')}
          />
        )}
        {activeTab === 'billing' && (
          <SmartBillingPage
            onOrderSaved={() => setActiveTab('orders')}
          />
        )}
        {activeTab === 'udhaar' && <UdhaarManagementPage />}
        {activeTab === 'inventory' && <InventoryPage />}
        {activeTab === 'orders' && <OrdersPage />}
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'customers' && <CustomersPage />}
        {activeTab === 'demo-audio' && (
          <DemoAudioPage
            onLoadSampleIntoAssistant={handleLoadSampleIntoAssistant}
          />
        )}
        {activeTab === 'about' && (
          <AboutPage systemStatus={systemStatus} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#09090b]/80 backdrop-blur-md py-6 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-zinc-300">
              Dukan Sathi (दुकान साथी)
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Enterprise Voice POS for Indian Retail</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-zinc-500">
            <span>Powered by <span className="text-zinc-300 font-mono">Gnani Prisma v2.5</span> & <span className="text-zinc-300 font-mono">Timbre v2.5</span></span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-400">SR24PLUS Industrial Design</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
