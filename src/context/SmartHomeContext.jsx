import React, { useState, createContext, useContext } from 'react';
import useVoiceControl from '../hooks/useVoiceControl';

const SmartHomeContext = createContext();

export const SmartHomeProvider = ({ children }) => {
  const [devices, setDevices] = useState({
    lights: {
      livingRoom: { 
        id: 'livingRoom', 
        name: 'Oturma Odası', 
        isOn: false, 
        brightness: 70, 
        color: '#FFA500',
        room: 'living-room'
      },
      kitchen: { 
        id: 'kitchen', 
        name: 'Mutfak', 
        isOn: false, 
        brightness: 60, 
        color: '#FFA500',
        room: 'kitchen'
      },
      bedroom: { 
        id: 'bedroom', 
        name: 'Yatak Odası', 
        isOn: false, 
        brightness: 50, 
        color: '#FFA500',
        room: 'bedroom'
      },
      bathroom: { 
        id: 'bathroom', 
        name: 'Banyo', 
        isOn: false, 
        brightness: 80, 
        color: '#FFA500',
        room: 'bathroom'
      }
    },
    thermostat: { 
      isOn: false, 
      temperature: 22, 
      mode: 'heat', 
      schedule: [],
      targetTemp: 22,
      currentTemp: 21
    },
    robotVacuum: { 
      isOn: false, 
      batteryLevel: 85, 
      dustLevel: 20, 
      status: 'idle',
      schedule: 'Günlük 10:00',
      cleanedArea: 0,
      totalArea: 150,
      isCharging: false
    },
    doors: {
      main: { 
        id: 'main', 
        name: 'Ana Kapı', 
        isLocked: true, 
        isOpen: false, 
        lastAccess: '2 saat önce',
        accessCode: '1234'
      },
      backyard: { 
        id: 'backyard', 
        name: 'Arka Bahçe', 
        isLocked: true, 
        isOpen: false, 
        lastAccess: '1 gün önce',
        accessCode: '5678'
      }
    },
    airConditioner: { 
      isOn: false, 
      temperature: 24, 
      fanSpeed: 2, 
      mode: 'cool',
      timer: 0,
      energySaving: false
    },
    security: { 
      isArmed: false, 
      motionDetected: false, 
      cameras: 4, 
      alerts: [],
      sensors: {
        motion: 6,
        door: 4,
        window: 8,
        smoke: 3
      },
      lastIncident: null,
      recordingMode: 'auto',
      alarmHistory: []
    },
    powerMode: { 
      mode: 'normal', 
      savings: 0, 
      totalConsumption: 150,
      dailyUsage: 45.2,
      monthlyBill: 285,
      carbonFootprint: 12.5,
      peakHours: '18:00-22:00',
      currentUsage: 2.3,
      solarPanels: {
        isActive: true,
        production: 25.8,
        efficiency: 87
      }
    },
    weather: { 
      inside: 22, 
      outside: 18, 
      humidity: 45, 
      airQuality: 'Good',
      forecast: 'Güneşli'
    },
    scenes: {
      movie: { 
        name: 'Film Modu', 
        active: false, 
        description: 'Loş ışık ve optimal ses ayarları'
      },
      sleep: { 
        name: 'Uyku Modu', 
        active: false, 
        description: 'Tüm ışıklar kapalı, güvenlik aktif'
      },
      party: { 
        name: 'Parti Modu', 
        active: false, 
        description: 'Parlak ışıklar ve yüksek ses'
      },
      away: { 
        name: 'Dış Mekân', 
        active: false, 
        description: 'Güvenlik modu ve enerji tasarrufu'
      },
      work: { 
        name: 'Çalışma Modu', 
        active: false, 
        description: 'Optimum aydınlatma ve sessizlik'
      },
      study: { 
        name: 'Çalışma Modu', 
        active: false, 
        description: 'Odaklanma için ideal ortam'
      }
    },
    smartDevices: {
      musicSystem: { 
        isOn: false, 
        volume: 50, 
        currentSong: 'Müzik yok',
        playlist: 'Favoriler',
        bass: 50,
        treble: 50,
        balance: 0
      },
      waterHeater: { 
        isOn: false, 
        temperature: 60, 
        schedule: '06:00-08:00, 19:00-21:00',
        energyMode: 'eco'
      },
      perde: {  
        livingRoom: { 
          isOpen: true, 
          position: 100, 
          isAuto: true,
          room: 'living-room'
        },
        bedroom: { 
          isOpen: true, 
          position: 100, 
          isAuto: false,
          room: 'bedroom'
        }
      },
      smartTV: {
        isOn: false,
        channel: 1,
        volume: 45,
        currentApp: 'Netflix',
        screenSaver: true,
        brightness: 75
      },
      dishwasher: {
        isOn: false,
        program: 'Eco',
        timeRemaining: 0,
        isLoaded: false,
        cycleCount: 245
      },
      washingMachine: {
        isOn: false,
        program: 'Cotton',
        timeRemaining: 0,
        isLoaded: false,
        temperature: 40,
        spinSpeed: 1200
      },
      smartMirror: {
        isOn: false,
        showWeather: true,
        showNews: true,
        showCalendar: true,
        brightness: 80
      },
      airPurifier: {
        isOn: false,
        mode: 'auto',
        filterLife: 85,
        airQuality: 'Good',
        fanSpeed: 2
      },
      coffee: { 
        isOn: false,
        cups: 2,
        schedule: '07:00',
        waterLevel: 75,
        beansLevel: 60
      }
    }
  });

  const updateDeviceState = (deviceType, deviceId, newState) => {
    setDevices(prevDevices => {
      if (deviceId) {
        if (deviceType === 'smartDevices') {
          return {
            ...prevDevices,
            smartDevices: {
              ...prevDevices.smartDevices,
              [deviceId]: {
                ...prevDevices.smartDevices[deviceId],
                ...newState
              }
            }
          };
        }
        return {
          ...prevDevices,
          [deviceType]: {
            ...prevDevices[deviceType],
            [deviceId]: {
              ...prevDevices[deviceType][deviceId],
              ...newState
            }
          }
        };
      } else {
        return {
          ...prevDevices,
          [deviceType]: {
            ...prevDevices[deviceType],
            ...newState
          }
        };
      }
    });
  };

  const activateScene = (sceneName) => {
    const newDevices = { ...devices };
    
    // Tüm sahneleri pasif yap
    Object.keys(newDevices.scenes).forEach(scene => {
      newDevices.scenes[scene].active = false;
    });
    
    // Seçili sahneyi aktif yap
    if (newDevices.scenes[sceneName]) {
      newDevices.scenes[sceneName].active = true;
    }
    
    switch(sceneName) {
      case 'movie':
        Object.keys(newDevices.lights).forEach(light => {
          newDevices.lights[light] = { ...newDevices.lights[light], isOn: true, brightness: 20 };
        });
        newDevices.smartDevices.smartTV = { ...newDevices.smartDevices.smartTV, isOn: true };
        break;
        
      case 'sleep':
        Object.keys(newDevices.lights).forEach(light => {
          newDevices.lights[light] = { ...newDevices.lights[light], isOn: false };
        });
        newDevices.security = { ...newDevices.security, isArmed: true };
        break;
        
      case 'party':
        Object.keys(newDevices.lights).forEach(light => {
          newDevices.lights[light] = { ...newDevices.lights[light], isOn: true, brightness: 100 };
        });
        newDevices.smartDevices.musicSystem = { 
          ...newDevices.smartDevices.musicSystem, 
          isOn: true, 
          volume: 80 
        };
        break;
        
      case 'away':
        Object.keys(newDevices.lights).forEach(light => {
          newDevices.lights[light] = { ...newDevices.lights[light], isOn: false };
        });
        newDevices.security = { ...newDevices.security, isArmed: true };
        newDevices.thermostat = { ...newDevices.thermostat, isOn: false };
        break;
        
      case 'work':
      case 'study':
        newDevices.lights.livingRoom = { ...newDevices.lights.livingRoom, isOn: true, brightness: 80 };
        newDevices.smartDevices.coffee = { ...newDevices.smartDevices.coffee, isOn: true };
        newDevices.smartDevices.musicSystem = { 
          ...newDevices.smartDevices.musicSystem, 
          isOn: false 
        };
        break;
        
      default:
        break;
    }
    setDevices(newDevices);
  };

  // Ses kontrol hook'unu kullan
  const voiceControlData = useVoiceControl(devices, updateDeviceState, activateScene);

  const value = { 
    devices, 
    updateDeviceState, 
    activateScene,
    scenes: devices.scenes,
    powerMode: devices.powerMode,
    schedules: {},
    automationRules: {},
    // Sadece gerekli ses kontrol verileri
    isListening: voiceControlData.isListening,
    lastCommand: voiceControlData.lastCommand,
    isSupported: voiceControlData.isSupported,
    startListening: voiceControlData.startListening,
    stopListening: voiceControlData.stopListening
  };

  return (
    <SmartHomeContext.Provider value={value}>
      {children}
    </SmartHomeContext.Provider>
  );
};

export const useSmartHome = () => {
  const context = useContext(SmartHomeContext);
  if (!context) {
    throw new Error('useSmartHome hook must be used within a SmartHomeProvider');
  }
  return context;
};