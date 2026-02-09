import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { Position, InventoryItem } from '../models/game-session.model';

/**
 * Game session events
 */
export const gameSessionEvents = eventGroup({
  source: 'Game Session',
  events: {
    // Session lifecycle
    sessionStarted: type<{ gameId: string; playerId: string }>(),
    sessionPaused: type<void>(),
    sessionResumed: type<void>(),
    sessionCompleted: type<void>(),
    sessionSaved: type<void>(),

    // Player movement
    playerMoved: type<Position>(),
    playerDirectionChanged: type<'up' | 'down' | 'left' | 'right'>(),
    playerMovementStatusChanged: type<boolean>(),

    // Player stats
    experienceGained: type<number>(),
    levelUp: type<number>(),
    healthChanged: type<{ current: number; max: number }>(),

    // Inventory
    itemCollected: type<InventoryItem>(),
    itemUsed: type<string>(),
    itemRemoved: type<string>(),
  },
});

/**
 * Game session API events (for future backend integration)
 */
export const gameSessionApiEvents = eventGroup({
  source: 'Game Session API',
  events: {
    sessionLoadSuccess: type<{ gameId: string; playerId: string }>(),
    sessionLoadFailure: type<{ error: string }>(),
    sessionSaveSuccess: type<void>(),
    sessionSaveFailure: type<{ error: string }>(),
  },
});
