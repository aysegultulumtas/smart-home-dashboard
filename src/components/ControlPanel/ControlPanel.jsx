import React, { useState } from 'react';
import { useSmartHome } from '../../context/SmartHomeContext';
import DeviceOverview from './DeviceOverview';
import EnergyWidget from './EnergyWidget';
import WeatherWidget from './WeatherWidget';
import './ControlPanel.css';

const ControlPanel = ({ theme }) => {
  const { devices, updateDeviceState } = useSmartHome();
  const [activeWidget, setActiveWidget] = useState('overview');

  const widgets = [
    { id: 'overview', name: 'Genel Bakış', icon: '🏠' },
    { id: 'energy', name: 'Enerji', icon: '⚡' },
    { id: 'weather', name: 'Hava Durumu', icon: '🌤️' },
    { id: 'security', name: 'Güvenlik', icon: '🔒' }
  ];

  const renderWidget = () => {
    switch (activeWidget) {
      case 'overview':
        return <DeviceOverview theme={theme} devices={devices} updateDeviceState={updateDeviceState} />;
      case 'energy':
        return <EnergyWidget theme={theme} powerMode={devices.powerMode} />;
      case 'weather':
        return <WeatherWidget theme={theme} weather={devices.weather} />;
      case 'security':
        return <SecurityWidget theme={theme} security={devices.security} doors={devices.doors} updateDeviceState={updateDeviceState} />;
      default:
        return <DeviceOverview theme={theme} devices={devices} updateDeviceState={updateDeviceState} />;
    }
  };

  return (
    <div className={`control-panel-professional ${theme}`}>
      {/* Sadece başlık */}
      <div className="panel-header-clean">
        <h2>Kontrol Paneli</h2>
      </div>

      {/* Widget seçici -  */}
      <div className="widget-selector-professional">
        {widgets.map(widget => (
          <button
            key={widget.id}
            onClick={() => setActiveWidget(widget.id)}
            className={`widget-button-pro ${activeWidget === widget.id ? 'active' : ''}`}
          >
            <span className="widget-icon-pro">{widget.icon}</span>
            <span className="widget-text-pro">{widget.name}</span>
          </button>
        ))}
      </div>

      {/* Widget içeriği */}
      <div className="widget-content-pro">
        {renderWidget()}
      </div>
    </div>
  );
};

// SecurityWidget component'i
const SecurityWidget = ({ theme, security, doors, updateDeviceState }) => {
  const securityCameras = [
    { id: 'cam1', name: 'Oturma Odası', status: 'online' },
    { id: 'cam2', name: 'Mutfak', status: 'online' },
    { id: 'cam3', name: 'Yatak Odası', status: 'online' },
    { id: 'cam4', name: 'Ana Giriş', status: 'offline' }
  ];

  return (
    <div className="security-widget-pro">
      {/* Ana güvenlik durumu */}
      <div className="security-status-pro">
        <div className="status-indicator-large">
          <div className={`indicator-circle ${security.isArmed ? 'active' : 'inactive'}`}>
            <span className="status-icon">{security.isArmed ? '🔒' : '🔓'}</span>
          </div>
          <div className="status-info">
            <h3 style={{margin: 0, color: '#f9fafb'}}>{security.isArmed ? 'Güvenlik Aktif' : 'Güvenlik Pasif'}</h3>
            <p style={{margin: '4px 0 0 0', opacity: 0.7, fontSize: '0.875rem'}}>
              Tüm sensörler {security.isArmed ? 'izleniyor' : 'beklemede'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => updateDeviceState('security', null, { isArmed: !security.isArmed })}
          className={`security-toggle-pro ${security.isArmed ? 'active' : ''}`}
        >
          {security.isArmed ? 'Pasif Yap' : 'Aktif Yap'}
        </button>
      </div>

      {/* Kameralar */}
      <div className="cameras-section-pro">
        <h3>Güvenlik Kameraları</h3>
        <div className="cameras-grid-pro">
          {securityCameras.map(camera => (
            <div key={camera.id} className={`camera-card-pro ${camera.status}`}>
              <div className="camera-header-pro">
                <span className="camera-name-pro">{camera.name}</span>
                <div className={`camera-status-pro ${camera.status}`}>
                  <div className="status-dot-small"></div>
                  <span>{camera.status === 'online' ? 'Aktif' : 'Pasif'}</span>
                </div>
              </div>
              <button className="camera-view-btn-pro">
                👁️ Görüntüle
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Kapı kontrolleri */}
      <div className="doors-section-pro">
        <h3>Kapı Güvenliği</h3>
        <div className="doors-grid-pro">
          {Object.entries(doors).map(([doorId, door]) => (
            <div key={doorId} className="door-card-pro">
              <div className="door-info-pro">
                <span className="door-name-pro">{door.name}</span>
                <div className={`lock-indicator-pro ${door.isLocked ? 'locked' : 'unlocked'}`}>
                  {door.isLocked ? '🔒' : '🔓'}
                  <span>{door.isLocked ? 'Kilitli' : 'Açık'}</span>
                </div>
              </div>
              <button
                onClick={() => updateDeviceState('doors', doorId, { isLocked: !door.isLocked })}
                className="door-toggle-pro"
                style={{
                  background: door.isLocked 
                    ? 'linear-gradient(135deg, #6b7280, #4b5563)' 
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white'
                }}
              >
                {door.isLocked ? 'Kilidi Aç' : 'Kilitle'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;