import React from 'react';

const EnergyWidget = ({ theme, powerMode, energyUsage }) => {
  const getModeColor = (mode) => {
    const colors = {
      normal: '#3b82f6',
      eco: '#10b981',
      performance: '#f59e0b'
    };
    return colors[mode] || '#6b7280';
  };

  const getModeName = (mode) => {
    const names = {
      normal: 'Normal',
      eco: 'Eko',
      performance: 'Performans'
    };
    return names[mode] || mode;
  };

  return (
    <div className="energy-widget">
      <h3>Enerji Durumu</h3>
      
      <div className="energy-current">
        <div className="current-usage">
          <span className="usage-value">{energyUsage} kW</span>
          <span className="usage-label">Anlık Tüketim</span>
        </div>
        
        <div className="usage-gauge">
          <div 
            className="gauge-fill"
            style={{ 
              width: `${Math.min(100, (parseFloat(energyUsage) / 10) * 100)}%`,
              backgroundColor: parseFloat(energyUsage) > 5 ? '#ef4444' : '#10b981'
            }}
          ></div>
        </div>
      </div>

      <div className="energy-stats">
        <div className="stat-row">
          <span className="stat-label">Günlük Kullanım</span>
          <span className="stat-value">{powerMode.dailyUsage} kWh</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Aylık Fatura</span>
          <span className="stat-value">₺{powerMode.monthlyBill}</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Tasarruf</span>
          <span className="stat-value success">%{powerMode.savings}</span>
        </div>
      </div>

      <div className="power-mode">
        <h4>Güç Modu</h4>
        <div className="current-mode">
          <div 
            className="mode-indicator"
            style={{ backgroundColor: getModeColor(powerMode.mode) }}
          ></div>
          <span className="mode-name">{getModeName(powerMode.mode)}</span>
        </div>
      </div>

      {powerMode.solarPanels && (
        <div className="solar-info">
          <h4>Güneş Paneli</h4>
          <div className="solar-stats">
            <div className="solar-stat">
              <span className="solar-label">Üretim</span>
              <span className="solar-value">{powerMode.solarPanels.production} kW</span>
            </div>
            <div className="solar-stat">
              <span className="solar-label">Verim</span>
              <span className="solar-value">%{powerMode.solarPanels.efficiency}</span>
            </div>
          </div>
        </div>
      )}

      <div className="energy-tips">
        <h4>Öneriler</h4>
        <div className="tips-list">
          {parseFloat(energyUsage) > 5 && (
            <div className="tip warning">
              Yüksek tüketim! Gereksiz cihazları kapatın.
            </div>
          )}
          
          {powerMode.mode !== 'eco' && (
            <div className="tip info">
              Eko moda geçerek tasarruf edebilirsiniz.
            </div>
          )}
          
          {powerMode.solarPanels?.isActive && powerMode.solarPanels.production > 20 && (
            <div className="tip success">
              Güneş paneli yüksek üretim yapıyor!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnergyWidget;