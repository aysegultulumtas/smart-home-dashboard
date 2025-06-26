import React, { useState, useEffect } from 'react';
import { useSmartHome } from '../../context/SmartHomeContext';
import './ControlPanel.css';

const SecurityPanel = ({ theme }) => {
  const { devices, updateDeviceState } = useSmartHome();
  const [selectedCamera, setSelectedCamera] = useState(1);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'motion', location: 'Oturma Odası', time: '14:23', status: 'active' },
    { id: 2, type: 'door', location: 'Ana Kapı', time: '13:45', status: 'resolved' },
    { id: 3, type: 'window', location: 'Yatak Odası', time: '12:30', status: 'resolved' }
  ]);

  const securityZones = [
    { id: 'entrance', name: 'Giriş Bölgesi', sensors: 3, status: 'secure' },
    { id: 'living', name: 'Yaşam Alanı', sensors: 4, status: 'secure' },
    { id: 'bedroom', name: 'Yatak Odaları', sensors: 2, status: 'secure' },
    { id: 'perimeter', name: 'Çevre Güvenlik', sensors: 6, status: 'secure' }
  ];

  const cameras = [
    { id: 1, name: 'Ana Giriş', location: 'entrance', status: 'online', recording: true },
    { id: 2, name: 'Oturma Odası', location: 'living', status: 'online', recording: false },
    { id: 3, name: 'Arka Bahçe', location: 'backyard', status: 'online', recording: true },
    { id: 4, name: 'Garaj', location: 'garage', status: 'offline', recording: false }
  ];

  const handleArmSystem = () => {
    updateDeviceState('security', null, { isArmed: !devices.security.isArmed });
    
    if (!devices.security.isArmed) {
      // Sistem aktifleştirilirken tüm kapıları kilitle
      Object.keys(devices.doors).forEach(doorId => {
        updateDeviceState('doors', doorId, { isLocked: true });
      });
    }
  };

  const handleEmergency = (type) => {
    const newAlert = {
      id: Date.now(),
      type: 'emergency',
      location: 'Acil Durum',
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
      emergencyType: type
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    updateDeviceState('security', null, { isArmed: true });
  };

  const getAlertIcon = (type) => {
    const icons = {
      motion: '🚶',
      door: '🚪',
      window: '🪟',
      emergency: '🚨',
      smoke: '💨'
    };
    return icons[type] || '⚠️';
  };

  const getStatusColor = (status) => {
    const colors = {
      secure: '#22c55e',
      warning: '#f59e0b',
      alert: '#ef4444',
      offline: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className={`security-panel ${theme}`}>
      <div className="security-header">
        <h2>Güvenlik Sistemi</h2>
        <div className="system-status">
          <div className={`status-indicator ${devices.security.isArmed ? 'armed' : 'disarmed'}`}>
            <div className="status-light"></div>
            <span>{devices.security.isArmed ? 'Sistem Aktif' : 'Sistem Pasif'}</span>
          </div>
          <button 
            onClick={handleArmSystem}
            className={`arm-button ${devices.security.isArmed ? 'armed' : 'disarmed'}`}
          >
            {devices.security.isArmed ? 'Sistemi Pasif Yap' : 'Sistemi Aktif Yap'}
          </button>
        </div>
      </div>

      <div className="security-overview">
        <div className="zones-grid">
          <h3>Güvenlik Bölgeleri</h3>
          <div className="zones-container">
            {securityZones.map(zone => (
              <div key={zone.id} className="zone-card">
                <div className="zone-header">
                  <h4>{zone.name}</h4>
                  <div 
                    className="zone-status"
                    style={{ backgroundColor: getStatusColor(zone.status) }}
                  ></div>
                </div>
                <div className="zone-info">
                  <span>{zone.sensors} Sensör</span>
                  <span className="zone-status-text">
                    {zone.status === 'secure' ? 'Güvenli' : 'Alarm'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="camera-system">
          <h3>Kamera Sistemi</h3>
          <div className="camera-grid">
            {cameras.map(camera => (
              <div 
                key={camera.id} 
                className={`camera-card ${selectedCamera === camera.id ? 'selected' : ''}`}
                onClick={() => setSelectedCamera(camera.id)}
              >
                <div className="camera-preview">
                  <div className={`camera-status ${camera.status}`}>
                    <div className="status-dot"></div>
                  </div>
                  <div className="camera-overlay">
                    <span className="camera-name">{camera.name}</span>
                    {camera.recording && (
                      <div className="recording-indicator">
                        <div className="rec-dot"></div>
                        REC
                      </div>
                    )}
                  </div>
                </div>
                <div className="camera-controls">
                  <span className={`status-text ${camera.status}`}>
                    {camera.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="door-access-control">
        <h3>Kapı Erişim Kontrolü</h3>
        <div className="doors-grid">
          {Object.entries(devices.doors).map(([doorId, door]) => (
            <div key={doorId} className="door-control-card">
              <div className="door-info">
                <h4>{door.name}</h4>
                <span className="last-access">Son erişim: {door.lastAccess}</span>
              </div>
              <div className="door-controls">
                <div className={`lock-status ${door.isLocked ? 'locked' : 'unlocked'}`}>
                  <div className="lock-icon">
                    {door.isLocked ? '🔒' : '🔓'}
                  </div>
                  <span>{door.isLocked ? 'Kilitli' : 'Açık'}</span>
                </div>
                <button
                  onClick={() => updateDeviceState('doors', doorId, { isLocked: !door.isLocked })}
                  className={`lock-toggle ${door.isLocked ? 'unlock' : 'lock'}`}
                >
                  {door.isLocked ? 'Kilidi Aç' : 'Kilitle'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sensor-overview">
        <h3>Sensör Durumu</h3>
        <div className="sensor-grid">
          <div className="sensor-card">
            <div className="sensor-icon">🚶</div>
            <div className="sensor-info">
              <span className="sensor-name">Hareket Sensörleri</span>
              <span className="sensor-count">{devices.security.sensors.motion} Aktif</span>
            </div>
          </div>
          
          <div className="sensor-card">
            <div className="sensor-icon">🚪</div>
            <div className="sensor-info">
              <span className="sensor-name">Kapı Sensörleri</span>
              <span className="sensor-count">{devices.security.sensors.door} Aktif</span>
            </div>
          </div>
          
          <div className="sensor-card">
            <div className="sensor-icon">🪟</div>
            <div className="sensor-info">
              <span className="sensor-name">Pencere Sensörleri</span>
              <span className="sensor-count">{devices.security.sensors.window} Aktif</span>
            </div>
          </div>
          
          <div className="sensor-card">
            <div className="sensor-icon">💨</div>
            <div className="sensor-info">
              <span className="sensor-name">Duman Sensörleri</span>
              <span className="sensor-count">{devices.security.sensors.smoke} Aktif</span>
            </div>
          </div>
        </div>
      </div>

      <div className="emergency-controls">
        <h3>Acil Durum Kontrolleri</h3>
        <div className="emergency-buttons">
          <button 
            onClick={() => handleEmergency('fire')}
            className="emergency-button fire"
          >
            <span className="emergency-icon">🔥</span>
            Yangın Alarmı
          </button>
          
          <button 
            onClick={() => handleEmergency('medical')}
            className="emergency-button medical"
          >
            <span className="emergency-icon">🏥</span>
            Tıbbi Acil Durum
          </button>
          
          <button 
            onClick={() => handleEmergency('security')}
            className="emergency-button security"
          >
            <span className="emergency-icon">🚨</span>
            Güvenlik Alarmı
          </button>
        </div>
      </div>

      <div className="alerts-log">
        <h3>Alarm Geçmişi</h3>
        <div className="alerts-container">
          {alerts.map(alert => (
            <div key={alert.id} className={`alert-item ${alert.status}`}>
              <div className="alert-icon">{getAlertIcon(alert.type)}</div>
              <div className="alert-info">
                <span className="alert-location">{alert.location}</span>
                <span className="alert-time">{alert.time}</span>
              </div>
              <div className={`alert-status ${alert.status}`}>
                {alert.status === 'active' ? 'Aktif' : 'Çözüldü'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityPanel;