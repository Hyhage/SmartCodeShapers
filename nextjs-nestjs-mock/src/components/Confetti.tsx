"use client";

import React, { useEffect, useState } from "react";

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ active, duration = 5000 }) => {
  const [pieces, setPieces] = useState<
    Array<{ id: number; style: React.CSSProperties }>
  >([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `-10%`,
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`,
          backgroundColor: getRandomColor(),
          transform: `rotate(${Math.random() * 360}deg)`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 2}s`,
        },
      }));

      setPieces(newPieces);
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  if (!show) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute rounded-sm animate-confetti"
          style={piece.style}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            top: -10%;
            transform: translateX(0) rotate(0deg);
          }
          100% {
            top: 100%;
            transform: translateX(${Math.random() > 0.5 ? "20px" : "-20px"})
              rotate(${Math.random() * 360}deg);
          }
        }
        .animate-confetti {
          animation: confetti-fall 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

const getRandomColor = (): string => {
  const colors = [
    "#FF5722", // Accent primary
    "#FF9E80", // Accent secondary
    "#0EA5E9", // Accent tertiary
    "#38BDF8", // Light blue
    "#4CAF50", // Green
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default Confetti;
