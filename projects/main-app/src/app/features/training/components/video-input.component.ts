import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Video, VideoSourceType } from '../models';

/**
 * Component for managing video input (YouTube links or server uploads)
 */
@Component({
  selector: 'app-video-input',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-input.component.html',
  styleUrls: ['./video-input.component.scss']
})
export class VideoInputComponent {
  protected readonly currentVideo = input<Video | null>(null);
  protected readonly videoChange = output<Video | null>();

  protected readonly videoType = signal<'youtube' | 'server'>('youtube');
  protected readonly youtubeUrl = signal<string>('');
  protected readonly youtubeError = signal<string | null>(null);
  protected readonly youtubePreview = signal<string | null>(null);
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly uploadError = signal<string | null>(null);
  protected readonly uploadProgress = signal<number>(0);

  protected youtubeUrlInput = '';

  setVideoType(type: 'youtube' | 'server'): void {
    this.videoType.set(type);
    this.resetForm();
  }

  onYouTubeUrlChange(): void {
    const url = this.youtubeUrlInput.trim();
    if (!url) {
      this.youtubeError.set(null);
      this.youtubePreview.set(null);
      return;
    }

    const videoId = this.extractYouTubeVideoId(url);
    if (!videoId) {
      this.youtubeError.set('URL YouTube invalide');
      this.youtubePreview.set(null);
      return;
    }

    this.youtubeError.set(null);
    this.youtubePreview.set(`https://www.youtube.com/embed/${videoId}`);

    const video: Video = {
      id: this.generateId(),
      type: VideoSourceType.YOUTUBE,
      url: url,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };

    this.videoChange.emit(video);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      this.uploadError.set('Le fichier doit être une vidéo');
      return;
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      this.uploadError.set('Le fichier ne doit pas dépasser 500 MB');
      return;
    }

    this.uploadError.set(null);
    this.selectedFile.set(file);

    // Simulate upload progress
    this.simulateUpload(file);
  }

  private simulateUpload(file: File): void {
    // TODO: Replace with actual upload to server
    this.uploadProgress.set(0);

    const interval = setInterval(() => {
      this.uploadProgress.update(progress => {
        const newProgress = progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);

          // Emit video data after successful upload
          const video: Video = {
            id: this.generateId(),
            type: VideoSourceType.SERVER,
            url: `/api/videos/${this.generateId()}`, // Mock URL
            title: file.name
          };
          this.videoChange.emit(video);

          return 100;
        }
        return newProgress;
      });
    }, 200);
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.uploadProgress.set(0);
    this.uploadError.set(null);
    this.videoChange.emit(null);
  }

  removeVideo(): void {
    this.youtubePreview.set(null);
    this.youtubeUrlInput = '';
    this.videoChange.emit(null);
  }

  private resetForm(): void {
    this.youtubeUrlInput = '';
    this.youtubeError.set(null);
    this.youtubePreview.set(null);
    this.selectedFile.set(null);
    this.uploadError.set(null);
    this.uploadProgress.set(0);
  }

  private extractYouTubeVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
