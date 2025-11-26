import { Injectable, signal, inject } from '@angular/core';
import { GameDataLoaderService } from './game-data-loader.service';
import { DialogData } from '../models/game-data.models';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private readonly dataLoader = inject(GameDataLoaderService);

  // UI signals
  readonly isDialogOpen = signal(false);
  readonly currentDialog = signal<DialogData | null>(null);

  /**
   * Show dialog for NPC (synchronous access to preloaded data)
   */
  showDialogForNpc(npcId: string): void {
    const dialogs = this.dataLoader.getDialogsByNpcId(npcId);

    if (dialogs.length > 0) {
      // Pick random dialog or first one
      const dialog = dialogs[Math.floor(Math.random() * dialogs.length)];
      this.currentDialog.set(dialog);
      this.isDialogOpen.set(true);
      console.log(`💬 Showing dialog for NPC ${npcId}:`, dialog.message);
    } else {
      console.warn(`No dialogs found for NPC: ${npcId}`);
    }
  }

  /**
   * Show specific dialog by ID
   */
  showDialogById(dialogId: string): void {
    const dialog = this.dataLoader.getDialogById(dialogId);

    if (dialog) {
      this.currentDialog.set(dialog);
      this.isDialogOpen.set(true);
      console.log(`💬 Showing dialog ${dialogId}:`, dialog.message);
    } else {
      console.warn(`Dialog not found: ${dialogId}`);
    }
  }

  /**
   * Close current dialog
   */
  closeDialog(): void {
    this.isDialogOpen.set(false);
    this.currentDialog.set(null);
    console.log('💬 Dialog closed');
  }
}
