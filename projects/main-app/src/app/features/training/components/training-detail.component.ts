import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
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
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.scss']
})
export class TrainingDetailComponent {
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
