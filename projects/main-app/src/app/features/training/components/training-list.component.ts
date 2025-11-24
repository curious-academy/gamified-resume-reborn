import { Component, signal, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrainingService } from '../services';
import { Training, Video } from '../models';
import { TrainingCreateComponent } from './training-create.component';

/**
 * Component for listing and managing trainings
 */
@Component({
  selector: 'app-training-list',
  imports: [FormsModule, TrainingCreateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="training-list">
      <div class="header">
        <h1>Formations E-Learning</h1>
        <button class="btn-primary" (click)="onCreateNew()">
          + Nouvelle Formation
        </button>
      </div>

      <div class="stats">
        <div class="stat-card">
          <span class="stat-value">{{ trainingService.totalTrainings() }}</span>
          <span class="stat-label">Formations</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ trainingService.completedTrainings() }}</span>
          <span class="stat-label">Complétées</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ trainingService.earnedPoints() }}/{{ trainingService.totalPoints() }}</span>
          <span class="stat-label">Points</span>
        </div>
      </div>

      @if (showCreateForm()) {
        <app-training-create
          (trainingCreated)="onTrainingCreated($event)"
          (cancelled)="onCancelCreate()"
        ></app-training-create>
      }

      <div class="trainings-grid">
        @for (training of trainings(); track training.id) {
          <div class="training-card" (click)="onSelectTraining(training.id)">
            <div class="training-header">
              <h3>{{ training.title }}</h3>
              @if (training.isCompleted) {
                <span class="badge badge-success">✓ Complété</span>
              }
            </div>

            <div class="training-description" [innerHTML]="training.description"></div>

            <div class="training-stats">
              <span>{{ training.quests.length }} quêtes</span>
              <span>{{ training.earnedPoints }}/{{ training.totalPoints }} points</span>
            </div>

            <div class="progress-bar">
              <div
                class="progress-fill"
                [style.width.%]="calculateProgress(training)"
              ></div>
            </div>

            <div class="training-actions">
              <button
                class="btn-small btn-primary"
                (click)="onEditTraining($event, training.id)"
              >
                Éditer
              </button>
              <button
                class="btn-small btn-danger"
                (click)="onDeleteTraining($event, training.id)"
              >
                Supprimer
              </button>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <p>Aucune formation disponible</p>
            <button class="btn-primary" (click)="onCreateNew()">
              Créer votre première formation
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .training-list {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      color: #333;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
    }

    .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .create-form {
      background: white;
      border: 2px solid #667eea;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .trainings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .training-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .training-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .training-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .training-header h3 {
      margin: 0;
      color: #333;
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

    .training-description {
      color: #666;
      margin-bottom: 1rem;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .training-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      color: #666;
    }

    .progress-bar {
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s;
    }

    .training-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-primary,
    .btn-secondary,
    .btn-danger,
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

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-small {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      flex: 1;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      color: #666;
    }

    .empty-state p {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }
  `]
})
export class TrainingListComponent implements OnInit {
  protected readonly trainingService = inject(TrainingService);
  readonly showCreateForm = signal<boolean>(false);

  ngOnInit(): void {
    // Component initialization
  }

  get trainings() {
    return this.trainingService.trainings$;
  }

  onCreateNew(): void {
    this.showCreateForm.set(true);
  }

  onCancelCreate(): void {
    this.showCreateForm.set(false);
  }

  onTrainingCreated(data: {
    title: string;
    description: string;
    video?: Video;
    quests: Array<{
      title: string;
      description: string;
      video: Video | null;
      objectives: Array<{
        title: string;
        description: string;
        points: number;
        video: Video | null;
      }>;
    }>;
  }): void {
    // TODO: Update service to handle quests and objectives
    this.trainingService.createTraining({
      title: data.title,
      description: data.description,
      video: data.video
    });

    // Log the quests data for now (to be integrated with service)
    console.log('Training with quests:', data);

    this.onCancelCreate();
  }

  onSelectTraining(id: string): void {
    this.trainingService.selectTraining(id);
    // TODO: Navigate to training detail page
    console.log('Selected training:', id);
  }

  onEditTraining(event: Event, id: string): void {
    event.stopPropagation();
    // TODO: Navigate to training edit page
    console.log('Edit training:', id);
  }

  onDeleteTraining(event: Event, id: string): void {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.trainingService.deleteTraining(id);
    }
  }

  calculateProgress(training: Training): number {
    if (training.totalPoints === 0) return 0;
    return Math.round((training.earnedPoints / training.totalPoints) * 100);
  }
}
