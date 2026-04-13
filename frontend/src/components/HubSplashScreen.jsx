import { useState, useEffect } from 'react';

export default function HubSplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500); // 2.5s animation + 1s fade
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const letters = [
    { char: 'K', color: '#FF595E', delay: '0s' },
    { char: 'i', color: '#FFCA3A', delay: '0.1s' },
    { char: 'n', color: '#8AC926', delay: '0.2s' },
    { char: 'd', color: '#1982C4', delay: '0.3s' },
    { char: 'd', color: '#6A4C93', delay: '0.4s' },
    { char: 'o', color: '#FF924C', delay: '0.5s' },
  ];

  return (
    <div className="hub-splash">
      <div className="splash-logo">
        {letters.map((l, i) => (
          <span 
            key={i} 
            className="splash-letter" 
            style={{ color: l.color, animationDelay: l.delay }}
          >
            {l.char}
          </span>
        ))}
      </div>
      <div 
        className="text-vibrant" 
        style={{ marginTop: 24, fontSize: 18, letterSpacing: 4, opacity: 0.7, animation: 'fadeIn 2s ease' }}
      >
        EL HUB ESCOLAR VIBRANTE
      </div>
    </div>
  );
}
