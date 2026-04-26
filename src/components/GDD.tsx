/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Book, Cpu, Gamepad2, Layers, Rocket, Zap } from 'lucide-react';

export default function GDD() {
  return (
    <div className="bg-[#0a0a0f] text-gray-300 p-8 font-sans overflow-y-auto h-full border-l border-white/10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Book className="text-[#00ffff] w-8 h-8" />
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase italic">Game Design Document</h1>
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="text-[#ff00ff] w-5 h-5" />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. Core Mechanics</h2>
          </div>
          <div className="space-y-4 border-l-2 border-[#ff00ff]/30 pl-4 py-2">
            <div>
              <h3 className="text-[#ff00ff] font-bold">One-Touch Controls</h3>
              <p>Designed for mobile screens. Tap the left side to Slide, Tap the right side to Jump.</p>
            </div>
            <div>
              <h3 className="text-[#ff00ff] font-bold">Jumping (Verticality)</h3>
              <p>Player can jump to clear floor obstacles. Holding the jump button results in a higher arcade-style jump.</p>
            </div>
            <div>
              <h3 className="text-[#ff00ff] font-bold">Sliding (Duck)</h3>
              <p>Player can slide under high-flying obstacles. Sliding also increases friction slightly, allowing for tactical speed control.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-[#00ffff] w-5 h-5" />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. Aesthetic: Neon-Pixel</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-sm">
              <span className="block text-[#00ffff] font-bold mb-1">Color Palette</span>
              Cyberpunk Pink (#ff00ff), Electric Blue (#00ffff), Dark Obsidian (#0a0a0f), and Acid Green (#39ff14).
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-sm">
              <span className="block text-[#00ffff] font-bold mb-1">Visual Effects</span>
              Bloom/Glow on all active sprites. Parallax scrolling for the neon cityscape background.
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="text-[#39ff14] w-5 h-5" />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. Progression System</h2>
          </div>
          <ul className="space-y-3 list-disc list-inside text-sm">
            <li><span className="text-[#39ff14] font-bold">Currency:</span> Neon Shards collected during runs.</li>
            <li><span className="text-[#39ff14] font-bold">Upgrades:</span> Dash boots (shorter jump cooldown), Ghost Suit (temporary invincibility).</li>
            <li><span className="text-[#39ff14] font-bold">Dynamic Difficulty:</span> The world speed increases by 5% every 500m reached.</li>
          </ul>
        </section>

        <section className="mb-12 bg-[#39ff14]/5 border border-[#39ff14]/20 p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="text-[#39ff14] w-5 h-5" />
            <h2 className="text-xl font-bold text-[#39ff14] uppercase tracking-wider underline decoration-wavy">Engine Recommendation</h2>
          </div>
          <p className="mb-4 font-medium italic">For a beginner, the absolute best choice is:</p>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Construct 3</h3>
            <p className="text-sm">A browser-based engine that uses visual "event sheets" instead of raw coding. It's perfectly optimized for 2D mobile games and has one-click export for Android/iOS.</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#39ff14] mb-2 uppercase">Alternative for Coders:</h4>
            <p className="text-sm"><span className="text-white font-bold">Godot (GDScript):</span> Completely free, lightweight, and uses a Python-like language that is very beginner-friendly.</p>
          </div>
        </section>

        <section className="mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="text-orange-500 w-5 h-5" />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Basic Code Logic (JavaScript/Phaser)</h2>
          </div>
          <pre className="bg-gray-900 p-4 rounded-lg text-xs overflow-x-auto border border-white/5 text-[#00ffff]">
{`// Character Movement Logic
update() {
  // Jump logic
  if (jumpKey.isDown && player.body.onFloor()) {
    player.setVelocityY(-500);
    player.play('jump_anim');
  }

  // Slide logic
  if (slideKey.isDown && player.body.onFloor()) {
    player.setSize(32, 16); // Half height
    player.play('slide_anim');
  } else {
    player.setSize(32, 32); // Reset height
  }
}`}
          </pre>
        </section>
      </motion.div>
    </div>
  );
}
