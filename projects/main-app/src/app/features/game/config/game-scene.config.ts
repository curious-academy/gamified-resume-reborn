import { Dispatcher } from '@ngrx/signals/events';
import { DialogService } from "../../../core/services/dialog.service";
import { GameDataLoaderService } from "../../../core/services/game-data-loader.service";
import { TerminalService } from "../../../core/services/terminal.service";
import { MapConfig } from "../entities/game-config.entity";
import type { GameSessionStore } from '../store';
import type { gameSessionEvents } from '../store/game-session.events';

/**
 * Configuration de la scène incluant les services Angular
 */
export interface GameSceneConfig extends MapConfig {
  terminalService?: TerminalService;
  dialogService?: DialogService;
  gameDataLoader?: GameDataLoaderService;
  gameSessionStore?: InstanceType<typeof GameSessionStore>;
  dispatcher?: Dispatcher;
  gameEvents?: typeof gameSessionEvents;
}
