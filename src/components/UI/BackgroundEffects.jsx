import React from 'react';
import './BackgroundEffects.css';

const BackgroundEffects = ({ theme }) => {
  const particleCount = 25;
  
  return (
    <div className="background-effects">
      <div className={`gradient-background ${theme}`} />
      
      <div className="floating-particles">
        {[...Array(particleCount)].map((_, i) => (
          <div
            key={i}
            className={`particle ${theme}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      <div className="geometric-shapes">
        <div className={`shape shape-1 ${theme}`} />
        <div className={`shape shape-2 ${theme}`} />
        <div className={`shape shape-3 ${theme}`} />
        <div className={`shape shape-4 ${theme}`} />
      </div>
      
      <div className="wave-animation">
        <div className={`wave wave-1 ${theme}`} />
        <div className={`wave wave-2 ${theme}`} />
        <div className={`wave wave-3 ${theme}`} />
      </div>
    </div>
  );
};

export default BackgroundEffects;