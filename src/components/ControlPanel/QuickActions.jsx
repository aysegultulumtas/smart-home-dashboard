import React from 'react';

const QuickActions = ({ theme, devices, updateDeviceState }) => {
  const quickActions = [
    {
      id: 'all-lights-off',
      name: 'Tüm Işıkları Kapat',
      icon: '💡',
      action: () => {
        Object.keys(devices.lights).forEach(lightId => {
          updateDeviceState('lights', lightId, { isOn: false });
        });
      }
    },
    {
      id: 'all-lights-on',
      name: 'Tüm Işıkları Aç',
      icon: '🔆',
      action: () => {
        Object.keys(devices.lights).forEach(lightId => {
          updateDeviceState('lights', lightId, { isOn: true });
        });
      }
    },
    {
      id: 'security-toggle',
      name: devices.security.isArmed ? 'Güvenlik Kapat' : 'Güvenlik Aç',
      icon: '🔒',
      action: () => {
        updateDeviceState('security', null, { isArmed: !devices.security.isArmed });
      }
    },
    {
      id: 'vacuum-start',
      name: devices.robotVacuum.isOn ? 'Süpürgeyi Durdur' : 'Süpürgeyi Başlat',
      icon: '🤖',
      action: () => {
        updateDeviceState('robotVacuum', null, { isOn: !devices.robotVacuum.isOn });
      }
    }
  ];

  return (
    <div className="quick-actions">
      <h3>Hızlı Eylemler</h3>
      <div className="quick-actions-grid">
        {quickActions.map(action => (
          <button
            key={action.id}
            onClick={action.action}
            className="quick-action-button"
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-name">{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;