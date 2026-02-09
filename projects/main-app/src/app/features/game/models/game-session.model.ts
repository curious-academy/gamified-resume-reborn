/**
 * Game Session Models
 * Interfaces for managing the current game session and player state
 */

export type SessionStatus = 'idle' | 'active' | 'paused' | 'completed';

/**
 * Position in 2D space
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Player state synchronized with the game
 */
export interface PlayerState {
  position: Position;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  inventory: InventoryItem[];
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
}

/**
 * Inventory item
 */
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  type: 'weapon' | 'armor' | 'consumable' | 'key' | 'quest';
}

/**
 * Game session information
 */
export interface GameSession {
  gameId: string;
  playerId: string;
  status: SessionStatus;
  startedAt: Date;
  lastSaveAt?: Date;
  pausedAt?: Date;
  completedAt?: Date;
}

/**
 * Complete game session state
 */
export interface GameSessionState {
  session: GameSession;
  player: PlayerState;
}
