/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { GameState, Obstacle, Player } from '../types';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GROUND_Y = 320;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    player: { x: 50, y: GROUND_Y - 50, width: 40, height: 50, vy: 0, state: 'running', jumpCount: 0 },
    obstacles: [],
    score: 0,
    distance: 0,
    isGameOver: false,
    gameSpeed: 5,
  });

  const requestRef = useRef<number>(null);
  const stateRef = useRef(gameState);

  // Update ref whenever state changes
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  const spawnObstacle = () => {
    const type = Math.random() > 0.5 ? 'ground' : 'air';
    const newObs: Obstacle = {
      id: Math.random().toString(36).substr(2, 9),
      x: CANVAS_WIDTH,
      y: type === 'ground' ? GROUND_Y - 40 : GROUND_Y - 100,
      width: 40,
      height: type === 'ground' ? 40 : 30,
      type
    };
    return newObs;
  };

  const jump = () => {
    if (stateRef.current.isGameOver) {
      resetGame();
      return;
    }
    if (stateRef.current.player.y >= GROUND_Y - stateRef.current.player.height) {
      setGameState(prev => ({
        ...prev,
        player: { ...prev.player, vy: JUMP_FORCE, state: 'jumping' }
      }));
    }
  };

  const slide = (isSliding: boolean) => {
    if (stateRef.current.isGameOver) return;
    setGameState(prev => ({
      ...prev,
      player: { 
        ...prev.player, 
        state: isSliding ? 'sliding' : (prev.player.y < GROUND_Y - 50 ? 'jumping' : 'running'),
        height: isSliding ? 25 : 50
      }
    }));
  };

  const resetGame = () => {
    setGameState({
      player: { x: 50, y: GROUND_Y - 50, width: 40, height: 50, vy: 0, state: 'running', jumpCount: 0 },
      obstacles: [],
      score: 0,
      distance: 0,
      isGameOver: false,
      gameSpeed: 5,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        slide(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        slide(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const update = () => {
    if (stateRef.current.isGameOver) return;

    setGameState(prev => {
      // 1. Update Player
      let newVy = prev.player.vy + GRAVITY;
      let newY = prev.player.y + newVy;
      let newState = prev.player.state;

      // Ground collision
      const pHeight = prev.player.height;
      if (newY >= GROUND_Y - pHeight) {
        newY = GROUND_Y - pHeight;
        newVy = 0;
        if (newState !== 'sliding') newState = 'running';
      }

      // 2. Update Obstacles
      let newObstacles = prev.obstacles.map(obs => ({ ...obs, x: obs.x - prev.gameSpeed }));
      
      // Spawn new obstacles
      if (prev.distance % 100 === 0 && Math.random() > 0.7) {
        newObstacles.push(spawnObstacle());
      }
      
      // Remove off-screen
      newObstacles = newObstacles.filter(obs => obs.x + obs.width > -50);

      // 3. Check Collision
      const collision = newObstacles.some(obs => (
        prev.player.x < obs.x + obs.width &&
        prev.player.x + prev.player.width > obs.x &&
        newY < obs.y + obs.height &&
        newY + pHeight > obs.y
      ));

      if (collision) {
        return { ...prev, isGameOver: true };
      }

      return {
        ...prev,
        player: { ...prev.player, y: newY, vy: newVy, state: newState },
        obstacles: newObstacles,
        distance: prev.distance + 1,
        score: prev.score + (prev.distance % 10 === 0 ? 1 : 0),
        gameSpeed: 5 + Math.floor(prev.distance / 1000)
      };
    });

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Draw Function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const { player, obstacles, score, isGameOver } = stateRef.current;
      
      // Clear
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Ground
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
      ctx.stroke();
      
      // Ground Glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00ffff';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Grid lines for "speed" feel
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      const gridOffset = (stateRef.current.distance * stateRef.current.gameSpeed) % 40;
      for (let x = -gridOffset; x < CANVAS_WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, GROUND_Y);
        ctx.lineTo(x - 50, CANVAS_HEIGHT);
        ctx.stroke();
      }

      // Draw Player (Neon Box)
      ctx.fillStyle = player.state === 'sliding' ? '#ff00ff' : '#00ffff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = player.state === 'sliding' ? '#ff00ff' : '#00ffff';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.shadowBlur = 0;

      // Draw Obstacles
      obstacles.forEach(obs => {
        ctx.fillStyle = '#ff0055';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0055';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;
      });

      // UI
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`SCORE: ${score}`, 20, 40);

      if (isGameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#ff0055';
        ctx.font = 'bold 40px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
        ctx.font = '16px monospace';
        ctx.fillText('TAP JUMP TO RESTART', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 40);
        ctx.textAlign = 'left';
      }
    };

    const drawInterval = setInterval(draw, 1000/60);
    return () => clearInterval(drawInterval);
  }, []);

  return (
    <div className="flex flex-col items-center bg-[#0a0a0f] p-4 rounded-xl border border-white/10 shadow-2xl">
      <div className="relative group">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT}
          className="rounded-lg border border-[#00ffff]/30 bg-[#050508] max-w-full h-auto"
        />
        <div className="absolute top-4 right-4 flex gap-2">
            <div className="px-2 py-1 bg-[#39ff14]/20 border border-[#39ff14]/50 rounded text-[10px] text-[#39ff14] font-bold uppercase tracking-wider animate-pulse">Live Prototype</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-[400px]">
        <button 
          onMouseDown={() => slide(true)}
          onMouseUp={() => slide(false)}
          onTouchStart={() => slide(true)}
          onTouchEnd={() => slide(false)}
          className="h-16 bg-[#ff00ff]/10 border-2 border-[#ff00ff] text-[#ff00ff] font-bold rounded-xl active:bg-[#ff00ff]/30 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
        >
          <div className="w-2 h-2 bg-[#ff00ff] rounded-full shadow-[0_0_8px_#ff00ff]" />
          Slide
        </button>
        <button 
          onClick={jump}
          className="h-16 bg-[#00ffff]/10 border-2 border-[#00ffff] text-[#00ffff] font-bold rounded-xl active:bg-[#00ffff]/30 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
        >
          <div className="w-2 h-2 bg-[#00ffff] rounded-full shadow-[0_0_8px_#00ffff]" />
          Jump
        </button>
      </div>
      <p className="text-gray-500 text-[10px] mt-4 uppercase tracking-[0.2em]">Controls: Click buttons or use space to jump (keyboard support coming soon)</p>
    </div>
  );
}
