import { computed } from '@angular/core';
import { patchState, signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import {
  GameSession,
  PlayerState,
  Position,
  InventoryItem,
  SessionStatus,
} from '../models/game-session.model';

/**
 * Game session state interface
 */
export interface GameSessionState {
  session: GameSession;
  player: PlayerState;
}

/**
 * Initial game session state
 */
const initialState: GameSessionState = {
  session: {
    gameId: '',
    playerId: 'player-1', // Default player ID (will be replaced with auth later)
    status: 'idle',
    startedAt: new Date(),
  },
  player: {
    position: { x: 400, y: 300 }, // Default spawn position
    level: 1,
    experience: 0,
    health: 100,
    maxHealth: 100,
    inventory: [],
    direction: 'down',
    isMoving: false,
  },
};

/**
 * Game Session Store
 * Manages the current game session and player state
 */
export const GameSessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // Computed signals for derived state
  withComputed((state) => ({
    isSessionActive: computed(() => state.session().status === 'active'),
    isSessionPaused: computed(() => state.session().status === 'paused'),
    isSessionIdle: computed(() => state.session().status === 'idle'),
    playerLevel: computed(() => state.player().level),
    playerExperience: computed(() => state.player().experience),
    playerHealth: computed(() => state.player().health),
    playerMaxHealth: computed(() => state.player().maxHealth),
    playerPosition: computed(() => state.player().position),
    inventoryCount: computed(() => state.player().inventory.length),
    hasItems: computed(() => state.player().inventory.length > 0),
    isPlayerMoving: computed(() => state.player().isMoving),
    playerDirection: computed(() => state.player().direction),
  })),

  // Methods for state management
  withMethods((store) => ({
    /**
     * Start a new game session
     */
    startSession(gameId: string, playerId: string = 'player-1'): void {
      const now = new Date();
      patchState(store, {
        session: {
          gameId,
          playerId,
          status: 'active',
          startedAt: now,
          lastSaveAt: undefined,
          pausedAt: undefined,
          completedAt: undefined,
        },
      });
    },

    /**
     * Pause the current session
     */
    pauseSession(): void {
      patchState(store, {
        session: {
          ...store.session(),
          status: 'paused',
          pausedAt: new Date(),
        },
      });
    },

    /**
     * Resume the paused session
     */
    resumeSession(): void {
      patchState(store, {
        session: {
          ...store.session(),
          status: 'active',
          pausedAt: undefined,
        },
      });
    },

    /**
     * Complete the session
     */
    completeSession(): void {
      patchState(store, {
        session: {
          ...store.session(),
          status: 'completed',
          completedAt: new Date(),
        },
      });
    },

    /**
     * Save the session
     */
    saveSession(): void {
      patchState(store, {
        session: {
          ...store.session(),
          lastSaveAt: new Date(),
        },
      });
    },

    /**
     * Update player position
     */
    updatePlayerPosition(position: Position): void {
      patchState(store, {
        player: {
          ...store.player(),
          position,
        },
      });
    },

    /**
     * Update player direction
     */
    updatePlayerDirection(direction: 'up' | 'down' | 'left' | 'right'): void {
      patchState(store, {
        player: {
          ...store.player(),
          direction,
        },
      });
    },

    /**
     * Update player movement status
     */
    updatePlayerMovementStatus(isMoving: boolean): void {
      patchState(store, {
        player: {
          ...store.player(),
          isMoving,
        },
      });
    },

    /**
     * Add experience and handle level up
     */
    addExperience(amount: number): void {
      const currentExp = store.player().experience;
      const currentLevel = store.player().level;
      const newExp = currentExp + amount;
      const expForNextLevel = currentLevel * 100; // Simple formula: 100 XP per level

      // Check if level up
      if (newExp >= expForNextLevel) {
        patchState(store, {
          player: {
            ...store.player(),
            experience: newExp - expForNextLevel,
            level: currentLevel + 1,
            maxHealth: store.player().maxHealth + 10,
            health: store.player().maxHealth + 10, // Restore full health on level up
          },
        });
      } else {
        patchState(store, {
          player: {
            ...store.player(),
            experience: newExp,
          },
        });
      }
    },

    /**
     * Update player health
     */
    updatePlayerHealth(health: number, maxHealth?: number): void {
      const currentMaxHealth = maxHealth ?? store.player().maxHealth;
      patchState(store, {
        player: {
          ...store.player(),
          health: Math.max(0, Math.min(health, currentMaxHealth)),
          maxHealth: currentMaxHealth,
        },
      });
    },

    /**
     * Collect an item
     */
    collectItem(item: InventoryItem): void {
      const inventory = [...store.player().inventory];
      const existingItem = inventory.find((i) => i.id === item.id);

      if (existingItem) {
        // Increase quantity if item already exists
        existingItem.quantity += item.quantity;
      } else {
        // Add new item
        inventory.push(item);
      }

      patchState(store, {
        player: {
          ...store.player(),
          inventory,
        },
      });
    },

    /**
     * Use an item (decreases quantity)
     */
    useItem(itemId: string): void {
      const inventory = [...store.player().inventory];
      const itemIndex = inventory.findIndex((i) => i.id === itemId);

      if (itemIndex !== -1) {
        inventory[itemIndex].quantity -= 1;
        // Remove item if quantity reaches 0
        if (inventory[itemIndex].quantity <= 0) {
          inventory.splice(itemIndex, 1);
        }
      }

      patchState(store, {
        player: {
          ...store.player(),
          inventory,
        },
      });
    },

    /**
     * Remove an item completely
     */
    removeItem(itemId: string): void {
      const inventory = store.player().inventory.filter((i) => i.id !== itemId);

      patchState(store, {
        player: {
          ...store.player(),
          inventory,
        },
      });
    },

    /**
     * Reset session to initial state
     */
    resetSession(): void {
      patchState(store, initialState);
    },
  }))
);
