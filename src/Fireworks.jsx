import { useState, useEffect } from 'react';

const Firework = ({ x, y, color }) => {
  return (
    <div 
      className="absolute w-2 h-2 rounded-full"
      style={{
        left: x,
        top: y,
        background: color,
        animation: 'explode 1s forwards',
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`
      }}
    >
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: color,
            transform: `rotate(${i * 30}deg)`,
            animation: 'particle 1s forwards',
            boxShadow: `0 0 5px ${color}`,
          }}
        />
      ))}
    </div>
  );
};

const FireworksContainer = ({ isActive, onComplete }) => {
  const [fireworks, setFireworks] = useState([]);
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  useEffect(() => {
    if (!isActive) return;
    
    let count = 0;
    const maxFireworks = 5;
    const interval = setInterval(() => {
      if (count >= maxFireworks) {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
        return;
      }

      const newFirework = {
        id: Date.now() + count,
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight / 2),
        color: colors[Math.floor(Math.random() * colors.length)]
      };

      setFireworks(prev => [...prev, newFirework]);
      count++;
    }, 200);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    const cleanup = setTimeout(() => {
      setFireworks([]);
    }, 2000);

    return () => clearTimeout(cleanup);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none">
      <style>
        {`
          @keyframes explode {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }
          @keyframes particle {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(var(--x, 50px), var(--y, 50px));
              opacity: 0;
            }
          }
        `}
      </style>
      {fireworks.map(fw => (
        <Firework key={fw.id} {...fw} />
      ))}
    </div>
  );
};

export default FireworksContainer;