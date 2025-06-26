import React, { useState } from 'react';
import { useSmartHome } from '../../context/SmartHomeContext';
import './ControlPanel.css';

const DevicesPanel = ({ theme }) => {
  const { devices, updateDeviceState } = useSmartHome();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');

  const categories = [
    { id: 'all', name: 'Tüm Cihazlar', icon: '🏠' },
    { id: 'lighting', name: 'Aydınlatma', icon: '💡' },
    { id: 'climate', name: 'İklim', icon: '🌡️' },
    { id: 'entertainment', name: 'Eğlence', icon: '📺' },
    { id: 'security', name: 'Güvenlik', icon: '🔒' },
    { id: 'cleaning', name: 'Temizlik', icon: '🧹' },
    { id: 'kitchen', name: 'Mutfak', icon: '🍳' }
  ];

  const filters = [
    { id: 'all', name: 'Tümü' },
    { id: 'online', name: 'Çevrimiçi' },
    { id: 'offline', name: 'Çevrimdışı' },
    { id: 'active', name: 'Aktif' }
  ];

  const getAllDevices = () => {
    const allDevices = [];

    // Işıklar
    Object.entries(devices.lights).forEach(([id, light]) => {
      allDevices.push({
        id: `light_${id}`,
        name: light.name,
        type: 'light',
        category: 'lighting',
        isOn: light.isOn,
        status: 'online',
        brightness: light.brightness,
        color: light.color,
        room: light.room,
        icon: '💡'
      });
    });

    // Termostat
    allDevices.push({
      id: 'thermostat',
      name: 'Akıllı Termostat',
      type: 'thermostat',
      category: 'climate',
      isOn: devices.thermostat.isOn,
      status: 'online',
      temperature: devices.thermostat.temperature,
      mode: devices.thermostat.mode,
      icon: '🌡️'
    });

    // Klima
    allDevices.push({
      id: 'airConditioner',
      name: 'Akıllı Klima',
      type: 'airconditioner',
      category: 'climate',
      isOn: devices.airConditioner.isOn,
      status: 'online',
      temperature: devices.airConditioner.temperature,
      fanSpeed: devices.airConditioner.fanSpeed,
      icon: '❄️'
    });

    // Robot süpürge
    allDevices.push({
      id: 'robotVacuum',
      name: 'Robot Süpürge',
      type: 'vacuum',
      category: 'cleaning',
      isOn: devices.robotVacuum.isOn,
      status: 'online',
      batteryLevel: devices.robotVacuum.batteryLevel,
      cleaningStatus: devices.robotVacuum.status,
      icon: '🤖'
    });

    // Kapılar
    Object.entries(devices.doors).forEach(([id, door]) => {
      allDevices.push({
        id: `door_${id}`,
        name: door.name,
        type: 'door',
        category: 'security',
        isLocked: door.isLocked,
        status: 'online',
        lastAccess: door.lastAccess,
        icon: '🚪'
      });
    });

    // Akıllı cihazlar
    Object.entries(devices.smartDevices).forEach(([id, device]) => {
      let category = 'entertainment';
      let icon = '📱';

      if (id === 'coffee' || id === 'dishwasher') {
        category = 'kitchen';
        icon = id === 'coffee' ? '☕' : '🍽️';
      } else if (id === 'washingMachine') {
        category = 'cleaning';
        icon = '👔';
      } else if (id === 'musicSystem') {
        icon = '🎵';
      } else if (id === 'smartTV') {
        icon = '📺';
      }

      allDevices.push({
        id: `smart_${id}`,
        name: getDeviceName(id),
        type: id,
        category,
        isOn: device.isOn,
        status: 'online',
        icon,
        ...device
      });
    });

    return allDevices;
  };

  const getDeviceName = (deviceType) => {
    const names = {
      musicSystem: 'Müzik Sistemi',
      waterHeater: 'Su Isıtıcısı',
      smartTV: 'Akıllı TV',
      dishwasher: 'Bulaşık Makinesi',
      washingMachine: 'Çamaşır Makinesi',
      smartMirror: 'Akıllı Ayna',
      airPurifier: 'Hava Temizleyici',
      coffee: 'Kahve Makinesi'
    };
    return names[deviceType] || deviceType;
  };

  const getFilteredDevices = () => {
    let filtered = getAllDevices();

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(device => device.category === selectedCategory);
    }

    if (deviceFilter === 'active') {
      filtered = filtered.filter(device => device.isOn || device.isLocked);
    } else if (deviceFilter === 'offline') {
      filtered = filtered.filter(device => device.status === 'offline');
    }

    return filtered;
  };

  const handleDeviceToggle = (device) => {
    if (device.type === 'light') {
      const lightId = device.id.replace('light_', '');
      updateDeviceState('lights', lightId, { isOn: !device.isOn });
    } else if (device.type === 'door') {
      const doorId = device.id.replace('door_', '');
      updateDeviceState('doors', doorId, { isLocked: !device.isLocked });
    } else if (device.id.startsWith('smart_')) {
      const deviceType = device.id.replace('smart_', '');
      updateDeviceState('smartDevices', deviceType, { isOn: !device.isOn });
    } else if (['thermostat', 'airConditioner', 'robotVacuum'].includes(device.id)) {
      updateDeviceState(device.id, null, { isOn: !device.isOn });
    }
  };

  const renderDeviceCard = (device) => (
    <div key={device.id} className={`device-card ${device.isOn || device.isLocked ? 'active' : 'inactive'}`}>
      <div className="device-header">
        <div className="device-icon">{device.icon}</div>
        <div className="device-info">
          <h4 className="device-name">{device.name}</h4>
          <span className={`device-status ${device.status}`}>
            {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
          </span>
        </div>
        <button
          onClick={() => handleDeviceToggle(device)}
          className={`device-toggle ${device.isOn || device.isLocked ? 'on' : 'off'}`}
        >
          {device.type === 'door' 
            ? (device.isLocked ? 'Kilitli' : 'Açık')
            : (device.isOn ? 'Açık' : 'Kapalı')
          }
        </button>
      </div>

      <div className="device-details">
        {device.type === 'light' && (
          <div className="light-controls">
            <div className="control-item">
              <label>Parlaklık: %{device.brightness}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={device.brightness}
                onChange={(e) => {
                  const lightId = device.id.replace('light_', '');
                  updateDeviceState('lights', lightId, { brightness: parseInt(e.target.value) });
                }}
                className="brightness-slider"
              />
            </div>
          </div>
        )}

        {(device.type === 'thermostat' || device.type === 'airconditioner') && (
          <div className="climate-controls">
            <div className="temperature-display">
              <span className="temp-value">{device.temperature}°C</span>
              <div className="temp-controls">
                <button
                  onClick={() => {
                    const newTemp = Math.min(30, device.temperature + 1);
                    updateDeviceState(device.id, null, { temperature: newTemp });
                  }}
                  className="temp-button"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    const newTemp = Math.max(16, device.temperature - 1);
                    updateDeviceState(device.id, null, { temperature: newTemp });
                  }}
                  className="temp-button"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        )}

        {device.type === 'vacuum' && (
          <div className="vacuum-info">
            <div className="battery-info">
              <span>Batarya: %{device.batteryLevel}</span>
              <div className="battery-bar">
                <div 
                  className="battery-fill"
                  style={{ width: `${device.batteryLevel}%` }}
                ></div>
              </div>
            </div>
            <span className="cleaning-status">
              Durum: {device.cleaningStatus === 'cleaning' ? 'Temizliyor' : 
                     device.cleaningStatus === 'charging' ? 'Şarj Oluyor' : 'Beklemede'}
            </span>
          </div>
        )}

        {device.type === 'musicSystem' && (
          <div className="music-controls">
            <div className="volume-control">
              <label>Ses: %{device.volume}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={device.volume}
                onChange={(e) => {
                  updateDeviceState('smartDevices', 'musicSystem', { volume: parseInt(e.target.value) });
                }}
                className="volume-slider"
              />
            </div>
            <span className="current-song">{device.currentSong}</span>
          </div>
        )}

        {device.type === 'smartTV' && (
          <div className="tv-controls">
            <div className="tv-info">
              <span>Kanal: {device.channel}</span>
              <span>Ses: %{device.volume}</span>
              <span>Uygulama: {device.currentApp}</span>
            </div>
          </div>
        )}

        {device.type === 'coffee' && (
          <div className="coffee-controls">
            <span>Fincan: {device.cups}</span>
            <span>Su Seviyesi: %{device.waterLevel}</span>
          </div>
        )}
      </div>
    </div>
  );

  const filteredDevices = getFilteredDevices();

  return (
    <div className={`devices-panel ${theme}`}>
      <div className="devices-header">
        <h2>Akıllı Cihazlar</h2>
        <div className="devices-stats">
          <div className="stat-item">
            <span className="stat-value">{getAllDevices().length}</span>
            <span className="stat-label">Toplam Cihaz</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{getAllDevices().filter(d => d.isOn || d.isLocked).length}</span>
            <span className="stat-label">Aktif Cihaz</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{getAllDevices().filter(d => d.status === 'online').length}</span>
            <span className="stat-label">Çevrimiçi</span>
          </div>
        </div>
      </div>

      <div className="devices-filters">
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="status-filters">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setDeviceFilter(filter.id)}
              className={`filter-button ${deviceFilter === filter.id ? 'active' : ''}`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      <div className="devices-grid">
        {filteredDevices.map(device => renderDeviceCard(device))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="no-devices">
          <p>Bu kategoride cihaz bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default DevicesPanel;