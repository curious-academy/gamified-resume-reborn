import { Injectable, signal, computed } from '@angular/core';
import {
  Training,
  Quest,
  Objective,
  CreateTrainingDto,
  UpdateTrainingDto,
  CreateQuestDto,
  UpdateQuestDto,
  CreateObjectiveDto,
  UpdateObjectiveDto,
  calculateTrainingTotalPoints,
  calculateTrainingEarnedPoints,
  isTrainingCompleted,
  calculateTrainingProgress,
  calculateQuestTotalPoints,
  calculateQuestEarnedPoints,
  isQuestCompleted
} from '../models';

/**
 * Service managing training courses, quests, and objectives
 * Uses Angular 21 signals for reactive state management
 */
@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  // State signals
  private readonly trainings = signal<Training[]>([]);
  private readonly selectedTraining = signal<Training | null>(null);
  private readonly isLoading = signal<boolean>(false);
  private readonly error = signal<string | null>(null);

  // Computed signals
  readonly trainings$ = this.trainings.asReadonly();
  readonly selectedTraining$ = this.selectedTraining.asReadonly();
  readonly isLoading$ = this.isLoading.asReadonly();
  readonly error$ = this.error.asReadonly();

  readonly totalTrainings = computed(() => this.trainings().length);
  readonly completedTrainings = computed(() => 
    this.trainings().filter(t => t.isCompleted).length
  );
  readonly totalPoints = computed(() =>
    this.trainings().reduce((sum, t) => sum + t.totalPoints, 0)
  );
  readonly earnedPoints = computed(() =>
    this.trainings().reduce((sum, t) => sum + t.earnedPoints, 0)
  );

  constructor() {
    // Initialize with mock data for development
    this.loadMockData();
  }

  // ==================== TRAINING CRUD ====================

  /**
   * Get all trainings
   */
  getAllTrainings(): Training[] {
    return this.trainings();
  }

  /**
   * Get a training by ID
   */
  getTrainingById(id: string): Training | undefined {
    return this.trainings().find(t => t.id === id);
  }

  /**
   * Create a new training
   */
  createTraining(dto: CreateTrainingDto): Training {
    const newTraining: Training = {
      id: this.generateId(),
      title: dto.title,
      description: dto.description,
      quests: [],
      totalPoints: 0,
      earnedPoints: 0,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.trainings.update(trainings => [...trainings, newTraining]);
    return newTraining;
  }

  /**
   * Update an existing training
   */
  updateTraining(id: string, dto: UpdateTrainingDto): boolean {
    const index = this.trainings().findIndex(t => t.id === id);
    if (index === -1) return false;

    this.trainings.update(trainings => {
      const updated = [...trainings];
      updated[index] = {
        ...updated[index],
        ...dto,
        updatedAt: new Date()
      };
      return updated;
    });

    return true;
  }

  /**
   * Delete a training
   */
  deleteTraining(id: string): boolean {
    const index = this.trainings().findIndex(t => t.id === id);
    if (index === -1) return false;

    this.trainings.update(trainings => trainings.filter(t => t.id !== id));
    
    if (this.selectedTraining()?.id === id) {
      this.selectedTraining.set(null);
    }

    return true;
  }

  /**
   * Select a training
   */
  selectTraining(id: string): void {
    const training = this.getTrainingById(id);
    this.selectedTraining.set(training || null);
  }

  // ==================== QUEST CRUD ====================

  /**
   * Create a new quest in a training
   */
  createQuest(dto: CreateQuestDto): Quest | null {
    const training = this.getTrainingById(dto.trainingId);
    if (!training) return null;

    const newQuest: Quest = {
      id: this.generateId(),
      title: dto.title,
      description: dto.description,
      objectives: [],
      totalPoints: 0,
      earnedPoints: 0,
      order: dto.order,
      isCompleted: false,
      trainingId: dto.trainingId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.trainings.update(trainings => {
      const updated = trainings.map(t => {
        if (t.id === dto.trainingId) {
          return {
            ...t,
            quests: [...t.quests, newQuest],
            updatedAt: new Date()
          };
        }
        return t;
      });
      return updated;
    });

    return newQuest;
  }

  /**
   * Update an existing quest
   */
  updateQuest(trainingId: string, questId: string, dto: UpdateQuestDto): boolean {
    const training = this.getTrainingById(trainingId);
    if (!training) return false;

    const questIndex = training.quests.findIndex(q => q.id === questId);
    if (questIndex === -1) return false;

    this.trainings.update(trainings => {
      return trainings.map(t => {
        if (t.id === trainingId) {
          const updatedQuests = [...t.quests];
          updatedQuests[questIndex] = {
            ...updatedQuests[questIndex],
            ...dto,
            updatedAt: new Date()
          };
          return {
            ...t,
            quests: updatedQuests,
            updatedAt: new Date()
          };
        }
        return t;
      });
    });

    return true;
  }

  /**
   * Delete a quest from a training
   */
  deleteQuest(trainingId: string, questId: string): boolean {
    const training = this.getTrainingById(trainingId);
    if (!training) return false;

    this.trainings.update(trainings => {
      return trainings.map(t => {
        if (t.id === trainingId) {
          return {
            ...t,
            quests: t.quests.filter(q => q.id !== questId),
            updatedAt: new Date()
          };
        }
        return t;
      });
    });

    this.recalculateTrainingPoints(trainingId);
    return true;
  }

  // ==================== OBJECTIVE CRUD ====================

  /**
   * Create a new objective in a quest
   */
  createObjective(dto: CreateObjectiveDto): Objective | null {
    const training = this.trainings().find(t => 
      t.quests.some(q => q.id === dto.questId)
    );
    if (!training) return null;

    const newObjective: Objective = {
      id: this.generateId(),
      title: dto.title,
      description: dto.description,
      video: dto.video,
      points: dto.points,
      order: dto.order,
      isCompleted: false,
      questId: dto.questId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.trainings.update(trainings => {
      return trainings.map(t => {
        if (t.id === training.id) {
          return {
            ...t,
            quests: t.quests.map(q => {
              if (q.id === dto.questId) {
                return {
                  ...q,
                  objectives: [...q.objectives, newObjective],
                  updatedAt: new Date()
                };
              }
              return q;
            }),
            updatedAt: new Date()
          };
        }
        return t;
      });
    });

    this.recalculateQuestPoints(training.id, dto.questId);
    return newObjective;
  }

  /**
   * Update an existing objective
   */
  updateObjective(trainingId: string, questId: string, objectiveId: string, dto: UpdateObjectiveDto): boolean {
    const training = this.getTrainingById(trainingId);
    if (!training) return false;

    const quest = training.quests.find(q => q.id === questId);
    if (!quest) return false;

    const objectiveIndex = quest.objectives.findIndex(o => o.id === objectiveId);
    if (objectiveIndex === -1) return false;

    this.trainings.update(trainings => {
      return trainings.map(t => {
        if (t.id === trainingId) {
          return {
            ...t,
            quests: t.quests.map(q => {
              if (q.id === questId) {
                const updatedObjectives = [...q.objectives];
                updatedObjectives[objectiveIndex] = {
                  ...updatedObjectives[objectiveIndex],
                  ...dto,
                  updatedAt: new Date()
                };
                return {
                  ...q,
                  objectives: updatedObjectives,
                  updatedAt: new Date()
                };
              }
              return q;
            }),
            updatedAt: new Date()
          };
        }
        return t;
      });
    });

    this.recalculateQuestPoints(trainingId, questId);
    return true;
  }

  /**
   * Delete an objective from a quest
   */
  deleteObjective(trainingId: string, questId: string, objectiveId: string): boolean {
    const training = this.getTrainingById(trainingId);
    if (!training) return false;

    this.trainings.update(trainings => {
      return trainings.map(t => {
        if (t.id === trainingId) {
          return {
            ...t,
            quests: t.quests.map(q => {
              if (q.id === questId) {
                return {
                  ...q,
                  objectives: q.objectives.filter(o => o.id !== objectiveId),
                  updatedAt: new Date()
                };
              }
              return q;
            }),
            updatedAt: new Date()
          };
        }
        return t;
      });
    });

    this.recalculateQuestPoints(trainingId, questId);
    return true;
  }

  /**
   * Mark an objective as completed
   */
  completeObjective(trainingId: string, questId: string, objectiveId: string): boolean {
    return this.updateObjective(trainingId, questId, objectiveId, { isCompleted: true });
  }

  // ==================== HELPER METHODS ====================

  /**
   * Recalculate points for a specific quest
   */
  private recalculateQuestPoints(trainingId: string, questId: string): void {
    const training = this.getTrainingById(trainingId);
    if (!training) return;

    const quest = training.quests.find(q => q.id === questId);
    if (!quest) return;

    const totalPoints = calculateQuestTotalPoints(quest);
    const earnedPoints = calculateQuestEarnedPoints(quest);
    const isCompleted = isQuestCompleted(quest);

    this.updateQuest(trainingId, questId, {
      totalPoints,
      earnedPoints,
      isCompleted
    });

    this.recalculateTrainingPoints(trainingId);
  }

  /**
   * Recalculate points for a specific training
   */
  private recalculateTrainingPoints(trainingId: string): void {
    const training = this.getTrainingById(trainingId);
    if (!training) return;

    const totalPoints = calculateTrainingTotalPoints(training);
    const earnedPoints = calculateTrainingEarnedPoints(training);
    const isCompleted = isTrainingCompleted(training);

    this.updateTraining(trainingId, {
      totalPoints,
      earnedPoints,
      isCompleted
    });
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load mock data for development
   */
  private loadMockData(): void {
    const mockTraining: Training = {
      id: 'training-1',
      title: 'Angular Fundamentals',
      description: '<p>Learn the basics of Angular framework</p>',
      quests: [
        {
          id: 'quest-1',
          title: 'Getting Started',
          description: '<p>Introduction to Angular</p>',
          objectives: [
            {
              id: 'objective-1',
              title: 'Install Angular CLI',
              description: '<p>Learn how to install Angular CLI</p>',
              points: 10,
              order: 1,
              isCompleted: false,
              questId: 'quest-1',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          totalPoints: 10,
          earnedPoints: 0,
          order: 1,
          isCompleted: false,
          trainingId: 'training-1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      totalPoints: 10,
      earnedPoints: 0,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.trainings.set([mockTraining]);
  }
}
