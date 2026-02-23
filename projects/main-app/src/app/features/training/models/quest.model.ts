import { Objective } from './objective.model';
import { Level } from './level.model';

/**
 * Interface representing a training quest
 * A quest contains multiple objectives and belongs to a training
 */
export interface Quest {
  id: string;
  title: string;
  description: string; // HTML content support
  objectives: Objective[];
  totalPoints: number;
  earnedPoints: number;
  order: number;
  isCompleted: boolean;
  trainingId: string;
  levelId: string; // Foreign key to level (required)
  level?: Level; // Populated level data (optional)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating a new quest
 */
export interface CreateQuestDto {
  title: string;
  description: string;
  order: number;
  trainingId: string;
  levelId: string; // Required difficulty level
}

/**
 * DTO for updating an existing quest
 */
export interface UpdateQuestDto {
  title?: string;
  description?: string;
  order?: number;
  isCompleted?: boolean;
  totalPoints?: number;
  earnedPoints?: number;
  levelId?: string; // Update difficulty level
}

/**
 * Calculates the total points for a quest based on its objectives
 */
export function calculateQuestTotalPoints(quest: Quest): number {
  return quest.objectives.reduce((sum, objective) => sum + objective.points, 0);
}

/**
 * Calculates the earned points for a quest based on completed objectives
 */
export function calculateQuestEarnedPoints(quest: Quest): number {
  return quest.objectives
    .filter(objective => objective.isCompleted)
    .reduce((sum, objective) => sum + objective.points, 0);
}

/**
 * Checks if all objectives in a quest are completed
 */
export function isQuestCompleted(quest: Quest): boolean {
  return quest.objectives.length > 0 &&
         quest.objectives.every(objective => objective.isCompleted);
}
