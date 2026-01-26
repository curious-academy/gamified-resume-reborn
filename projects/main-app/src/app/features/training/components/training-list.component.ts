import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
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
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss']
})
export class TrainingListComponent {
  protected readonly trainingService = inject(TrainingService);
  protected readonly showCreateForm = signal<boolean>(false);

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
