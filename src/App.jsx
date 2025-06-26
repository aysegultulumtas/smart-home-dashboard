import React, { useState } from 'react';
import { SmartHomeProvider } from './context/SmartHomeContext';
import Dashboard from './components/Dashboard/Dashboard';
import ControlPanel from './components/ControlPanel/ControlPanel';
import EnergyPanel from './components/ControlPanel/EnergyPanel';
import SecurityPanel from './components/ControlPanel/SecurityPanel';
import AutomationPanel from './components/ControlPanel/AutomationPanel';
import DevicesPanel from './components/ControlPanel/DevicesPanel';
import BackgroundEffects from './components/UI/BackgroundEffects';
import VoiceControl from './components/VoiceControl/VoiceControl';
import './App.css';

const SmartHomeApp = () => {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('home');
  
  const tabs = [
    { id: 'home', name: 'Ev Planı', component: Dashboard },
    { id: 'control', name: 'Kontrol Paneli', component: ControlPanel },
    { id: 'energy', name: 'Enerji Yönetimi', component: EnergyPanel },
    { id: 'security', name: 'Güvenlik', component: SecurityPanel },
    { id: 'automation', name: 'Otomasyon', component: AutomationPanel },
    { id: 'devices', name: 'Akıllı Cihazlar', component: DevicesPanel }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard;
  
  return (
    <SmartHomeProvider>
      <div className="min-h-screen relative">
        <BackgroundEffects theme={theme} />
        
        <div className="relative z-10">
          <header className={`app-header ${theme === 'dark' ? 'dark' : 'light'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <h1 className={`text-2xl font-bold bg-gradient-to-r ${
                      theme === 'dark' 
                        ? 'from-blue-400 to-purple-400' 
                        : 'from-blue-600 to-purple-600'
                    } bg-clip-text text-transparent`}>
                     Akıllı Ev Pro
                    </h1>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`status-indicator ${theme === 'dark' ? 'dark' : 'light'}`}>
                    <span className="status-dot"></span>
                    Sistem Aktif
                  </div>
                  
                  <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={`theme-toggle ${theme === 'dark' ? 'dark' : 'light'}`}
                  >
                    {theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
                  </button>
                </div>
              </div>
            </div>
          </header>
          
          <nav className={`app-navigation ${theme === 'dark' ? 'dark' : 'light'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`nav-tab ${activeTab === tab.id ? 'active' : ''} ${theme === 'dark' ? 'dark' : 'light'}`}
                  >
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
          
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <ActiveComponent theme={theme} />
            </div>
          </main>
        </div>
        
        <VoiceControl theme={theme} />
      </div>
    </SmartHomeProvider>
  );
};

export default SmartHomeApp;