/**
 * Video source type enumeration
 */
export enum VideoSourceType {
  YOUTUBE = 'youtube',
  SERVER = 'server'
}

/**
 * Interface representing a video resource
 */
export interface Video {
  id: string;
  type: VideoSourceType;
  url: string;
  title?: string;
  duration?: number; // Duration in seconds
  thumbnail?: string;
}

/**
 * Type guard to check if a video is from YouTube
 */
export function isYouTubeVideo(video: Video): boolean {
  return video.type === VideoSourceType.YOUTUBE;
}

/**
 * Type guard to check if a video is from server
 */
export function isServerVideo(video: Video): boolean {
  return video.type === VideoSourceType.SERVER;
}
