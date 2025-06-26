import React from 'react';

const WeatherWidget = ({ theme, weather }) => {
  const getWeatherIcon = (condition) => {
    const icons = {
      'Güneşli': '☀️',
      'Bulutlu': '☁️',
      'Yağmurlu': '🌧️',
      'Karlı': '❄️',
      'Rüzgarlı': '💨'
    };
    return icons[condition] || '🌤️';
  };

  const getAirQualityColor = (quality) => {
    const colors = {
      'Good': '#10b981',
      'Moderate': '#f59e0b',
      'Poor': '#ef4444'
    };
    return colors[quality] || '#6b7280';
  };

  const getAirQualityText = (quality) => {
    const texts = {
      'Good': 'İyi',
      'Moderate': 'Orta',
      'Poor': 'Kötü'
    };
    return texts[quality] || quality;
  };

  return (
    <div className="weather-widget">
      <h3>Hava Durumu</h3>
      
      <div className="weather-main">
        <div className="weather-icon">
          {getWeatherIcon(weather.forecast)}
        </div>
        <div className="weather-temps">
          <div className="temp-item">
            <span className="temp-label">İç</span>
            <span className="temp-value">{weather.inside}°C</span>
          </div>
          <div className="temp-item">
            <span className="temp-label">Dış</span>
            <span className="temp-value">{weather.outside}°C</span>
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <div className="detail-info">
            <span className="detail-label">Nem</span>
            <span className="detail-value">%{weather.humidity}</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">🌪️</span>
          <div className="detail-info">
            <span className="detail-label">Hava Kalitesi</span>
            <span 
              className="detail-value"
              style={{ color: getAirQualityColor(weather.airQuality) }}
            >
              {getAirQualityText(weather.airQuality)}
            </span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">🌤️</span>
          <div className="detail-info">
            <span className="detail-label">Durum</span>
            <span className="detail-value">{weather.forecast}</span>
          </div>
        </div>
      </div>

      <div className="weather-recommendations">
        <h4>Öneriler</h4>
        <div className="recommendations-list">
          {weather.outside < weather.inside - 5 && (
            <div className="recommendation">
              🌡️ Dış hava soğuk, ısıtmayı artırabilirsiniz
            </div>
          )}
          
          {weather.humidity > 70 && (
            <div className="recommendation">
              💧 Nem yüksek, havalandırma açın
            </div>
          )}
          
          {weather.airQuality === 'Poor' && (
            <div className="recommendation warning">
              🌪️ Hava kalitesi kötü, hava temizleyici açın
            </div>
          )}
          
          {weather.outside > weather.inside + 5 && (
            <div className="recommendation">
              ❄️ Dış hava sıcak, klimayı açabilirsiniz
            </div>
          )}
        </div>
      </div>

      <div className="comfort-level">
        <h4>Konfor Seviyesi</h4>
        <div className="comfort-indicator">
          {(() => {
            const temp = weather.inside;
            const humidity = weather.humidity;
            
            if (temp >= 20 && temp <= 24 && humidity >= 40 && humidity <= 60) {
              return (
                <div className="comfort-item good">
                  <span className="comfort-icon">😊</span>
                  <span className="comfort-text">Mükemmel</span>
                </div>
              );
            } else if (temp >= 18 && temp <= 26 && humidity >= 30 && humidity <= 70) {
              return (
                <div className="comfort-item moderate">
                  <span className="comfort-icon">😐</span>
                  <span className="comfort-text">İyi</span>
                </div>
              );
            } else {
              return (
                <div className="comfort-item poor">
                  <span className="comfort-icon">😕</span>
                  <span className="comfort-text">Ayarlama Gerekli</span>
                </div>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;