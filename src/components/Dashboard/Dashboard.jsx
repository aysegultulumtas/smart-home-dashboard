import React, { useState } from 'react';
import { useSmartHome } from '../../context/SmartHomeContext';
import './Dashboard.css';

const Dashboard = ({ theme }) => {
  const { devices, updateDeviceState } = useSmartHome();
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const rooms = {
    livingRoom: { 
      id: 'livingRoom', 
      name: 'Oturma Odası', 
      x: 100, 
      y: 100, 
      width: 300, 
      height: 200, 
      lightId: 'livingRoom',
      devices: ['lights', 'thermostat', 'smartTV', 'musicSystem'] 
    },
    kitchen: { 
      id: 'kitchen', 
      name: 'Mutfak', 
      x: 400, 
      y: 100, 
      width: 300, 
      height: 200, 
      lightId: 'kitchen',
      devices: ['lights', 'airConditioner', 'dishwasher', 'coffee'] 
    },
    bedroom: { 
      id: 'bedroom', 
      name: 'Yatak Odası', 
      x: 100, 
      y: 300, 
      width: 300, 
      height: 200, 
      lightId: 'bedroom',
      devices: ['lights', 'curtains'] 
    },
    bathroom: { 
      id: 'bathroom', 
      name: 'Banyo', 
      x: 400, 
      y: 300, 
      width: 300, 
      height: 200, 
      lightId: 'bathroom',
      devices: ['lights', 'waterHeater'] 
    }
  };

  const colors = {
    walls: theme === 'dark' ? '#374151' : '#f3f4f6',
    wallStroke: theme === 'dark' ? '#6b7280' : '#374151',
    floor: theme === 'dark' ? '#1f2937' : '#ffffff',
    furniture: theme === 'dark' ? '#4b5563' : '#d1d5db',
    text: theme === 'dark' ? '#f9fafb' : '#111827',
  };

  const vacuumPath = "M150,200 L250,150 L350,200 L450,150 L550,200 L650,250 L600,350 L500,400 L400,350 L300,400 L200,350 L150,300 Z";

  const getActiveDevicesInRoom = (roomId) => {
    const room = rooms[roomId];
    if (!room) return 0;
    
    let count = 0;
    
    // Check lights
    if (room.devices.includes('lights') && devices.lights[room.lightId]?.isOn) {
      count++;
    }
    
    // Check other devices
    if (room.devices.includes('thermostat') && devices.thermostat.isOn) count++;
    if (room.devices.includes('airConditioner') && devices.airConditioner.isOn) count++;
    
    // Check smart devices
    room.devices.forEach(deviceType => {
      if (devices.smartDevices[deviceType]?.isOn) count++;
    });
    
    return count;
  };

  const getRoomStatus = (roomId) => {
    const activeCount = getActiveDevicesInRoom(roomId);
    if (activeCount === 0) return 'inactive';
    if (activeCount <= 2) return 'moderate';
    return 'active';
  };

  return (
    <div className={`dashboard ${theme}`}>
      <div className="dashboard-header">
        <h2>Ev Planı ve Kontrol</h2>
        <div className="dashboard-stats">
          <div className="stat-item">
            <span className="stat-value">
              {Object.values(devices.lights).filter(light => light.isOn).length}
            </span>
            <span className="stat-label">Aktif Işık</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{devices.weather.inside}°</span>
            <span className="stat-label">İç Sıcaklık</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {devices.security.isArmed ? 'Aktif' : 'Pasif'}
            </span>
            <span className="stat-label">Güvenlik</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="floor-plan">
          <svg viewBox="0 0 800 600" className="floor-plan-svg">
            <defs>
              {Object.entries(devices.lights).map(([id]) => (
                <radialGradient key={`lightGrad-${id}`} id={`lightGrad-${id}`} cx="0.5" cy="0.5" r="0.8">
                  <stop offset="0%" stopColor={devices.lights[id].isOn ? `rgba(255, 165, 0, ${devices.lights[id].brightness / 100})` : "rgba(156, 163, 175, 0.3)"} />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                </radialGradient>
              ))}
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.15)" />
              </filter>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* House structure */}
            <rect x="50" y="50" width="700" height="500" fill={colors.floor} stroke={colors.wallStroke} strokeWidth="2" rx="8" filter="url(#shadow)" />
            <line x1="400" y1="60" x2="400" y2="540" stroke={colors.wallStroke} strokeWidth="4" strokeLinecap="round" />
            <line x1="60" y1="300" x2="740" y2="300" stroke={colors.wallStroke} strokeWidth="4" strokeLinecap="round" />
            
            {/* Living room furniture */}
            <g className="living-room">
              <rect x="80" y="80" width="180" height="40" fill={colors.furniture} rx="6" filter="url(#shadow)" />
              <rect x="85" y="85" width="170" height="30" fill="#1f2937" rx="4" />
              <rect x="120" y="160" width="140" height="60" fill={colors.furniture} rx="8" filter="url(#shadow)" />
              <rect x="260" y="160" width="60" height="80" fill={colors.furniture} rx="8" filter="url(#shadow)" />
              <ellipse cx="200" cy="140" rx="35" ry="20" fill="rgba(59, 130, 246, 0.2)" stroke={colors.wallStroke} strokeWidth="1" filter="url(#shadow)" />
            </g>
            
            {/* Kitchen furniture */}
            <g className="kitchen">
              <rect x="420" y="260" width="280" height="30" fill={colors.furniture} rx="6" filter="url(#shadow)" />
              <rect x="425" y="265" width="270" height="20" fill="#f8fafc" rx="3" />
              <circle cx="550" cy="275" r="12" fill="#3b82f6" />
              <rect x="680" y="120" width="35" height="80" fill="#e5e7eb" rx="4" filter="url(#shadow)" />
              <rect x="480" y="265" width="50" height="15" fill="#1f2937" rx="3" />
              <circle cx="490" cy="272" r="3" fill="#ef4444" />
              <circle cx="505" cy="272" r="3" fill="#ef4444" />
              <circle cx="520" cy="272" r="3" fill="#ef4444" />
            </g>
            
            {/* Bedroom furniture */}
            <g className="bedroom">
              <rect x="100" y="360" width="140" height="80" fill={colors.furniture} rx="10" filter="url(#shadow)" />
              <rect x="100" y="340" width="140" height="20" fill="#4b5563" rx="6" />
              <rect x="110" y="350" width="120" height="80" fill="#6366f1" rx="6" opacity="0.7" />
              <rect x="70" y="350" width="20" height="100" fill={colors.furniture} rx="4" filter="url(#shadow)" />
              <rect x="260" y="380" width="30" height="30" fill={colors.furniture} rx="4" filter="url(#shadow)" />
            </g>
            
            {/* Bathroom furniture */}
            <g className="bathroom">
              <rect x="450" y="380" width="100" height="60" fill={colors.furniture} rx="10" filter="url(#shadow)" />
              <rect x="460" y="390" width="80" height="40" fill="#3b82f6" rx="8" />
              <rect x="580" y="380" width="50" height="30" fill={colors.furniture} rx="4" filter="url(#shadow)" />
              <circle cx="605" cy="395" r="8" fill="#3b82f6" />
              <rect x="600" y="430" width="30" height="40" fill={colors.furniture} rx="6" filter="url(#shadow)" />
            </g>
            
            {/* Room interactive areas */}
            {Object.values(rooms).map(room => (
              <g key={room.id}>
                <rect 
                  x={room.x} y={room.y} 
                  width={room.width} height={room.height} 
                  fill="rgba(0,0,0,0)"
                  stroke={hoveredRoom === room.id || selectedRoom?.id === room.id ? '#3b82f6' : 'none'}
                  strokeWidth="3"
                  strokeDasharray={hoveredRoom === room.id ? "5,3" : "none"}
                  onMouseEnter={() => setHoveredRoom(room.id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                  onClick={() => setSelectedRoom(room)}
                  style={{ cursor: 'pointer' }}
                  className="room-interactive"
                />
                <text 
                  x={room.x + room.width/2} 
                  y={room.y + 20} 
                  textAnchor="middle" 
                  fill={colors.text}
                  fontSize="14"
                  fontWeight="600"
                  className="room-label"
                >
                  {room.name}
                </text>
                
                {/* Room status indicator */}
                <circle 
                  cx={room.x + room.width - 20} 
                  cy={room.y + 20} 
                  r="6" 
                  fill={getRoomStatus(room.id) === 'active' ? '#10b981' : 
                        getRoomStatus(room.id) === 'moderate' ? '#f59e0b' : '#6b7280'} 
                  className="room-status-indicator"
                />
                <text 
                  x={room.x + room.width - 20} 
                  y={room.y + 35} 
                  textAnchor="middle" 
                  fill={colors.text}
                  fontSize="10"
                  fontWeight="500"
                >
                  {getActiveDevicesInRoom(room.id)}
                </text>
              </g>
            ))}
            
            {/* Light effects and controls */}
            {Object.entries(rooms).map(([roomId, room]) => (
              <g key={`light-${roomId}`}>
                <circle 
                  cx={room.x + room.width/2} 
                  cy={room.y + room.height/2} 
                  r={devices.lights[room.lightId].isOn ? 80 : 25} 
                  fill={`url(#lightGrad-${room.lightId})`}
                  opacity={devices.lights[room.lightId].isOn ? 0.6 : 0.2}
                  className="light-effect"
                />
                <circle 
                  cx={room.x + room.width/2} 
                  cy={room.y + 40} 
                  r="15" 
                  fill={devices.lights[room.lightId].isOn ? "#FFA500" : "#6b7280"} 
                  stroke="white"
                  strokeWidth="3"
                  onClick={() => updateDeviceState('lights', room.lightId, { isOn: !devices.lights[room.lightId].isOn })}
                  style={{ cursor: 'pointer' }}
                  className="light-control"
                  filter={devices.lights[room.lightId].isOn ? "url(#glow)" : "url(#shadow)"}
                />
                {devices.lights[room.lightId].isOn && (
                  <circle 
                    cx={room.x + room.width/2} 
                    cy={room.y + 40} 
                    r="8" 
                    fill="#FFD700" 
                    opacity="0.8"
                    className="light-glow"
                  />
                )}
              </g>
            ))}
            
            {/* Robot vacuum animation */}
            {devices.robotVacuum.isOn && (
              <g className="robot-vacuum">
                <path 
                  d={vacuumPath} 
                  stroke="#9ca3af" 
                  strokeWidth="20" 
                  strokeLinecap="round"
                  fill="none" 
                  opacity="0.3"
                />
                <circle 
                  cx="0" cy="0" r="20" 
                  fill="#6366f1" 
                  stroke="white"
                  strokeWidth="3"
                  filter="url(#shadow)"
                >
                  <animateMotion 
                    path={vacuumPath}
                    dur="15s" 
                    repeatCount="indefinite" 
                    rotate="auto"
                  />
                </circle>
                <circle 
                  cx="0" cy="0" r="12" 
                  fill="#8b5cf6" 
                >
                  <animateMotion 
                    path={vacuumPath}
                    dur="15s" 
                    repeatCount="indefinite" 
                    rotate="auto"
                  />
                </circle>
                <circle 
                  cx="0" cy="-8" r="3" 
                  fill="#22c55e" 
                >
                  <animateMotion 
                    path={vacuumPath}
                    dur="15s" 
                    repeatCount="indefinite" 
                    rotate="auto"
                  />
                  <animate 
                    attributeName="opacity" 
                    values="1;0.3;1" 
                    dur="1s" 
                    repeatCount="indefinite" 
                  />
                </circle>
              </g>
            )}
            
            {/* Security cameras */}
            {devices.security.isArmed && (
              <g className="security-system">
                {[
                  { x: 100, y: 100 }, { x: 700, y: 100 },
                  { x: 100, y: 500 }, { x: 700, y: 500 }
                ].map((camera, index) => (
                  <g key={`camera-${index}`}>
                    <circle cx={camera.x} cy={camera.y} r="8" fill="#dc2626" filter="url(#shadow)" />
                    <circle cx={camera.x + 4} cy={camera.y - 4} r="2" fill="#22c55e">
                      <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <path 
                      d={`M ${camera.x} ${camera.y} Q ${camera.x + 30} ${camera.y - 20} ${camera.x + 60} ${camera.y}`}
                      stroke="#dc2626" 
                      strokeWidth="2" 
                      fill="none" 
                      opacity="0.3"
                    />
                  </g>
                ))}
              </g>
            )}
          </svg>
        </div>
        
        <div className="room-details">
          {selectedRoom ? (
            <RoomDetails room={selectedRoom} theme={theme} devices={devices} updateDeviceState={updateDeviceState} />
          ) : (
            <div className="no-room-selected">
              <div className="welcome-icon">🏠</div>
              <h3>Oda Seçin</h3>
              <p>Detaylı kontrole geçmek için harita üzerinde bir oda seçin</p>
              <div className="quick-overview">
                <h4>Genel Durum</h4>
                <div className="overview-stats">
                  <div className="overview-item">
                    <span className="overview-label">Toplam Cihaz</span>
                    <span className="overview-value">
                      {Object.keys(devices.lights).length + 
                       Object.keys(devices.smartDevices).length + 3}
                    </span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Aktif Cihaz</span>
                    <span className="overview-value">
                      {Object.values(devices.lights).filter(l => l.isOn).length +
                       Object.values(devices.smartDevices).filter(d => d.isOn).length +
                       (devices.thermostat.isOn ? 1 : 0) +
                       (devices.airConditioner.isOn ? 1 : 0) +
                       (devices.robotVacuum.isOn ? 1 : 0)}
                    </span>
                  </div>
                  <div className="overview-item">
                    <span className="overview-label">Güvenlik</span>
                    <span className={`overview-value ${devices.security.isArmed ? 'active' : 'inactive'}`}>
                      {devices.security.isArmed ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Room Details Component
const RoomDetails = ({ room, theme, devices, updateDeviceState }) => {
  const getRoomDevices = () => {
    const roomDevices = [];
    
    // Add lights
    if (room.devices.includes('lights')) {
      const light = devices.lights[room.lightId];
      if (light) {
        roomDevices.push({
          type: 'light',
          id: room.lightId,
          name: 'Aydınlatma',
          icon: '💡',
          isOn: light.isOn,
          brightness: light.brightness,
          color: light.color
        });
      }
    }
    
    // Add other devices based on room
    room.devices.forEach(deviceType => {
      if (deviceType === 'lights') return; // Already handled
      
      if (deviceType === 'thermostat') {
        roomDevices.push({
          type: 'thermostat',
          id: 'thermostat',
          name: 'Termostat',
          icon: '🌡️',
          isOn: devices.thermostat.isOn,
          temperature: devices.thermostat.temperature
        });
      } else if (deviceType === 'airConditioner') {
        roomDevices.push({
          type: 'airConditioner',
          id: 'airConditioner',
          name: 'Klima',
          icon: '❄️',
          isOn: devices.airConditioner.isOn,
          temperature: devices.airConditioner.temperature
        });
      } else if (devices.smartDevices[deviceType]) {
        const device = devices.smartDevices[deviceType];
        roomDevices.push({
          type: 'smartDevice',
          id: deviceType,
          name: getDeviceName(deviceType),
          icon: getDeviceIcon(deviceType),
          isOn: device.isOn,
          ...device
        });
      }
    });
    
    return roomDevices;
  };

  const getDeviceName = (deviceType) => {
    const names = {
      smartTV: 'Akıllı TV',
      musicSystem: 'Müzik Sistemi',
      dishwasher: 'Bulaşık Makinesi',
      coffee: 'Kahve Makinesi',
      curtains: 'Perdeler',
      waterHeater: 'Su Isıtıcısı'
    };
    return names[deviceType] || deviceType;
  };

  const getDeviceIcon = (deviceType) => {
    const icons = {
      smartTV: '📺',
      musicSystem: '🎵',
      dishwasher: '🍽️',
      coffee: '☕',
      curtains: '🪟',
      waterHeater: '🚿'
    };
    return icons[deviceType] || '📱';
  };

  const handleDeviceToggle = (device) => {
    if (device.type === 'light') {
      updateDeviceState('lights', device.id, { isOn: !device.isOn });
    } else if (device.type === 'smartDevice') {
      updateDeviceState('smartDevices', device.id, { isOn: !device.isOn });
    } else {
      updateDeviceState(device.id, null, { isOn: !device.isOn });
    }
  };

  const roomDevices = getRoomDevices();

  return (
    <div className="room-details-container">
      <div className="room-header">
        <h3>{room.name}</h3>
        <div className="room-status">
          <span className={`status-badge ${roomDevices.filter(d => d.isOn).length > 0 ? 'active' : 'inactive'}`}>
            {roomDevices.filter(d => d.isOn).length} / {roomDevices.length} Aktif
          </span>
        </div>
      </div>
      
      <div className="room-devices">
        {roomDevices.map(device => (
          <div key={`${device.type}-${device.id}`} className={`device-item ${device.isOn ? 'active' : 'inactive'}`}>
            <div className="device-header">
              <div className="device-info">
                <span className="device-icon">{device.icon}</span>
                <span className="device-name">{device.name}</span>
              </div>
              <button
                onClick={() => handleDeviceToggle(device)}
                className={`device-toggle ${device.isOn ? 'on' : 'off'}`}
              >
                {device.isOn ? 'Açık' : 'Kapalı'}
              </button>
            </div>
            
            {device.isOn && (
              <div className="device-controls">
                {device.type === 'light' && (
                  <div className="light-controls">
                    <label>Parlaklık: {device.brightness}%</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={device.brightness}
                      onChange={(e) => updateDeviceState('lights', device.id, { brightness: parseInt(e.target.value) })}
                      className="brightness-slider"
                    />
                  </div>
                )}
                
                {(device.type === 'thermostat' || device.type === 'airConditioner') && (
                  <div className="temperature-controls">
                    <span>Sıcaklık: {device.temperature}°C</span>
                    <div className="temp-buttons">
                      <button
                        onClick={() => updateDeviceState(device.id, null, { 
                          temperature: Math.max(16, device.temperature - 1) 
                        })}
                        className="temp-btn"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateDeviceState(device.id, null, { 
                          temperature: Math.min(30, device.temperature + 1) 
                        })}
                        className="temp-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
                
                {device.type === 'smartDevice' && device.id === 'musicSystem' && (
                  <div className="music-controls">
                    <label>Ses: {device.volume}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={device.volume}
                      onChange={(e) => updateDeviceState('smartDevices', device.id, { volume: parseInt(e.target.value) })}
                      className="volume-slider"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {roomDevices.length === 0 && (
        <div className="no-devices">
          <p>Bu odada kontrol edilebilir cihaz bulunmuyor.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;