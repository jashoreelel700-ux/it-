/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Gamepad } from 'lucide-react';
import Game from './components/Game';
import GDD from './components/GDD';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col md:flex-row overflow-hidden selection:bg-[#00ffff] selection:text-black">
      {/* Left Side: Game Prototype */}
      <main className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center relative overflow-y-auto">
        {/* Neon Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#ff00ff] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00ffff] rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 w-full max-w-4xl flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 mb-2"
          >
            <div className="bg-[#00ffff] p-2 rounded shadow-[0_0_15px_#00ffff]">
              <Gamepad className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Neon Runner</h1>
              <p className="text-[10px] text-[#00ffff] uppercase tracking-[0.3em] font-bold">Prototype V1.0</p>
            </div>
          </motion.div>

          <Game />

          <div className="grid grid-cols-3 gap-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            <div className="border border-white/5 p-3 rounded bg-white/5">
              <span className="text-[#00ffff] block mb-1">FPS</span>
              60.00
            </div>
            <div className="border border-white/5 p-3 rounded bg-white/5">
              <span className="text-[#ff00ff] block mb-1">Version</span>
              Alpha 0.1
            </div>
            <div className="border border-white/5 p-3 rounded bg-white/5">
              <span className="text-[#39ff14] block mb-1">Status</span>
              Operational
            </div>
          </div>
        </div>
      </main>

      {/* Right Side: GDD */}
      <aside className="w-full md:w-[450px] lg:w-[550px] border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-20">
        <GDD />
      </aside>
    </div>
  );
}
