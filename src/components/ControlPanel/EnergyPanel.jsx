import React, { useState, useEffect } from 'react';
import { useSmartHome } from '../../context/SmartHomeContext';
import './ControlPanel.css';

const EnergyPanel = ({ theme }) => {
  const { devices, updateDeviceState } = useSmartHome();
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [energyData, setEnergyData] = useState({
    current: 2.4,
    daily: 45.2,
    weekly: 315.8,
    monthly: 1247.5,
    peak: 4.8,
    low: 0.8,
    savings: 15.2
  });

  const periods = [
    { id: 'day', name: 'Günlük', data: energyData.daily },
    { id: 'week', name: 'Haftalık', data: energyData.weekly },
    { id: 'month', name: 'Aylık', data: energyData.monthly }
  ];

  const deviceConsumption = [
    { name: 'Klima', consumption: 3.2, percentage: 35, isOn: devices.airConditioner.isOn },
    { name: 'Termostat', consumption: 2.5, percentage: 27, isOn: devices.thermostat.isOn },
    { name: 'Aydınlatma', consumption: 1.8, percentage: 20, isOn: Object.values(devices.lights).some(light => light.isOn) },
    { name: 'Akıllı TV', consumption: 0.8, percentage: 9, isOn: devices.smartDevices.smartTV.isOn },
    { name: 'Diğer', consumption: 0.8, percentage: 9, isOn: true }
  ];

  const energyTips = [
    {
      title: 'Klima Optimizasyonu',
      description: 'Klimayı 1°C yükseltmek %7 enerji tasarrufu sağlar',
      impact: 'Yüksek',
      action: () => {
        updateDeviceState('airConditioner', null, { 
          temperature: Math.min(30, devices.airConditioner.temperature + 1) 
        });
        // Başarı mesajı için state değişikliği
        alert('Klima sıcaklığı artırıldı!');
      }
    },
    {
      title: 'Işık Kontrolü',
      description: 'Kullanılmayan odalardaki ışıkları kapatın',
      impact: 'Orta',
      action: () => {
        let closedLights = 0;
        Object.keys(devices.lights).forEach(lightId => {
          if (devices.lights[lightId].isOn) {
            updateDeviceState('lights', lightId, { isOn: false });
            closedLights++;
          }
        });
        alert(`${closedLights} ışık kapatıldı!`);
      }
    },
    {
      title: 'Eko Mod',
      description: 'Tüm cihazları enerji tasarruf moduna alın',
      impact: 'Yüksek',
      action: () => {
        updateDeviceState('powerMode', null, { mode: 'eco' });
        // Cihazları optimize et
        if (devices.thermostat.isOn && devices.thermostat.temperature > 20) {
          updateDeviceState('thermostat', null, { temperature: 20 });
        }
        if (devices.airConditioner.isOn && devices.airConditioner.temperature < 26) {
          updateDeviceState('airConditioner', null, { temperature: 26 });
        }
        alert('Eko mod aktif! Tüm cihazlar optimize edildi.');
      }
    }
  ];

  const calculateCurrentUsage = () => {
    let usage = 0;
    
    Object.values(devices.lights).forEach(light => {
      if (light.isOn) usage += (light.brightness / 100) * 0.1;
    });
    
    if (devices.thermostat.isOn) usage += 2.5;
    if (devices.airConditioner.isOn) usage += 3.2;
    if (devices.smartDevices.smartTV.isOn) usage += 0.2;
    if (devices.smartDevices.musicSystem.isOn) usage += 0.15;
    
    return usage.toFixed(1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyData(prev => ({
        ...prev,
        current: parseFloat(calculateCurrentUsage())
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [devices]);

  return (
    <div className={`energy-panel ${theme}`}>
      <div className="energy-header">
        <h2>Enerji Yönetimi</h2>
        <div className="energy-status">
          <div className="status-item">
            <span className="status-label">Anlık Tüketim</span>
            <span className="status-value">{calculateCurrentUsage()} kW</span>
          </div>
          <div className="status-item">
            <span className="status-label">Günlük Ortalama</span>
            <span className="status-value">{energyData.daily} kWh</span>
          </div>
          <div className="status-item success">
            <span className="status-label">Tasarruf</span>
            <span className="status-value">%{energyData.savings}</span>
          </div>
        </div>
      </div>

      <div className="energy-overview">
        <div className="consumption-chart">
          <h3>Tüketim Grafiği</h3>
          <div className="chart-container">
            <div className="chart-bar-container">
              {deviceConsumption.map((device, index) => (
                <div key={device.name} className="chart-bar-wrapper">
                  <div 
                    className={`chart-bar ${device.isOn ? 'active' : 'inactive'}`}
                    style={{ height: `${device.percentage}%` }}
                  >
                    <div className="bar-value">{device.consumption}kW</div>
                  </div>
                  <div className="bar-label">{device.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="period-selector">
          <h3>Periyot Seçimi</h3>
          <div className="period-buttons">
            {periods.map(period => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`period-button ${selectedPeriod === period.id ? 'active' : ''}`}
              >
                <span className="period-name">{period.name}</span>
                <span className="period-data">{period.data} kWh</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="solar-panel-info">
        <h3>Güneş Paneli Durumu</h3>
        <div className="solar-stats">
          <div className="solar-item">
            <span className="solar-label">Üretim</span>
            <span className="solar-value">{devices.powerMode.solarPanels.production} kW</span>
          </div>
          <div className="solar-item">
            <span className="solar-label">Verimlilik</span>
            <span className="solar-value">%{devices.powerMode.solarPanels.efficiency}</span>
          </div>
          <div className="solar-item">
            <span className="solar-label">Durum</span>
            <span className={`solar-status ${devices.powerMode.solarPanels.isActive ? 'active' : 'inactive'}`}>
              {devices.powerMode.solarPanels.isActive ? 'Aktif' : 'Pasif'}
            </span>
          </div>
        </div>
        
        <div className="solar-visualization">
          <div className="solar-panel">
            <div className={`panel-cell ${devices.powerMode.solarPanels.isActive ? 'producing' : ''}`}></div>
            <div className={`panel-cell ${devices.powerMode.solarPanels.isActive ? 'producing' : ''}`}></div>
            <div className={`panel-cell ${devices.powerMode.solarPanels.isActive ? 'producing' : ''}`}></div>
            <div className={`panel-cell ${devices.powerMode.solarPanels.isActive ? 'producing' : ''}`}></div>
          </div>
          <div className="energy-flow">
            <div className={`flow-arrow ${devices.powerMode.solarPanels.isActive ? 'active' : ''}`}></div>
            <span className="flow-text">Ev</span>
          </div>
        </div>
      </div>

      <div className="energy-tips">
        <h3>Enerji Tasarrufu Önerileri</h3>
        <div className="tips-grid">
          {energyTips.map((tip, index) => (
            <div key={index} className="tip-card">
              <div className="tip-header">
                <h4>{tip.title}</h4>
                <span className={`impact-badge ${tip.impact.toLowerCase()}`}>
                  {tip.impact} Etki
                </span>
              </div>
              <p className="tip-description">{tip.description}</p>
              <button onClick={tip.action} className="tip-action">
                Uygula
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="power-mode-control">
        <h3>Güç Modu</h3>
        <div className="mode-selector">
          {['normal', 'eco', 'performance'].map(mode => (
            <button
              key={mode}
              onClick={() => updateDeviceState('powerMode', null, { mode })}
              className={`mode-button ${devices.powerMode.mode === mode ? 'active' : ''}`}
            >
              <span className="mode-name">
                {mode === 'normal' ? 'Normal' : 
                 mode === 'eco' ? 'Eko' : 'Performans'}
              </span>
              <span className="mode-description">
                {mode === 'normal' ? 'Standart kullanım' : 
                 mode === 'eco' ? 'Maksimum tasarruf' : 'Yüksek performans'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnergyPanel;