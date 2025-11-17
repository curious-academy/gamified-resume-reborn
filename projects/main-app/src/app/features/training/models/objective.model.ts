import { Video } from './video.model';

/**
 * Interface representing a training objective
 * An objective is the smallest unit in the training hierarchy
 */
export interface Objective {
  id: string;
  title: string;
  description: string; // HTML content support
  video?: Video;
  points: number;
  order: number;
  isCompleted: boolean;
  questId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating a new objective
 */
export interface CreateObjectiveDto {
  title: string;
  description: string;
  video?: Video;
  points: number;
  order: number;
  questId: string;
}

/**
 * DTO for updating an existing objective
 */
export interface UpdateObjectiveDto {
  title?: string;
  description?: string;
  video?: Video;
  points?: number;
  order?: number;
  isCompleted?: boolean;
}
