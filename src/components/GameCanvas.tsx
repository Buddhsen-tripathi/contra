'use client';

import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/engine/GameEngine';

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Game Engine
    engineRef.current = new GameEngine(canvasRef.current);
    engineRef.current.start();

    // Cleanup on unmount
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-900">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-4 border-gray-700 bg-black shadow-2xl image-pixelated"
        style={{
          imageRendering: 'pixelated', // Ensure crisp pixel art
          maxWidth: '100%',
          maxHeight: '100%',
          aspectRatio: '4/3'
        }}
      />
    </div>
  );
};

export default GameCanvas;
