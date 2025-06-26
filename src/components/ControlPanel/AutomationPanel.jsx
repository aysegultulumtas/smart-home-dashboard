import React, { useState } from 'react';
import { useSmartHome } from '../../context/SmartHomeContext';
import './ControlPanel.css';

const AutomationPanel = ({ theme }) => {
  const { devices, updateDeviceState, activateScene } = useSmartHome();
  const [activeTab, setActiveTab] = useState('rules');
  const [ruleStates, setRuleStates] = useState({
    energy_saver: true,
    security_night: true,
    comfort_temperature: true,
    morning_routine: false,
    air_quality_control: true,
    motion_lighting: true
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('');

  // Sabit kural listesi
  const rules = [
    {
      id: 'energy_saver',
      name: 'Enerji Tasarrufu',
      description: 'Tüketim 5kW üzerine çıktığında gereksiz cihazları otomatik kapat',
      category: 'Enerji'
    },
    {
      id: 'security_night',
      name: 'Gece Güvenliği',
      description: '23:00\'da güvenlik sistemini otomatik aktif et',
      category: 'Güvenlik'
    },
    {
      id: 'comfort_temperature',
      name: 'Konfor Sıcaklığı',
      description: 'Sıcaklık 18°C altına düştüğünde termostatı 22°C yap',
      category: 'İklim'
    },
    {
      id: 'morning_routine',
      name: 'Sabah Rutini',
      description: '07:00\'da kahve makinesi ve mutfak ışığını aç (Hafta içi)',
      category: 'Rutin'
    },
    {
      id: 'air_quality_control',
      name: 'Hava Kalitesi Kontrolü',
      description: 'Hava kalitesi kötüleştiğinde hava temizleyiciyi otomatik aç',
      category: 'Sağlık'
    },
    {
      id: 'motion_lighting',
      name: 'Hareket Aydınlatması',
      description: 'Hareket algılandığında ilgili odanın ışığını otomatik aç',
      category: 'Konfor'
    }
  ];

  const tabs = [
    { id: 'rules', name: 'Akıllı Kurallar', icon: '⚙️' },
    { id: 'schedules', name: 'Zamanlamalar', icon: '⏲️' },
    { id: 'scenes', name: 'Senaryolar', icon: '🎬' },
    { id: 'create', name: 'Yeni Oluştur', icon: '✨' }
  ];

  const handleRuleToggle = (ruleId) => {
    setRuleStates(prev => ({
      ...prev,
      [ruleId]: !prev[ruleId]
    }));
    console.log(`Kural ${ruleId} durumu değiştirildi`);
  };

  const handleCreateAction = (type) => {
    setCreateType(type);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setCreateType('');
  };

  const renderRulesTab = () => (
    <div className="rules-container">
      <div className="rules-header">
        <h3>Aktif Akıllı Kurallar</h3>
        <p>Otomatik çalışacak kuralları yönetin</p>
      </div>

      <div className="rules-stats">
        <div className="stat-card">
          <span className="stat-number">{Object.values(ruleStates).filter(Boolean).length}</span>
          <span className="stat-label">Aktif Kural</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{rules.length}</span>
          <span className="stat-label">Toplam Kural</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">6</span>
          <span className="stat-label">Kategori</span>
        </div>
      </div>

      <div className="rules-grid">
        {rules.map(rule => (
          <div key={rule.id} className={`rule-card ${ruleStates[rule.id] ? 'active' : 'inactive'}`}>
            <div className="rule-header">
              <div className="rule-info">
                <h4>{rule.name}</h4>
                <span className={`rule-category ${rule.category.toLowerCase()}`}>
                  {rule.category}
                </span>
              </div>
              <button
                onClick={() => handleRuleToggle(rule.id)}
                className={`rule-toggle ${ruleStates[rule.id] ? 'active' : 'inactive'}`}
              >
                {ruleStates[rule.id] ? 'Aktif' : 'Pasif'}
              </button>
            </div>
            
            <p className="rule-description">{rule.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchedulesTab = () => (
    <div className="schedules-container">
      <div className="schedules-header">
        <h3>Zamanlamalar</h3>
        <p>Belirli saatlerde çalışacak otomasyonlar</p>
      </div>
      
      <div className="empty-state">
        <div className="empty-icon">⏲️</div>
        <h4>Henüz zamanlama yok</h4>
        <p>Yeni Oluştur sekmesinden zamanlama ekleyebilirsiniz</p>
      </div>
    </div>
  );

  const renderScenesTab = () => (
    <div className="scenes-container">
      <div className="scenes-header">
        <h3>Senaryolar</h3>
        <p>Birden fazla cihazı kontrol eden senaryolar</p>
      </div>

      <div className="scenes-grid">
        {Object.entries(devices.scenes || {}).map(([sceneId, scene]) => (
          <div 
            key={sceneId} 
            className={`scene-card ${scene.active ? 'active' : ''}`}
            onClick={() => activateScene(sceneId)}
          >
            <div className="scene-header">
              <h4 className="scene-name">{scene.name}</h4>
              <div className={`scene-status ${scene.active ? 'active' : 'inactive'}`}>
                {scene.active ? 'Aktif' : 'Pasif'}
              </div>
            </div>
            <p className="scene-description">{scene.description}</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                activateScene(sceneId);
              }}
              className="scene-activate"
            >
              Aktif Et
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreateTab = () => (
    <div className="create-container">
      <div className="create-header">
        <h3>Yeni Otomasyon Oluştur</h3>
        <p>Kendi kurallarınızı ve zamanlamalarınızı oluşturun</p>
      </div>
      
      <div className="creation-options">
        <div className="option-card">
          <div className="option-icon">🎯</div>
          <h4>Yeni Kural</h4>
          <p>Koşula bağlı otomatik eylemler tanımlayın</p>
          <button className="create-button" onClick={() => handleCreateAction('rule')}>
            Kural Oluştur
          </button>
        </div>
        
        <div className="option-card">
          <div className="option-icon">🕐</div>
          <h4>Zamanlama</h4>
          <p>Belirli saatlerde çalışacak otomasyonlar ayarlayın</p>
          <button className="create-button" onClick={() => handleCreateAction('schedule')}>
            Zamanlama Ekle
          </button>
        </div>
        
        <div className="option-card">
          <div className="option-icon">🎪</div>
          <h4>Senaryo</h4>
          <p>Birden fazla cihazı kontrol eden senaryo oluşturun</p>
          <button className="create-button" onClick={() => handleCreateAction('scene')}>
            Senaryo Oluştur
          </button>
        </div>
      </div>

      <div className="quick-templates">
        <h4>Hızlı Şablonlar</h4>
        <div className="templates-grid">
          <div className="template-card" onClick={() => handleCreateAction('energy')}>
            <h5>🔋 Enerji Tasarrufu</h5>
            <p>Yüksek tüketimde otomatik tasarruf</p>
          </div>
          
          <div className="template-card" onClick={() => handleCreateAction('night')}>
            <h5>🌛 Gece Modu</h5>
            <p>Belirli saatte uyku moduna geç</p>
          </div>
          
          <div className="template-card" onClick={() => handleCreateAction('climate')}>
            <h5>🌪️ İklim Kontrolü</h5>
            <p>Sıcaklık düştüğünde ısıtma</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'rules':
        return renderRulesTab();
      case 'schedules':
        return renderSchedulesTab();
      case 'scenes':
        return renderScenesTab();
      case 'create':
        return renderCreateTab();
      default:
        return renderRulesTab();
    }
  };

  return (
    <div className={`automation-panel ${theme}`}>
      <div className="automation-header">
        <div className="panel-title">
          <h2>Otomasyon Merkezi</h2>
          <p>Akıllı kurallar ve zamanlamalarla evinizi otomatikleştirin</p>
        </div>
        <div className="automation-stats">
          <div className="stat-item">
            <span className="stat-value">{Object.values(ruleStates).filter(Boolean).length}</span>
            <span className="stat-label">Aktif Kural</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">Aktif Zamanlama</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {Object.values(devices.scenes || {}).filter(s => s.active).length}
            </span>
            <span className="stat-label">Aktif Senaryo</span>
          </div>
        </div>
      </div>

      <div className="automation-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''} ${theme}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="automation-content">
        {renderActiveTab()}
      </div>

      {/* Basit Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {createType === 'rule' && '🎯 Yeni Kural Oluştur'}
                {createType === 'schedule' && '🕐 Zamanlama Ekle'}
                {createType === 'scene' && '🎪 Senaryo Oluştur'}
                {createType === 'energy' && '🔋 Enerji Tasarrufu Şablonu'}
                {createType === 'night' && '🌛 Gece Modu Şablonu'}
                {createType === 'climate' && '🌪️ İklim Kontrolü Şablonu'}
              </h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <p>Bu özellik geliştirme aşamasında!</p>
              <p>Frontend-only sürümde henüz aktif değil.</p>
              <p>Gerçek uygulamada burada form alanları olacak.</p>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={closeModal}>Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationPanel;