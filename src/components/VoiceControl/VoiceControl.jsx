import React from 'react';
import { useSmartHome } from '../../context/SmartHomeContext';
import './VoiceControl.css';

const VoiceControl = ({ theme }) => {
  const { 
    isListening, 
    lastCommand, 
    isSupported,
    startListening, 
    stopListening 
  } = useSmartHome();

  if (!isSupported) {
    return null;
  }

  return (
    <div className="voice-control">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`voice-button ${isListening ? 'listening' : ''} ${theme}`}
        title={isListening ? 'Dinlemeyi Durdur' : 'Ses Komutunu Başlat'}
      >
        <div className="voice-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/>
          </svg>
        </div>
        <div className="voice-pulse"></div>
      </button>
      
      {lastCommand && (
        <div className={`transcript-bubble ${theme}`}>
          <div className="transcript-text">"{lastCommand}"</div>
          <div className="transcript-arrow"></div>
        </div>
      )}
      
      {isListening && (
        <div className="listening-indicator">
          <div className="sound-wave">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceControl;