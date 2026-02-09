import { computed, inject } from '@angular/core';
import { patchState, signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { Events, Dispatcher, withEventHandlers } from '@ngrx/signals/events';
import { tap } from 'rxjs';
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

  // Event handlers - React to events using reactive streams
  withEventHandlers((store, events = inject(Events)) => ({
    // Session lifecycle handlers
    onSessionStarted$: events.on(gameSessionEvents.sessionStarted).pipe(
      tap(({ payload }) => {
        const now = new Date();
        patchState(store, {
          session: {
            gameId: payload.gameId,
            playerId: payload.playerId,
            status: 'active',
            startedAt: now,
            lastSaveAt: undefined,
            pausedAt: undefined,
            completedAt: undefined,
          },
        });
      })
    ),

    onSessionPaused$: events.on(gameSessionEvents.sessionPaused).pipe(
      tap(() => {
        patchState(store, {
          session: {
            ...store.session(),
            status: 'paused',
            pausedAt: new Date(),
          },
        });
      })
    ),

    onSessionResumed$: events.on(gameSessionEvents.sessionResumed).pipe(
      tap(() => {
        patchState(store, {
          session: {
            ...store.session(),
            status: 'active',
            pausedAt: undefined,
          },
        });
      })
    ),

    onSessionCompleted$: events.on(gameSessionEvents.sessionCompleted).pipe(
      tap(() => {
        patchState(store, {
          session: {
            ...store.session(),
            status: 'completed',
            completedAt: new Date(),
          },
        });
      })
    ),

    onSessionSaved$: events.on(gameSessionEvents.sessionSaved).pipe(
      tap(() => {
        patchState(store, {
          session: {
            ...store.session(),
            lastSaveAt: new Date(),
          },
        });
      })
    ),

    // Player state handlers
    onPlayerMoved$: events.on(gameSessionEvents.playerMoved).pipe(
      tap(({ payload }) => {
        patchState(store, {
          player: {
            ...store.player(),
            position: payload,
          },
        });
      })
    ),

    onPlayerDirectionChanged$: events.on(gameSessionEvents.playerDirectionChanged).pipe(
      tap(({ payload }) => {
        patchState(store, {
          player: {
            ...store.player(),
            direction: payload,
          },
        });
      })
    ),

    onPlayerMovementStatusChanged$: events.on(gameSessionEvents.playerMovementStatusChanged).pipe(
      tap(({ payload }) => {
        patchState(store, {
          player: {
            ...store.player(),
            isMoving: payload,
          },
        });
      })
    ),

    // Player stats handlers
    onExperienceGained$: events.on(gameSessionEvents.experienceGained).pipe(
      tap(({ payload }) => {
        const currentExp = store.player().experience;
        const currentLevel = store.player().level;
        const newExp = currentExp + payload;
        const expForNextLevel = currentLevel * 100;

        if (newExp >= expForNextLevel) {
          patchState(store, {
            player: {
              ...store.player(),
              experience: newExp - expForNextLevel,
              level: currentLevel + 1,
              maxHealth: store.player().maxHealth + 10,
              health: store.player().maxHealth + 10,
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
      })
    ),

    onLevelUp$: events.on(gameSessionEvents.levelUp).pipe(
      tap(({ payload }) => {
        patchState(store, {
          player: {
            ...store.player(),
            level: payload,
            maxHealth: store.player().maxHealth + 10,
            health: store.player().maxHealth + 10,
          },
        });
      })
    ),

    onHealthChanged$: events.on(gameSessionEvents.healthChanged).pipe(
      tap(({ payload }) => {
        patchState(store, {
          player: {
            ...store.player(),
            health: Math.max(0, Math.min(payload.current, payload.max)),
            maxHealth: payload.max,
          },
        });
      })
    ),

    // Inventory handlers
    onItemCollected$: events.on(gameSessionEvents.itemCollected).pipe(
      tap(({ payload }) => {
        const inventory = [...store.player().inventory];
        const existingItem = inventory.find((i) => i.id === payload.id);

        if (existingItem) {
          existingItem.quantity += payload.quantity;
        } else {
          inventory.push(payload);
        }

        patchState(store, {
          player: {
            ...store.player(),
            inventory,
          },
        });
      })
    ),

    onItemUsed$: events.on(gameSessionEvents.itemUsed).pipe(
      tap(({ payload }) => {
        const inventory = [...store.player().inventory];
        const itemIndex = inventory.findIndex((i) => i.id === payload);

        if (itemIndex !== -1) {
          inventory[itemIndex].quantity -= 1;
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
      })
    ),

    onItemRemoved$: events.on(gameSessionEvents.itemRemoved).pipe(
      tap(({ payload }) => {
        const inventory = store.player().inventory.filter((i) => i.id !== payload);

        patchState(store, {
          player: {
            ...store.player(),
            inventory,
          },
        });
      })
    ),
  })),

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
