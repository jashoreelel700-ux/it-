/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GameState {
  player: Player;
  obstacles: Obstacle[];
  score: number;
  distance: number;
  isGameOver: boolean;
  gameSpeed: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  state: 'running' | 'jumping' | 'sliding';
  jumpCount: number;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'air';
}
