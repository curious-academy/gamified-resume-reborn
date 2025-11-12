import { Quest } from './quest.model';

/**
 * Interface representing a training course
 * A training is the top-level entity containing multiple quests
 */
export interface Training {
  id: string;
  title: string;
  description: string; // HTML content support
  quests: Quest[];
  totalPoints: number;
  earnedPoints: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

/**
 * DTO for creating a new training
 */
export interface CreateTrainingDto {
  title: string;
  description: string;
}

/**
 * DTO for updating an existing training
 */
export interface UpdateTrainingDto {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  totalPoints?: number;
  earnedPoints?: number;
}

/**
 * Calculates the total points for a training based on its quests
 */
export function calculateTrainingTotalPoints(training: Training): number {
  return training.quests.reduce((sum, quest) => sum + quest.totalPoints, 0);
}

/**
 * Calculates the earned points for a training based on completed quests
 */
export function calculateTrainingEarnedPoints(training: Training): number {
  return training.quests.reduce((sum, quest) => sum + quest.earnedPoints, 0);
}

/**
 * Checks if all quests in a training are completed
 */
export function isTrainingCompleted(training: Training): boolean {
  return training.quests.length > 0 &&
         training.quests.every(quest => quest.isCompleted);
}

/**
 * Calculates the progress percentage of a training
 */
export function calculateTrainingProgress(training: Training): number {
  if (training.totalPoints === 0) return 0;
  return Math.round((training.earnedPoints / training.totalPoints) * 100);
}
