import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ApiKeyBanner } from './components/ApiKeyBanner';
import { OrderTakingPage } from './pages/OrderTakingPage';
import { OrdersPage } from './pages/OrdersPage';
import { InventoryPage } from './pages/InventoryPage';
import { DashboardPage } from './pages/DashboardPage';
import { DemoAudioPage } from './pages/DemoAudioPage';
import { AboutPage } from './pages/AboutPage';
import { api } from './services/api';
import { SystemStatus } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('order');
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
    // Allow state transition
    setTimeout(() => {
      const quickButton = document.querySelector(`button[title="${text}"]`) as HTMLButtonElement;
      if (quickButton) {
        quickButton.click();
      }
    }, 100);
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
        {activeTab === 'order' && (
          <OrderTakingPage
            systemStatus={systemStatus}
            onNavigateToOrders={() => setActiveTab('orders')}
          />
        )}
        {activeTab === 'orders' && <OrdersPage />}
        {activeTab === 'inventory' && <InventoryPage />}
        {activeTab === 'dashboard' && <DashboardPage />}
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
      <footer className="border-t border-slate-200/80 bg-white/60 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          <strong>Dukaan Saathi (दुकान साथी)</strong> • Built for the <em>Great Indian AI Internship Challenge by Gnani AI</em>
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Developed by <strong>Sahil</strong> • Gnani Prisma v2.5 STT & Timbre v2.5 TTS
        </p>
      </footer>
    </div>
  );
};

export default App;

