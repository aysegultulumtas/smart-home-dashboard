import { useState, useEffect } from 'react';

const useVoiceControl = (devices, updateDeviceState, activateScene) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'tr-TR';
      
      recognitionInstance.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        setLastCommand(command);
        processVoiceCommand(command);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Ses tanıma hatası:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const processVoiceCommand = (command) => {
    console.log('Ses komutu:', command);

    // ISI/SOĞUTMA KONTROLLERI
    if (command.includes('klima') || command.includes('iklim')) {
      if (command.includes('aç') || command.includes('başlat')) {
        updateDeviceState('airConditioner', null, { isOn: true });
        console.log('Klima açıldı');
      } else if (command.includes('kapat')) {
        updateDeviceState('airConditioner', null, { isOn: false });
        console.log('Klima kapatıldı');
      }
    }

    if (command.includes('termostat')) {
      if (command.includes('aç') || command.includes('başlat')) {
        updateDeviceState('thermostat', null, { isOn: true });
        console.log('Termostat açıldı');
      } else if (command.includes('kapat')) {
        updateDeviceState('thermostat', null, { isOn: false });
        console.log('Termostat kapatıldı');
      }
    }

    if (command.includes('su ısıtıcı') || command.includes('şofben') || command.includes('kombi')) {
      if (command.includes('aç') || command.includes('başlat')) {
        updateDeviceState('smartDevices', 'waterHeater', { isOn: true });
        console.log('Su ısıtıcısı açıldı');
      } else if (command.includes('kapat')) {
        updateDeviceState('smartDevices', 'waterHeater', { isOn: false });
        console.log('Su ısıtıcısı kapatıldı');
      }
    }

    // IŞIK KONTROLLERI - Tüm odalar
    if (command.includes('ışık') || command.includes('lamba') || command.includes('aydınlatma')) {
      if (command.includes('oturma') || command.includes('salon')) {
        if (command.includes('aç')) {
          updateDeviceState('lights', 'livingRoom', { isOn: true });
          console.log('Oturma odası ışığı açıldı');
        } else if (command.includes('kapat')) {
          updateDeviceState('lights', 'livingRoom', { isOn: false });
          console.log('Oturma odası ışığı kapatıldı');
        }
      } else if (command.includes('mutfak')) {
        if (command.includes('aç')) {
          updateDeviceState('lights', 'kitchen', { isOn: true });
          console.log('Mutfak ışığı açıldı');
        } else if (command.includes('kapat')) {
          updateDeviceState('lights', 'kitchen', { isOn: false });
          console.log('Mutfak ışığı kapatıldı');
        }
      } else if (command.includes('yatak') || command.includes('oda')) {
        if (command.includes('aç')) {
          updateDeviceState('lights', 'bedroom', { isOn: true });
          console.log('Yatak odası ışığı açıldı');
        } else if (command.includes('kapat')) {
          updateDeviceState('lights', 'bedroom', { isOn: false });
          console.log('Yatak odası ışığı kapatıldı');
        }
      } else if (command.includes('banyo')) {
        if (command.includes('aç')) {
          updateDeviceState('lights', 'bathroom', { isOn: true });
          console.log('Banyo ışığı açıldı');
        } else if (command.includes('kapat')) {
          updateDeviceState('lights', 'bathroom', { isOn: false });
          console.log('Banyo ışığı kapatıldı');
        }
      } else if (command.includes('tüm') || command.includes('hepsi')) {
        if (command.includes('aç')) {
          Object.keys(devices.lights).forEach(lightId => {
            updateDeviceState('lights', lightId, { isOn: true });
          });
          console.log('Tüm ışıklar açıldı');
        } else if (command.includes('kapat')) {
          Object.keys(devices.lights).forEach(lightId => {
            updateDeviceState('lights', lightId, { isOn: false });
          });
          console.log('Tüm ışıklar kapatıldı');
        }
      }
    }

    // PERDE KONTROLLERI
    if (command.includes('perde') || command.includes('fon perde')) {
      if (command.includes('oturma') || command.includes('salon')) {
        if (command.includes('aç') || command.includes('kaldır')) {
          updateDeviceState('smartDevices', 'perde', { 
            livingRoom: { ...devices.smartDevices.perde.livingRoom, isOpen: true, position: 100 }
          });
          console.log('Oturma odası perdesi açıldı');
        } else if (command.includes('kapat') || command.includes('indir')) {
          updateDeviceState('smartDevices', 'perde', { 
            livingRoom: { ...devices.smartDevices.perde.livingRoom, isOpen: false, position: 0 }
          });
          console.log('Oturma odası perdesi kapatıldı');
        }
      } else if (command.includes('yatak') || command.includes('oda')) {
        if (command.includes('aç') || command.includes('kaldır')) {
          updateDeviceState('smartDevices', 'perde', { 
            bedroom: { ...devices.smartDevices.perde.bedroom, isOpen: true, position: 100 }
          });
          console.log('Yatak odası perdesi açıldı');
        } else if (command.includes('kapat') || command.includes('indir')) {
          updateDeviceState('smartDevices', 'perde', { 
            bedroom: { ...devices.smartDevices.perde.bedroom, isOpen: false, position: 0 }
          });
          console.log('Yatak odası perdesi kapatıldı');
        }
      } else if (command.includes('tüm') || command.includes('hepsi')) {
        if (command.includes('aç') || command.includes('kaldır')) {
          updateDeviceState('smartDevices', 'perde', {
            livingRoom: { ...devices.smartDevices.perde.livingRoom, isOpen: true, position: 100 },
            bedroom: { ...devices.smartDevices.perde.bedroom, isOpen: true, position: 100 }
          });
          console.log('Tüm perdeler açıldı');
        } else if (command.includes('kapat') || command.includes('indir')) {
          updateDeviceState('smartDevices', 'perde', {
            livingRoom: { ...devices.smartDevices.perde.livingRoom, isOpen: false, position: 0 },
            bedroom: { ...devices.smartDevices.perde.bedroom, isOpen: false, position: 0 }
          });
          console.log('Tüm perdeler kapatıldı');
        }
      }
    }

    // GÜVENLİK SİSTEMİ
    if (command.includes('güvenlik') || command.includes('alarm')) {
      if (command.includes('aç') || command.includes('aktif') || command.includes('devreye')) {
        updateDeviceState('security', null, { isArmed: true });
        console.log('Güvenlik sistemi aktif edildi');
      } else if (command.includes('kapat') || command.includes('pasif') || command.includes('devre dışı')) {
        updateDeviceState('security', null, { isArmed: false });
        console.log('Güvenlik sistemi pasif edildi');
      }
    }

    // KAMERALAR
    if (command.includes('kamera') || command.includes('kayıt')) {
      if (command.includes('başlat') || command.includes('aç')) {
        updateDeviceState('security', null, { recordingMode: 'continuous' });
        console.log('Kamera kaydı başlatıldı');
      } else if (command.includes('durdur') || command.includes('kapat')) {
        updateDeviceState('security', null, { recordingMode: 'off' });
        console.log('Kamera kaydı durduruldu');
      }
    }

    // ROBOT SÜPÜRGE
    if (command.includes('robot') || command.includes('süpürge') || command.includes('temizlik')) {
      if (command.includes('başlat') || command.includes('çalıştır')) {
        updateDeviceState('robotVacuum', null, { isOn: true, status: 'cleaning' });
        console.log('Robot süpürge başlatıldı');
      } else if (command.includes('durdur') || command.includes('kapat')) {
        updateDeviceState('robotVacuum', null, { isOn: false, status: 'idle' });
        console.log('Robot süpürge durduruldu');
      } else if (command.includes('şarj') || command.includes('istasyon')) {
        updateDeviceState('robotVacuum', null, { isOn: false, status: 'charging', isCharging: true });
        console.log('Robot süpürge şarj istasyonuna gönderildi');
      }
    }

    // MÜZİK SİSTEMİ
    if (command.includes('müzik') || command.includes('ses') || command.includes('hoparlör')) {
      if (command.includes('aç') || command.includes('başlat') || command.includes('çal')) {
        updateDeviceState('smartDevices', 'musicSystem', { isOn: true });
        console.log('Müzik sistemi açıldı');
      } else if (command.includes('kapat') || command.includes('durdur')) {
        updateDeviceState('smartDevices', 'musicSystem', { isOn: false });
        console.log('Müzik sistemi kapatıldı');
      } else if (command.includes('yükselt') || command.includes('artır')) {
        const currentVolume = devices.smartDevices.musicSystem.volume;
        updateDeviceState('smartDevices', 'musicSystem', { volume: Math.min(100, currentVolume + 10) });
        console.log('Ses yükseltildi');
      } else if (command.includes('azalt') || command.includes('düşür')) {
        const currentVolume = devices.smartDevices.musicSystem.volume;
        updateDeviceState('smartDevices', 'musicSystem', { volume: Math.max(0, currentVolume - 10) });
        console.log('Ses azaltıldı');
      }
    }

    // AKILLI TV
    if (command.includes('televizyon') || command.includes('tv')) {
      if (command.includes('aç')) {
        updateDeviceState('smartDevices', 'smartTV', { isOn: true });
        console.log('TV açıldı');
      } else if (command.includes('kapat')) {
        updateDeviceState('smartDevices', 'smartTV', { isOn: false });
        console.log('TV kapatıldı');
      }
    }

    // KAHVE MAKİNESİ
    if (command.includes('kahve')) {
      if (command.includes('aç') || command.includes('başlat') || command.includes('yap')) {
        updateDeviceState('smartDevices', 'coffee', { isOn: true });
        console.log('Kahve makinesi başlatıldı');
      } else if (command.includes('kapat') || command.includes('durdur')) {
        updateDeviceState('smartDevices', 'coffee', { isOn: false });
        console.log('Kahve makinesi durduruldu');
      }
    }

    // BULAŞIK MAKİNESİ
    if (command.includes('bulaşık')) {
      if (command.includes('başlat') || command.includes('çalıştır')) {
        updateDeviceState('smartDevices', 'dishwasher', { isOn: true, timeRemaining: 120 });
        console.log('Bulaşık makinesi başlatıldı');
      } else if (command.includes('durdur') || command.includes('kapat')) {
        updateDeviceState('smartDevices', 'dishwasher', { isOn: false, timeRemaining: 0 });
        console.log('Bulaşık makinesi durduruldu');
      }
    }

    // ÇAMAŞIR MAKİNESİ
    if (command.includes('çamaşır')) {
      if (command.includes('başlat') || command.includes('çalıştır')) {
        updateDeviceState('smartDevices', 'washingMachine', { isOn: true, timeRemaining: 180 });
        console.log('Çamaşır makinesi başlatıldı');
      } else if (command.includes('durdur') || command.includes('kapat')) {
        updateDeviceState('smartDevices', 'washingMachine', { isOn: false, timeRemaining: 0 });
        console.log('Çamaşır makinesi durduruldu');
      }
    }

    // HAVA TEMİZLEYİCİ
    if (command.includes('hava temizleyici') || command.includes('filtre')) {
      if (command.includes('aç') || command.includes('başlat')) {
        updateDeviceState('smartDevices', 'airPurifier', { isOn: true });
        console.log('Hava temizleyici açıldı');
      } else if (command.includes('kapat')) {
        updateDeviceState('smartDevices', 'airPurifier', { isOn: false });
        console.log('Hava temizleyici kapatıldı');
      }
    }

    // AKILLI AYNA
    if (command.includes('ayna')) {
      if (command.includes('aç')) {
        updateDeviceState('smartDevices', 'smartMirror', { isOn: true });
        console.log('Akıllı ayna açıldı');
      } else if (command.includes('kapat')) {
        updateDeviceState('smartDevices', 'smartMirror', { isOn: false });
        console.log('Akıllı ayna kapatıldı');
      }
    }

    // SENARYOLAR
    if (command.includes('film modu') || command.includes('sinema')) {
      activateScene('movie');
      console.log('Film modu aktif edildi');
    } else if (command.includes('uyku modu') || command.includes('gece')) {
      activateScene('sleep');
      console.log('Uyku modu aktif edildi');
    } else if (command.includes('parti modu') || command.includes('eğlence')) {
      activateScene('party');
      console.log('Parti modu aktif edildi');
    } else if (command.includes('çalışma modu') || command.includes('ofis')) {
      activateScene('work');
      console.log('Çalışma modu aktif edildi');
    } else if (command.includes('dışarı') || command.includes('evden çık')) {
      activateScene('away');
      console.log('Dışarı modu aktif edildi');
    }

    // KAPI KİLİTLERİ
    if (command.includes('kapı')) {
      if (command.includes('ana') || command.includes('giriş')) {
        if (command.includes('kilitle') || command.includes('kapat')) {
          updateDeviceState('doors', 'main', { isLocked: true });
          console.log('Ana kapı kilitlendi');
        } else if (command.includes('aç') || command.includes('kilit aç')) {
          updateDeviceState('doors', 'main', { isLocked: false });
          console.log('Ana kapı kilidi açıldı');
        }
      } else if (command.includes('arka') || command.includes('bahçe')) {
        if (command.includes('kilitle') || command.includes('kapat')) {
          updateDeviceState('doors', 'backyard', { isLocked: true });
          console.log('Arka kapı kilitlendi');
        } else if (command.includes('aç') || command.includes('kilit aç')) {
          updateDeviceState('doors', 'backyard', { isLocked: false });
          console.log('Arka kapı kilidi açıldı');
        }
      }
    }

    // ENERJİ MODLARI
    if (command.includes('enerji tasarrufu') || command.includes('eco mod')) {
      updateDeviceState('powerMode', null, { mode: 'eco' });
      console.log('Enerji tasarrufu modu aktif edildi');
    } else if (command.includes('normal mod')) {
      updateDeviceState('powerMode', null, { mode: 'normal' });
      console.log('Normal mod aktif edildi');
    } else if (command.includes('performans mod')) {
      updateDeviceState('powerMode', null, { mode: 'performance' });
      console.log('Performans modu aktif edildi');
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    lastCommand,
    isSupported,
    startListening,
    stopListening
  };
};

export default useVoiceControl;