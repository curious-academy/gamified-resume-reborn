import { Quest } from './quest.model';

/**
 * Interface representing a difficulty level
 * Levels are used to categorize quests by difficulty
 */
export interface Level {
  id: string;
  name: string;
  description?: string;
  color?: string; // Hex color for UI display
  order: number; // Order for sorting (1 = easiest)
  quests?: Quest[]; // Quests belonging to this level (optional, populated on demand)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating a new level
 */
export interface CreateLevelDto {
  name: string;
  description?: string;
  color?: string;
  order: number;
}

/**
 * DTO for updating an existing level
 */
export interface UpdateLevelDto {
  name?: string;
  description?: string;
  color?: string;
  order?: number;
}

/**
 * Predefined default levels
 */
export const DEFAULT_LEVELS: Omit<Level, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Beginner',
    description: 'Easy quests for beginners',
    color: '#4CAF50', // Green
    order: 1
  },
  {
    name: 'Intermediate',
    description: 'Moderate difficulty quests',
    color: '#FF9800', // Orange
    order: 2
  },
  {
    name: 'Advanced',
    description: 'Challenging quests',
    color: '#F44336', // Red
    order: 3
  },
  {
    name: 'Expert',
    description: 'Very difficult quests for experts',
    color: '#9C27B0', // Purple
    order: 4
  }
];
