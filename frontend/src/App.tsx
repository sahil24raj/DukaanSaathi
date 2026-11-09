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
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans">
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
      <footer className="border-t border-slate-200/80 bg-white/70 py-5 px-4 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          <strong>Dukan Sathi (दुकान साथी)</strong> • Smart Digital Business Partner for Indian Kirana Stores
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Developed by <strong>Sahil</strong> • Powered by Gnani Prisma v2.5 STT & Timbre v2.5 TTS
        </p>
      </footer>
    </div>
  );
};

export default App;
