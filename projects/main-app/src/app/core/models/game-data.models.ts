/**
 * Game Data Models
 * Interfaces for all game data loaded from the backend
 */

export interface DialogData {
  id: string;
  npcId: string;
  npcName: string;
  message: string;
  choices?: string[];
  nextDialogId?: string;
}

export interface NpcData {
  id: string;
  name: string;
  color: string; // Hex color (e.g., "#ff8c00")
  spawnX?: number;
  spawnY?: number;
  dialogIds: string[];
}

export interface ItemData {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'consumable';
}

export interface GameData {
  dialogs: DialogData[];
  npcs: NpcData[];
  items?: ItemData[];
  loadedAt: Date;
}
