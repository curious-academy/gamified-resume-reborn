import { Component, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { VideoInputComponent } from './video-input.component';
import { Video } from '../models';

interface QuestFormData {
  title: string;
  description: string;
  video: Video | null;
  objectives: ObjectiveFormData[];
}

interface ObjectiveFormData {
  title: string;
  description: string;
  points: number;
  video: Video | null;
}

/**
 * Component for creating a new training course with quests and objectives
 */
@Component({
  selector: 'app-training-create',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, VideoInputComponent],
  template: `
    <div class="training-create">
      <div class="form-header">
        <h2>Créer une nouvelle formation</h2>
        <button type="button" class="btn-close" (click)="onCancel()">✕</button>
      </div>

      <form [formGroup]="trainingForm" (ngSubmit)="onSubmit()">
        <!-- Training Info -->
        <div class="section">
          <h3>Informations générales</h3>

          <div class="form-group">
            <label for="title">Titre *</label>
            <input
              id="title"
              type="text"
              formControlName="title"
              placeholder="Ex: Angular Fundamentals"
            />
            @if (trainingForm.get('title')?.invalid && trainingForm.get('title')?.touched) {
              <span class="field-error">Le titre est obligatoire (min. 3 caractères)</span>
            }
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              formControlName="description"
              rows="4"
              placeholder="Description de la formation..."
            ></textarea>
            @if (trainingForm.get('description')?.invalid && trainingForm.get('description')?.touched) {
              <span class="field-error">La description est obligatoire (min. 10 caractères)</span>
            }
          </div>

          <div class="form-group">
            <label>Vidéo d'introduction (optionnelle)</label>
            <app-video-input
              (videoChange)="onTrainingVideoSelected($event)"
            ></app-video-input>
          </div>
        </div>

        <!-- Quests Section -->
        <div class="section">
          <div class="section-header">
            <h3>Quêtes</h3>
            <button type="button" class="btn-primary btn-small" (click)="addQuest()">
              + Ajouter une quête
            </button>
          </div>

          @for (quest of quests(); track $index) {
            <div class="quest-card">
              <div class="quest-header">
                <h4>Quête {{ $index + 1 }}</h4>
                <button type="button" class="btn-icon btn-danger" (click)="removeQuest($index)">
                  🗑️
                </button>
              </div>

              <div class="form-group">
                <label>Titre de la quête *</label>
                <input
                  type="text"
                  [(ngModel)]="quest.title"
                  [ngModelOptions]="{standalone: true}"
                  placeholder="Ex: Découvrir les composants"
                  required
                />
              </div>

              <div class="form-group">
                <label>Description de la quête *</label>
                <textarea
                  [(ngModel)]="quest.description"
                  [ngModelOptions]="{standalone: true}"
                  rows="3"
                  placeholder="Description de la quête..."
                  required
                ></textarea>
              </div>

              <div class="form-group">
                <label>Vidéo de la quête (optionnelle)</label>
                <app-video-input
                  [currentVideo]="quest.video"
                  (videoChange)="onQuestVideoSelected($index, $event)"
                ></app-video-input>
              </div>

              <!-- Objectives for this quest -->
              <div class="objectives-section">
                <div class="objectives-header">
                  <h5>Objectifs de la quête</h5>
                  <button type="button" class="btn-secondary btn-small" (click)="addObjective($index)">
                    + Ajouter un objectif
                  </button>
                </div>

                @for (objective of quest.objectives; track $index) {
                  <div class="objective-card">
                    <div class="objective-header">
                      <span>Objectif {{ $index + 1 }}</span>
                      <button type="button" class="btn-icon btn-danger-small" (click)="removeObjective(quest, $index)">
                        ✕
                      </button>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label>Titre *</label>
                        <input
                          type="text"
                          [(ngModel)]="objective.title"
                          [ngModelOptions]="{standalone: true}"
                          placeholder="Ex: Créer un composant"
                          required
                        />
                      </div>

                      <div class="form-group form-group-small">
                        <label>Points *</label>
                        <input
                          type="number"
                          [(ngModel)]="objective.points"
                          [ngModelOptions]="{standalone: true}"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-group">
                      <label>Description *</label>
                      <textarea
                        [(ngModel)]="objective.description"
                        [ngModelOptions]="{standalone: true}"
                        rows="2"
                        placeholder="Description de l'objectif..."
                        required
                      ></textarea>
                    </div>

                    <div class="form-group">
                      <label>Vidéo de l'objectif (optionnelle)</label>
                      <app-video-input
                        [currentVideo]="objective.video"
                        (videoChange)="onObjectiveVideoSelected(quest, $index, $event)"
                      ></app-video-input>
                    </div>
                  </div>
                } @empty {
                  <div class="empty-objectives">
                    Aucun objectif. Cliquez sur "Ajouter un objectif" pour commencer.
                  </div>
                }
              </div>
            </div>
          } @empty {
            <div class="empty-quests">
              Aucune quête. Cliquez sur "Ajouter une quête" pour commencer.
            </div>
          }
        </div>

        @if (errorMessage()) {
          <div class="error-message">
            {{ errorMessage() }}
          </div>
        }

        <div class="form-actions">
          <button type="button" class="btn-secondary" (click)="onCancel()">
            Annuler
          </button>
          <button
            type="submit"
            class="btn-primary"
            [disabled]="trainingForm.invalid || isSubmitting()"
          >
            {{ isSubmitting() ? 'Création...' : 'Créer la formation' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .training-create {
      background: white;
      border: 2px solid #667eea;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-height: 90vh;
      overflow-y: auto;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .form-header h2 {
      margin: 0;
      color: #667eea;
    }

    .btn-close {
      background: transparent;
      border: 1px solid #e0e0e0;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      font-size: 1.5rem;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background: #ef4444;
      color: white;
      border-color: #ef4444;
    }

    .section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .section h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .section-header h3 {
      margin: 0;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group-small {
      flex: 0 0 150px;
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

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-group input.ng-invalid.ng-touched,
    .form-group textarea.ng-invalid.ng-touched {
      border-color: #ef4444;
    }

    .form-row {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .form-row .form-group {
      flex: 1;
    }

    .field-error {
      display: block;
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .error-message {
      background: #fee;
      color: #c33;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      border-left: 4px solid #c33;
    }

    .quest-card {
      background: white;
      border: 2px solid #667eea;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }

    .quest-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .quest-header h4 {
      margin: 0;
      color: #667eea;
    }

    .objectives-section {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .objectives-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .objectives-header h5 {
      margin: 0;
      color: #333;
    }

    .objective-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 0.75rem;
    }

    .objective-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: #666;
    }

    .empty-quests,
    .empty-objectives {
      text-align: center;
      padding: 2rem;
      color: #666;
      background: white;
      border: 2px dashed #e0e0e0;
      border-radius: 4px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-small {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5568d3;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #d0d0d0;
    }

    .btn-icon {
      background: transparent;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-icon:hover {
      background: #f5f5f5;
    }

    .btn-danger {
      border-color: #ef4444;
      color: #ef4444;
    }

    .btn-danger:hover {
      background: #ef4444;
      color: white;
    }

    .btn-danger-small {
      background: transparent;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 1.25rem;
    }

    .btn-danger-small:hover {
      color: #dc2626;
    }
  `]
})
export class TrainingCreateComponent {
  private readonly fb = inject(FormBuilder);

  readonly trainingCreated = output<{
    title: string;
    description: string;
    video?: Video;
    quests: QuestFormData[];
  }>();
  readonly cancelled = output<void>();

  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly quests = signal<QuestFormData[]>([]);

  private trainingVideo: Video | null = null;

  readonly trainingForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  // Training video selection
  onTrainingVideoSelected(video: Video | null): void {
    this.trainingVideo = video;
  }

  // Quest management
  addQuest(): void {
    const newQuest: QuestFormData = {
      title: '',
      description: '',
      video: null,
      objectives: []
    };
    this.quests.update(quests => [...quests, newQuest]);
  }

  removeQuest(index: number): void {
    this.quests.update(quests => quests.filter((_, i) => i !== index));
  }

  onQuestVideoSelected(questIndex: number, video: Video | null): void {
    this.quests.update(quests => {
      const updated = [...quests];
      updated[questIndex].video = video;
      return updated;
    });
  }

  // Objective management
  addObjective(questIndex: number): void {
    const newObjective: ObjectiveFormData = {
      title: '',
      description: '',
      points: 10,
      video: null
    };

    this.quests.update(quests => {
      const updated = [...quests];
      updated[questIndex].objectives.push(newObjective);
      return updated;
    });
  }

  removeObjective(quest: QuestFormData, objectiveIndex: number): void {
    const questIndex = this.quests().indexOf(quest);
    if (questIndex === -1) return;

    this.quests.update(quests => {
      const updated = [...quests];
      updated[questIndex].objectives = updated[questIndex].objectives.filter(
        (_, i) => i !== objectiveIndex
      );
      return updated;
    });
  }

  onObjectiveVideoSelected(quest: QuestFormData, objectiveIndex: number, video: Video | null): void {
    const questIndex = this.quests().indexOf(quest);
    if (questIndex === -1) return;

    this.quests.update(quests => {
      const updated = [...quests];
      updated[questIndex].objectives[objectiveIndex].video = video;
      return updated;
    });
  }

  // Form validation
  private validateQuests(): boolean {
    const quests = this.quests();

    if (quests.length === 0) {
      this.errorMessage.set('Ajoutez au moins une quête');
      return false;
    }

    for (let i = 0; i < quests.length; i++) {
      const quest = quests[i];

      if (!quest.title.trim()) {
        this.errorMessage.set(`La quête ${i + 1} doit avoir un titre`);
        return false;
      }

      if (!quest.description.trim()) {
        this.errorMessage.set(`La quête ${i + 1} doit avoir une description`);
        return false;
      }

      if (quest.objectives.length === 0) {
        this.errorMessage.set(`La quête ${i + 1} doit avoir au moins un objectif`);
        return false;
      }

      for (let j = 0; j < quest.objectives.length; j++) {
        const objective = quest.objectives[j];

        if (!objective.title.trim()) {
          this.errorMessage.set(`L'objectif ${j + 1} de la quête ${i + 1} doit avoir un titre`);
          return false;
        }

        if (!objective.description.trim()) {
          this.errorMessage.set(`L'objectif ${j + 1} de la quête ${i + 1} doit avoir une description`);
          return false;
        }

        if (objective.points < 1) {
          this.errorMessage.set(`L'objectif ${j + 1} de la quête ${i + 1} doit avoir au moins 1 point`);
          return false;
        }
      }
    }

    return true;
  }

  // Form submission
  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    this.trainingForm.markAllAsTouched();

    if (this.trainingForm.invalid) {
      this.errorMessage.set('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    // Validate quests and objectives
    if (!this.validateQuests()) {
      return;
    }

    // Reset error
    this.errorMessage.set(null);

    // Set submitting state
    this.isSubmitting.set(true);

    // Emit the training data with quests and objectives
    this.trainingCreated.emit({
      title: this.trainingForm.value.title.trim(),
      description: this.trainingForm.value.description.trim(),
      video: this.trainingVideo || undefined,
      quests: this.quests()
    });

    // Reset form
    this.resetForm();
    this.isSubmitting.set(false);
  }

  onCancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  private resetForm(): void {
    this.trainingForm.reset();
    this.trainingVideo = null;
    this.quests.set([]);
    this.errorMessage.set(null);
  }
}
