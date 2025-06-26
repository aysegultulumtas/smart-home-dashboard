import React from 'react';

const DeviceOverview = ({ theme, devices, updateDeviceState }) => {
  const getDeviceStatus = () => {
    let totalDevices = 0;
    let activeDevices = 0;

    // Count lights
    Object.values(devices.lights).forEach(light => {
      totalDevices++;
      if (light.isOn) activeDevices++;
    });

    // Count other devices
    if (devices.thermostat) {
      totalDevices++;
      if (devices.thermostat.isOn) activeDevices++;
    }

    if (devices.airConditioner) {
      totalDevices++;
      if (devices.airConditioner.isOn) activeDevices++;
    }

    if (devices.robotVacuum) {
      totalDevices++;
      if (devices.robotVacuum.isOn) activeDevices++;
    }

    // Count smart devices
    Object.values(devices.smartDevices).forEach(device => {
      totalDevices++;
      if (device.isOn) activeDevices++;
    });

    return { totalDevices, activeDevices };
  };

  const { totalDevices, activeDevices } = getDeviceStatus();

  const deviceCategories = [
    {
      name: 'Aydınlatma',
      icon: '💡',
      devices: Object.entries(devices.lights).map(([id, light]) => ({
        id,
        name: light.name,
        isOn: light.isOn,
        type: 'light'
      }))
    },
    {
      name: 'İklim Kontrolü',
      icon: '🌡️',
      devices: [
        {
          id: 'thermostat',
          name: 'Termostat',
          isOn: devices.thermostat.isOn,
          type: 'thermostat'
        },
        {
          id: 'airConditioner',
          name: 'Klima',
          isOn: devices.airConditioner.isOn,
          type: 'airconditioner'
        }
      ]
    },
    {
      name: 'Akıllı Cihazlar',
      icon: '📱',
      devices: Object.entries(devices.smartDevices).map(([id, device]) => ({
        id,
        name: getDeviceName(id),
        isOn: device.isOn,
        type: 'smart'
      }))
    }
  ];

  function getDeviceName(deviceType) {
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
  }

  const handleDeviceToggle = (device) => {
    if (device.type === 'light') {
      updateDeviceState('lights', device.id, { isOn: !device.isOn });
    } else if (device.type === 'smart') {
      updateDeviceState('smartDevices', device.id, { isOn: !device.isOn });
    } else {
      updateDeviceState(device.id, null, { isOn: !device.isOn });
    }
  };

  return (
    <div className="device-overview">
      <div className="overview-header">
        <h3>Cihaz Genel Bakışı</h3>
        <div className="overview-stats">
          <span className="stat">
            {activeDevices}/{totalDevices} Aktif
          </span>
        </div>
      </div>

      <div className="device-categories">
        {deviceCategories.map(category => (
          <div key={category.name} className="device-category">
            <div className="category-header">
              <span className="category-icon">{category.icon}</span>
              <h4>{category.name}</h4>
              <span className="category-count">
                {category.devices.filter(d => d.isOn).length}/{category.devices.length}
              </span>
            </div>
            
            <div className="category-devices">
              {category.devices.map(device => (
                <div key={device.id} className={`device-item ${device.isOn ? 'active' : 'inactive'}`}>
                  <span className="device-name">{device.name}</span>
                  <button
                    onClick={() => handleDeviceToggle(device)}
                    className={`device-toggle ${device.isOn ? 'on' : 'off'}`}
                  >
                    {device.isOn ? 'Açık' : 'Kapalı'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceOverview;