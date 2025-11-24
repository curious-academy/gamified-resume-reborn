import { Component, signal, OnInit, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrainingService } from '../services';
import { Quest, CreateQuestDto, CreateObjectiveDto, Video } from '../models';
import { VideoInputComponent } from './video-input.component';

/**
 * Component for managing training details with quests and objectives
 */
@Component({
  selector: 'app-training-detail',
  imports: [FormsModule, VideoInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="training-detail">
      @if (training(); as training) {
        <div class="header">
          <div class="header-content">
            <button class="btn-back" (click)="onBack()">← Retour</button>
            <div>
              <h1>{{ training.title }}</h1>
              <div [innerHTML]="training.description"></div>
            </div>
          </div>
          <button class="btn-primary" (click)="onAddQuest()">
            + Ajouter une Quête
          </button>
        </div>

        <div class="progress-section">
          <div class="progress-info">
            <span class="progress-label">Progression globale</span>
            <span class="progress-value">{{ progress() }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progress()"></div>
          </div>
          <div class="points-info">
            {{ training.earnedPoints }} / {{ training.totalPoints }} points
          </div>
        </div>

        @if (showQuestForm()) {
          <div class="quest-form">
            <h3>{{ editingQuest() ? 'Modifier la quête' : 'Nouvelle quête' }}</h3>
            <form (ngSubmit)="onSubmitQuest()">
              <div class="form-group">
                <label for="questTitle">Titre *</label>
                <input
                  id="questTitle"
                  type="text"
                  [(ngModel)]="questFormData.title"
                  name="questTitle"
                  required
                />
              </div>

              <div class="form-group">
                <label for="questDescription">Description *</label>
                <textarea
                  id="questDescription"
                  [(ngModel)]="questFormData.description"
                  name="questDescription"
                  required
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="questOrder">Ordre</label>
                <input
                  id="questOrder"
                  type="number"
                  [(ngModel)]="questFormData.order"
                  name="questOrder"
                  min="1"
                />
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" (click)="onCancelQuest()">
                  Annuler
                </button>
                <button type="submit" class="btn-primary">
                  {{ editingQuest() ? 'Modifier' : 'Créer' }}
                </button>
              </div>
            </form>
          </div>
        }

        <div class="quests-list">
          @for (quest of sortedQuests(); track quest.id) {
            <div class="quest-card" [class.completed]="quest.isCompleted">
              <div class="quest-header">
                <div class="quest-title-section">
                  <span class="quest-order">Quête {{ quest.order }}</span>
                  <h3>{{ quest.title }}</h3>
                  @if (quest.isCompleted) {
                    <span class="badge badge-success">✓ Complétée</span>
                  }
                </div>
                <div class="quest-actions">
                  <button class="btn-icon" (click)="onEditQuest(quest)">✏️</button>
                  <button class="btn-icon" (click)="onDeleteQuest(quest.id)">🗑️</button>
                  <button class="btn-icon" (click)="toggleQuestExpanded(quest.id)">
                    {{ isQuestExpanded(quest.id) ? '▲' : '▼' }}
                  </button>
                </div>
              </div>

              <div class="quest-description" [innerHTML]="quest.description"></div>

              <div class="quest-stats">
                <span>{{ quest.objectives.length }} objectifs</span>
                <span>{{ quest.earnedPoints }} / {{ quest.totalPoints }} points</span>
              </div>

              @if (isQuestExpanded(quest.id)) {
                <div class="objectives-section">
                  <div class="objectives-header">
                    <h4>Objectifs</h4>
                    <button class="btn-small btn-primary" (click)="onAddObjective(quest.id)">
                      + Objectif
                    </button>
                  </div>

                  @if (showObjectiveForm() && currentQuestId() === quest.id) {
                    <div class="objective-form">
                      <form (ngSubmit)="onSubmitObjective()">
                        <div class="form-row">
                          <div class="form-group">
                            <label>Titre *</label>
                            <input
                              type="text"
                              [(ngModel)]="objectiveFormData.title"
                              name="objTitle"
                              required
                            />
                          </div>
                          <div class="form-group">
                            <label>Points *</label>
                            <input
                              type="number"
                              [(ngModel)]="objectiveFormData.points"
                              name="objPoints"
                              min="1"
                              required
                            />
                          </div>
                        </div>

                        <div class="form-group">
                          <label>Description *</label>
                          <textarea
                            [(ngModel)]="objectiveFormData.description"
                            name="objDescription"
                            required
                            rows="2"
                          ></textarea>
                        </div>

                        <div class="form-group">
                          <label>Vidéo (optionnelle)</label>
                          <app-video-input
                            (videoChange)="onVideoSelected($event)"
                          ></app-video-input>
                        </div>

                        <div class="form-actions">
                          <button type="button" class="btn-secondary" (click)="onCancelObjective()">
                            Annuler
                          </button>
                          <button type="submit" class="btn-primary">
                            Créer
                          </button>
                        </div>
                      </form>
                    </div>
                  }

                  <div class="objectives-list">
                    @for (objective of sortObjectives(quest.objectives); track objective.id) {
                      <div class="objective-item" [class.completed]="objective.isCompleted">
                        <div class="objective-checkbox">
                          <input
                            type="checkbox"
                            [checked]="objective.isCompleted"
                            (change)="onToggleObjective(quest.id, objective.id)"
                          />
                        </div>
                        <div class="objective-content">
                          <div class="objective-header">
                            <span class="objective-title">{{ objective.title }}</span>
                            <span class="objective-points">{{ objective.points }} pts</span>
                          </div>
                          <div class="objective-description" [innerHTML]="objective.description"></div>
                          @if (objective.video) {
                            <div class="objective-video">
                              🎥 Vidéo disponible: {{ objective.video.title || objective.video.url }}
                            </div>
                          }
                        </div>
                        <button class="btn-icon" (click)="onDeleteObjective(quest.id, objective.id)">
                          🗑️
                        </button>
                      </div>
                    } @empty {
                      <div class="empty-objectives">
                        Aucun objectif pour cette quête
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          } @empty {
            <div class="empty-state">
              <p>Aucune quête disponible</p>
              <button class="btn-primary" (click)="onAddQuest()">
                Créer votre première quête
              </button>
            </div>
          }
        </div>
      } @else {
        <div class="no-training">
          <p>Aucune formation sélectionnée</p>
          <button class="btn-primary" (click)="onBack()">
            Retour à la liste
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .training-detail {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 2rem;
      gap: 2rem;
    }

    .header-content {
      flex: 1;
    }

    .btn-back {
      background: transparent;
      border: none;
      color: #667eea;
      font-size: 1rem;
      cursor: pointer;
      padding: 0.5rem;
      margin-bottom: 1rem;
      display: inline-block;
    }

    .btn-back:hover {
      text-decoration: underline;
    }

    h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .progress-section {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid #e0e0e0;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .progress-label {
      font-weight: 600;
      color: #333;
    }

    .progress-value {
      font-weight: bold;
      color: #667eea;
    }

    .progress-bar {
      height: 12px;
      background: #e0e0e0;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s;
    }

    .points-info {
      text-align: center;
      color: #666;
      font-size: 0.875rem;
    }

    .quest-form,
    .objective-form {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .quests-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .quest-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .quest-card.completed {
      background: #f0fdf4;
      border-color: #10b981;
    }

    .quest-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .quest-title-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .quest-order {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .quest-header h3 {
      margin: 0;
      color: #333;
    }

    .quest-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: transparent;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-icon:hover {
      background: #f5f5f5;
    }

    .quest-description {
      color: #666;
      margin-bottom: 1rem;
    }

    .quest-stats {
      display: flex;
      gap: 2rem;
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1rem;
    }

    .objectives-section {
      border-top: 1px solid #e0e0e0;
      padding-top: 1rem;
      margin-top: 1rem;
    }

    .objectives-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .objectives-header h4 {
      margin: 0;
      color: #333;
    }

    .objectives-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .objective-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 3px solid #667eea;
    }

    .objective-item.completed {
      background: #f0fdf4;
      border-left-color: #10b981;
      opacity: 0.8;
    }

    .objective-checkbox input {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .objective-content {
      flex: 1;
    }

    .objective-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .objective-title {
      font-weight: 600;
      color: #333;
    }

    .objective-points {
      color: #667eea;
      font-weight: 600;
    }

    .objective-description {
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .objective-video {
      color: #667eea;
      font-size: 0.875rem;
    }

    .empty-objectives,
    .empty-state,
    .no-training {
      text-align: center;
      padding: 3rem 2rem;
      color: #666;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-success {
      background: #10b981;
      color: white;
    }

    .btn-primary,
    .btn-secondary,
    .btn-small {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #d0d0d0;
    }

    .btn-small {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
  `]
})
export class TrainingDetailComponent implements OnInit {
  private readonly trainingService = inject(TrainingService);

  private readonly expandedQuests = signal<Set<string>>(new Set());
  protected readonly showQuestForm = signal<boolean>(false);
  protected readonly showObjectiveForm = signal<boolean>(false);
  protected readonly editingQuest = signal<Quest | null>(null);
  protected readonly currentQuestId = signal<string | null>(null);

  protected questFormData = {
    title: '',
    description: '',
    order: 1
  };

  protected objectiveFormData = {
    title: '',
    description: '',
    points: 10,
    order: 1,
    video: null as Video | null
  };

  ngOnInit(): void {
    // Component initialization
  }

  protected readonly training = this.trainingService.selectedTraining$;

  protected readonly sortedQuests = computed(() => {
    const training = this.training();
    if (!training) return [];
    return [...training.quests].sort((a, b) => a.order - b.order);
  });

  protected readonly progress = computed(() => {
    const training = this.training();
    if (!training || training.totalPoints === 0) return 0;
    return Math.round((training.earnedPoints / training.totalPoints) * 100);
  });

  onBack(): void {
    this.trainingService.selectTraining('');
    // TODO: Navigate back to list
  }

  // Quest management
  onAddQuest(): void {
    this.editingQuest.set(null);
    this.questFormData = { title: '', description: '', order: 1 };
    this.showQuestForm.set(true);
  }

  onEditQuest(quest: Quest): void {
    this.editingQuest.set(quest);
    this.questFormData = {
      title: quest.title,
      description: quest.description,
      order: quest.order
    };
    this.showQuestForm.set(true);
  }

  onCancelQuest(): void {
    this.showQuestForm.set(false);
    this.editingQuest.set(null);
  }

  onSubmitQuest(): void {
    const training = this.training();
    if (!training) return;

    if (this.editingQuest()) {
      // Update existing quest
      const quest = this.editingQuest()!;
      this.trainingService.updateQuest(training.id, quest.id, this.questFormData);
    } else {
      // Create new quest
      const dto: CreateQuestDto = {
        ...this.questFormData,
        trainingId: training.id
      };
      this.trainingService.createQuest(dto);
    }

    this.onCancelQuest();
  }

  onDeleteQuest(questId: string): void {
    const training = this.training();
    if (!training) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette quête et tous ses objectifs ?')) {
      this.trainingService.deleteQuest(training.id, questId);
    }
  }

  toggleQuestExpanded(questId: string): void {
    this.expandedQuests.update(set => {
      const newSet = new Set(set);
      if (newSet.has(questId)) {
        newSet.delete(questId);
      } else {
        newSet.add(questId);
      }
      return newSet;
    });
  }

  isQuestExpanded(questId: string): boolean {
    return this.expandedQuests().has(questId);
  }

  // Objective management
  onAddObjective(questId: string): void {
    this.currentQuestId.set(questId);
    this.objectiveFormData = { title: '', description: '', points: 10, order: 1, video: null };
    this.showObjectiveForm.set(true);
  }

  onVideoSelected(video: Video | null): void {
    this.objectiveFormData.video = video;
  }

  onCancelObjective(): void {
    this.showObjectiveForm.set(false);
    this.currentQuestId.set(null);
  }

  onSubmitObjective(): void {
    const questId = this.currentQuestId();
    if (!questId) return;

    const dto: CreateObjectiveDto = {
      title: this.objectiveFormData.title,
      description: this.objectiveFormData.description,
      points: this.objectiveFormData.points,
      order: this.objectiveFormData.order,
      questId,
      video: this.objectiveFormData.video || undefined
    };

    this.trainingService.createObjective(dto);
    this.onCancelObjective();
  }

  onDeleteObjective(questId: string, objectiveId: string): void {
    const training = this.training();
    if (!training) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      this.trainingService.deleteObjective(training.id, questId, objectiveId);
    }
  }

  onToggleObjective(questId: string, objectiveId: string): void {
    const training = this.training();
    if (!training) return;

    const quest = training.quests.find((q: Quest) => q.id === questId);
    if (!quest) return;

    const objective = quest.objectives.find((o: any) => o.id === objectiveId);
    if (!objective) return;

    this.trainingService.updateObjective(
      training.id,
      questId,
      objectiveId,
      { isCompleted: !objective.isCompleted }
    );
  }

  sortObjectives(objectives: any[]): any[] {
    return [...objectives].sort((a, b) => a.order - b.order);
  }
}
