import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, tap } from 'rxjs';
import { GameData, DialogData, NpcData, ItemData } from '../models/game-data.models';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

@Injectable({
  providedIn: 'root'
})
export class GameDataLoaderService {
  private readonly apiUrl = 'http://localhost:5000/api/game-data';

  // State management
  readonly loadingState = signal<LoadingState>('idle');
  readonly loadingProgress = signal<number>(0);
  readonly errorMessage = signal<string | null>(null);

  // Data caches (Map for O(1) access)
  private dialogsMap = new Map<string, DialogData>();
  private npcsMap = new Map<string, NpcData>();
  private itemsMap = new Map<string, ItemData>();

  // Metadata
  private loadedAt: Date | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Load all game data - Called by LoadingScreenComponent
   */
  loadGameData(): Observable<GameData> {
    // If already loaded, return immediately
    if (this.loadingState() === 'success') {
      console.log('✅ Game data already loaded, skipping...');
      return of(this.getCurrentGameData());
    }

    this.loadingState.set('loading');
    this.loadingProgress.set(0);
    this.errorMessage.set(null);

    // Load from single endpoint
    return this.http.get<GameData>(`${this.apiUrl}/all`).pipe(
      tap((data) => {
        this.cacheAllData(data);
        this.loadingProgress.set(100);
        this.loadingState.set('success');
        this.loadedAt = new Date();
        console.log('✅ Game data loaded successfully:', {
          dialogs: data.dialogs.length,
          npcs: data.npcs.length,
          items: data.items?.length || 0
        });
      }),
      catchError((error) => {
        console.error('❌ Failed to load game data:', error);
        this.loadingState.set('error');
        this.errorMessage.set(error.message || 'Failed to load game data');
        // Fallback to mock data for development
        const mockData = this.getMockGameData();
        this.cacheAllData(mockData);
        this.loadingState.set('success'); // Set success for dev mode
        return of(mockData);
      })
    );
  }

  /**
   * Cache all data in Maps
   */
  private cacheAllData(data: GameData): void {
    // Dialogs
    this.dialogsMap.clear();
    data.dialogs.forEach(dialog => {
      this.dialogsMap.set(dialog.id, dialog);
    });

    // NPCs
    this.npcsMap.clear();
    data.npcs.forEach(npc => {
      this.npcsMap.set(npc.id, npc);
    });

    // Items
    if (data.items) {
      this.itemsMap.clear();
      data.items.forEach(item => {
        this.itemsMap.set(item.id, item);
      });
    }
  }

  /**
   * Get current game data from cache
   */
  private getCurrentGameData(): GameData {
    return {
      dialogs: Array.from(this.dialogsMap.values()),
      npcs: Array.from(this.npcsMap.values()),
      items: Array.from(this.itemsMap.values()),
      loadedAt: this.loadedAt || new Date()
    };
  }

  /**
   * Mock game data for development without backend
   */
  private getMockGameData(): GameData {
    console.log('⚠️ Using mock game data (backend not available)');
    return {
      dialogs: [
        {
          id: 'dialog-1',
          npcId: 'npc-1',
          npcName: 'PNJ Mystérieux',
          message: 'Bonjour voyageur ! Bienvenue dans ce monde étrange... Je suis ici pour te guider dans ton aventure.'
        },
        {
          id: 'dialog-2',
          npcId: 'npc-1',
          npcName: 'PNJ Mystérieux',
          message: 'As-tu exploré les environs ? Il y a beaucoup de secrets cachés dans ce monde.'
        },
        {
          id: 'dialog-3',
          npcId: 'npc-2',
          npcName: 'Marchand',
          message: 'Bienvenue dans ma boutique ! Que puis-je faire pour toi ?'
        }
      ],
      npcs: [
        {
          id: 'npc-1',
          name: 'PNJ Mystérieux',
          color: '#ff8c00',
          spawnX: 400,
          spawnY: 300,
          dialogIds: ['dialog-1', 'dialog-2']
        },
        {
          id: 'npc-2',
          name: 'Marchand',
          color: '#9400d3',
          spawnX: 200,
          spawnY: 400,
          dialogIds: ['dialog-3']
        }
      ],
      items: [],
      loadedAt: new Date()
    };
  }

  // === SYNCHRONOUS GETTERS (Instant access during gameplay) ===

  getDialogById(id: string): DialogData | undefined {
    return this.dialogsMap.get(id);
  }

  getDialogsByNpcId(npcId: string): DialogData[] {
    return Array.from(this.dialogsMap.values())
      .filter(dialog => dialog.npcId === npcId);
  }

  getNpcById(id: string): NpcData | undefined {
    return this.npcsMap.get(id);
  }

  getAllNpcs(): NpcData[] {
    return Array.from(this.npcsMap.values());
  }

  getItemById(id: string): ItemData | undefined {
    return this.itemsMap.get(id);
  }

  getAllDialogs(): DialogData[] {
    return Array.from(this.dialogsMap.values());
  }

  // === UTILITIES ===

  isDataLoaded(): boolean {
    return this.loadingState() === 'success';
  }

  getLoadedAt(): Date | null {
    return this.loadedAt;
  }

  /**
   * Reset loading state (optional, for new game)
   */
  reset(): void {
    this.loadingState.set('idle');
    this.loadingProgress.set(0);
    this.errorMessage.set(null);
    // Keep cache to avoid reloading if starting another game
  }
}
