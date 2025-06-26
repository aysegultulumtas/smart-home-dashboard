import React from 'react';

const SceneControl = ({ theme, scenes, activateScene }) => {
  const getSceneIcon = (sceneId) => {
    const icons = {
      movie: 'TV',
      sleep: 'BED',
      party: 'PARTY',
      away: 'CAR',
      work: 'WORK',
      study: 'BOOK'
    };
    return icons[sceneId] || 'HOME';
  };

  const getSceneColor = (sceneId) => {
    const colors = {
      movie: '#8b5cf6',
      sleep: '#1e40af',
      party: '#dc2626',
      away: '#059669',
      work: '#d97706',
      study: '#0891b2'
    };
    return colors[sceneId] || '#6b7280';
  };

  return (
    <div className="scene-control">
      <h3>Akıllı Senaryolar</h3>
      <p className="scene-description">
        Önceden tanımlanmış senaryo kombinasyonlarını tek tıkla aktifleştirin
      </p>
      
      <div className="scenes-grid">
        {Object.entries(scenes).map(([sceneId, scene]) => (
          <div 
            key={sceneId} 
            className={`scene-card ${scene.active ? 'active' : ''}`}
            onClick={() => activateScene(sceneId)}
          >
            <div className="scene-header">
              <div 
                className="scene-icon"
                style={{ backgroundColor: getSceneColor(sceneId) }}
              >
                {getSceneIcon(sceneId)}
              </div>
              <div className={`scene-status ${scene.active ? 'active' : 'inactive'}`}>
                {scene.active ? 'Aktif' : 'Pasif'}
              </div>
            </div>
            
            <div className="scene-content">
              <h4 className="scene-name">{scene.name}</h4>
              <p className="scene-desc">{scene.description}</p>
            </div>
            
            <div className="scene-actions">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  activateScene(sceneId);
                }}
                className={`scene-button ${scene.active ? 'deactivate' : 'activate'}`}
                style={{ 
                  backgroundColor: scene.active ? '#ef4444' : getSceneColor(sceneId) 
                }}
              >
                {scene.active ? 'Deaktif Et' : 'Aktif Et'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="scene-info">
        <h4>Senaryo Açıklamaları</h4>
        <div className="scene-explanations">
          <div className="explanation-item">
            <span className="explanation-icon">TV</span>
            <div className="explanation-text">
              <strong>Film Modu:</strong> Işıkları loş yapar, TV'yi açar
            </div>
          </div>
          
          <div className="explanation-item">
            <span className="explanation-icon">BED</span>
            <div className="explanation-text">
              <strong>Uyku Modu:</strong> Tüm ışıkları kapatır, güvenliği aktif eder
            </div>
          </div>
          
          <div className="explanation-item">
            <span className="explanation-icon">PARTY</span>
            <div className="explanation-text">
              <strong>Parti Modu:</strong> Parlak ışıklar, yüksek ses
            </div>
          </div>
          
          <div className="explanation-item">
            <span className="explanation-icon">CAR</span>
            <div className="explanation-text">
              <strong>Dış Mekân:</strong> Enerji tasarrufu, güvenlik aktif
            </div>
          </div>
          
          <div className="explanation-item">
            <span className="explanation-icon">WORK</span>
            <div className="explanation-text">
              <strong>Çalışma Modu:</strong> Optimum aydınlatma, kahve makinesi
            </div>
          </div>
          
          <div className="explanation-item">
            <span className="explanation-icon">BOOK</span>
            <div className="explanation-text">
              <strong>Çalışma Modu:</strong> Odaklanma için ideal ortam
            </div>
          </div>
        </div>
      </div>

      <div className="scene-tips">
        <h4>İpuçları</h4>
        <ul className="tips-list">
          <li>Ses komutları ile de senaryoları aktifleştirebilirsiniz</li>
          <li>Bir senaryo aktifken diğerleri otomatik pasif olur</li>
          <li>Senaryolar cihaz ayarlarını otomatik değiştirir</li>
          <li>Özel senaryolar otomasyon panelinden oluşturabilirsiniz</li>
        </ul>
      </div>
    </div>
  );
};

export default SceneControl;