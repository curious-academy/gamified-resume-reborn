import { DialogService } from "../../../core/services/dialog.service";
import { GameDataLoaderService } from "../../../core/services/game-data-loader.service";
import { TerminalService } from "../../../core/services/terminal.service";
import { MapConfig } from "../entities/game-config.entity";

/**
 * Configuration de la scène incluant les services Angular
 */
export interface GameSceneConfig extends MapConfig {
  terminalService?: TerminalService;
  dialogService?: DialogService;
  gameDataLoader?: GameDataLoaderService;
}
