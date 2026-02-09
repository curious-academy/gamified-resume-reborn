import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { Dispatcher, on, withReducer } from '@ngrx/signals/events';
import {
  GameSession,
  PlayerState,
  Position,
  InventoryItem,
} from '../models/game-session.model';
import { gameSessionEvents } from './game-session.events';

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
 * Manages the current game session and player state using event-driven architecture
 */
export const GameSessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // Computed signals for derived state
  withComputed(({ session, player }) => ({
    isSessionActive: computed(() => session().status === 'active'),
    isSessionPaused: computed(() => session().status === 'paused'),
    isSessionIdle: computed(() => session().status === 'idle'),
    playerLevel: computed(() => player().level),
    playerExperience: computed(() => player().experience),
    playerHealth: computed(() => player().health),
    playerMaxHealth: computed(() => player().maxHealth),
    playerPosition: computed(() => player().position),
    inventoryCount: computed(() => player().inventory.length),
    hasItems: computed(() => player().inventory.length > 0),
    isPlayerMoving: computed(() => player().isMoving),
    playerDirection: computed(() => player().direction),
  })),

  // State transitions - React to events and update state
  withReducer(
    // Session lifecycle
    on(gameSessionEvents.sessionStarted, ({ payload }) => {
      const now = new Date();
      return {
        session: {
          gameId: payload.gameId,
          playerId: payload.playerId,
          status: 'active' as const,
          startedAt: now,
          lastSaveAt: undefined,
          pausedAt: undefined,
          completedAt: undefined,
        },
      };
    }),

    on(gameSessionEvents.sessionPaused, (_, state) => ({
      session: {
        ...state.session,
        status: 'paused' as const,
        pausedAt: new Date(),
      },
    })),

    on(gameSessionEvents.sessionResumed, (_, state) => ({
      session: {
        ...state.session,
        status: 'active' as const,
        pausedAt: undefined,
      },
    })),

    on(gameSessionEvents.sessionCompleted, (_, state) => ({
      session: {
        ...state.session,
        status: 'completed' as const,
        completedAt: new Date(),
      },
    })),

    on(gameSessionEvents.sessionSaved, (_, state) => ({
      session: {
        ...state.session,
        lastSaveAt: new Date(),
      },
    })),

    // Player state
    on(gameSessionEvents.playerMoved, ({ payload }, state) => ({
      player: {
        ...state.player,
        position: payload,
      },
    })),

    on(gameSessionEvents.playerDirectionChanged, ({ payload }, state) => ({
      player: {
        ...state.player,
        direction: payload,
      },
    })),

    on(gameSessionEvents.playerMovementStatusChanged, ({ payload }, state) => ({
      player: {
        ...state.player,
        isMoving: payload,
      },
    })),

    // Player stats
    on(gameSessionEvents.experienceGained, ({ payload }, state) => {
      const currentExp = state.player.experience;
      const currentLevel = state.player.level;
      const newExp = currentExp + payload;
      const expForNextLevel = currentLevel * 100;

      if (newExp >= expForNextLevel) {
        const newMaxHealth = state.player.maxHealth + 10;
        return {
          player: {
            ...state.player,
            experience: newExp - expForNextLevel,
            level: currentLevel + 1,
            maxHealth: newMaxHealth,
            health: newMaxHealth,
          },
        };
      } else {
        return {
          player: {
            ...state.player,
            experience: newExp,
          },
        };
      }
    }),

    on(gameSessionEvents.levelUp, ({ payload }, state) => {
      const newMaxHealth = state.player.maxHealth + 10;
      return {
        player: {
          ...state.player,
          level: payload,
          maxHealth: newMaxHealth,
          health: newMaxHealth,
        },
      };
    }),

    on(gameSessionEvents.healthChanged, ({ payload }, state) => ({
      player: {
        ...state.player,
        health: Math.max(0, Math.min(payload.current, payload.max)),
        maxHealth: payload.max,
      },
    })),

    // Inventory
    on(gameSessionEvents.itemCollected, ({ payload }, state) => {
      const inventory = [...state.player.inventory];
      const existingItem = inventory.find((i) => i.id === payload.id);

      if (existingItem) {
        existingItem.quantity += payload.quantity;
      } else {
        inventory.push(payload);
      }

      return {
        player: {
          ...state.player,
          inventory,
        },
      };
    }),

    on(gameSessionEvents.itemUsed, ({ payload }, state) => {
      const inventory = [...state.player.inventory];
      const itemIndex = inventory.findIndex((i) => i.id === payload);

      if (itemIndex !== -1) {
        inventory[itemIndex].quantity -= 1;
        if (inventory[itemIndex].quantity <= 0) {
          inventory.splice(itemIndex, 1);
        }
      }

      return {
        player: {
          ...state.player,
          inventory,
        },
      };
    }),

    on(gameSessionEvents.itemRemoved, ({ payload }, state) => {
      const inventory = state.player.inventory.filter((i) => i.id !== payload);

      return {
        player: {
          ...state.player,
          inventory,
        },
      };
    })
  ),

  // Public methods to dispatch events (components call these)
  withMethods((store, dispatcher = inject(Dispatcher)) => ({
    /**
     * Start a new game session
     */
    startSession(gameId: string, playerId: string = 'player-1'): void {
      dispatcher.dispatch(gameSessionEvents.sessionStarted({ gameId, playerId }));
    },

    /**
     * Pause the current session
     */
    pauseSession(): void {
      dispatcher.dispatch(gameSessionEvents.sessionPaused());
    },

    /**
     * Resume the paused session
     */
    resumeSession(): void {
      dispatcher.dispatch(gameSessionEvents.sessionResumed());
    },

    /**
     * Complete the session
     */
    completeSession(): void {
      dispatcher.dispatch(gameSessionEvents.sessionCompleted());
    },

    /**
     * Save the session
     */
    saveSession(): void {
      dispatcher.dispatch(gameSessionEvents.sessionSaved());
    },

    /**
     * Update player position
     */
    updatePlayerPosition(position: Position): void {
      dispatcher.dispatch(gameSessionEvents.playerMoved(position));
    },

    /**
     * Update player direction
     */
    updatePlayerDirection(direction: 'up' | 'down' | 'left' | 'right'): void {
      dispatcher.dispatch(gameSessionEvents.playerDirectionChanged(direction));
    },

    /**
     * Update player movement status
     */
    updatePlayerMovementStatus(isMoving: boolean): void {
      dispatcher.dispatch(gameSessionEvents.playerMovementStatusChanged(isMoving));
    },

    /**
     * Add experience
     */
    addExperience(amount: number): void {
      dispatcher.dispatch(gameSessionEvents.experienceGained(amount));
    },

    /**
     * Level up the player
     */
    levelUp(newLevel: number): void {
      dispatcher.dispatch(gameSessionEvents.levelUp(newLevel));
    },

    /**
     * Update player health
     */
    updatePlayerHealth(health: number, maxHealth: number): void {
      dispatcher.dispatch(gameSessionEvents.healthChanged({ current: health, max: maxHealth }));
    },

    /**
     * Collect an item
     */
    collectItem(item: InventoryItem): void {
      dispatcher.dispatch(gameSessionEvents.itemCollected(item));
    },

    /**
     * Use an item (decreases quantity)
     */
    useItem(itemId: string): void {
      dispatcher.dispatch(gameSessionEvents.itemUsed(itemId));
    },

    /**
     * Remove an item completely
     */
    removeItem(itemId: string): void {
      dispatcher.dispatch(gameSessionEvents.itemRemoved(itemId));
    },
  }))
);
