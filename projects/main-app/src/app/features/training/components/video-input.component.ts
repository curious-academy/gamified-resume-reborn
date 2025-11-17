import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Video, VideoSourceType } from '../models';

/**
 * Component for managing video input (YouTube links or server uploads)
 */
@Component({
  selector: 'app-video-input',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="video-input">
      <div class="video-type-selector">
        <button
          type="button"
          class="type-btn"
          [class.active]="videoType() === 'youtube'"
          (click)="setVideoType('youtube')"
        >
          📺 YouTube
        </button>
        <button
          type="button"
          class="type-btn"
          [class.active]="videoType() === 'server'"
          (click)="setVideoType('server')"
        >
          📤 Upload Serveur
        </button>
      </div>

      @if (videoType() === 'youtube') {
        <div class="youtube-input">
          <div class="form-group">
            <label for="youtubeUrl">URL YouTube *</label>
            <input
              id="youtubeUrl"
              type="url"
              [(ngModel)]="youtubeUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              (blur)="onYouTubeUrlChange()"
            />
            @if (youtubeError()) {
              <span class="error-message">{{ youtubeError() }}</span>
            }
          </div>

          @if (youtubePreview()) {
            <div class="video-preview">
              <div class="preview-header">
                <span>Aperçu</span>
                <button type="button" class="btn-remove" (click)="removeVideo()">
                  ✕
                </button>
              </div>
              <div class="youtube-embed">
                <iframe
                  [src]="youtubePreview()"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          }
        </div>
      }

      @if (videoType() === 'server') {
        <div class="server-upload">
          <div class="form-group">
            <label for="videoFile">Fichier vidéo *</label>
            <input
              id="videoFile"
              type="file"
              accept="video/*"
              (change)="onFileSelected($event)"
            />
            @if (uploadError()) {
              <span class="error-message">{{ uploadError() }}</span>
            }
          </div>

          @if (selectedFile()) {
            <div class="file-info">
              <div class="file-details">
                <span class="file-name">{{ selectedFile()?.name }}</span>
                <span class="file-size">{{ formatFileSize(selectedFile()?.size || 0) }}</span>
              </div>
              <button type="button" class="btn-remove" (click)="removeFile()">
                ✕
              </button>
            </div>

            @if (uploadProgress() > 0 && uploadProgress() < 100) {
              <div class="upload-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="uploadProgress()"></div>
                </div>
                <span class="progress-text">{{ uploadProgress() }}%</span>
              </div>
            }

            @if (uploadProgress() === 100) {
              <div class="upload-success">
                ✓ Upload terminé avec succès
              </div>
            }
          }
        </div>
      }

      @if (currentVideo()) {
        <div class="current-video">
          <div class="current-video-header">
            <span>Vidéo actuelle</span>
            <button type="button" class="btn-remove" (click)="removeVideo()">
              ✕
            </button>
          </div>
          <div class="current-video-info">
            <span class="video-icon">
              {{ currentVideo()?.type === 'youtube' ? '📺' : '📹' }}
            </span>
            <div class="video-details">
              <span class="video-title">{{ currentVideo()?.title || 'Sans titre' }}</span>
              <span class="video-url">{{ currentVideo()?.url }}</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .video-input {
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      background: #f8f9fa;
    }

    .video-type-selector {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .type-btn {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .type-btn:hover {
      border-color: #667eea;
    }

    .type-btn.active {
      border-color: #667eea;
      background: #667eea;
      color: white;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-group input[type="url"],
    .form-group input[type="text"] {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-group input[type="file"] {
      width: 100%;
      padding: 0.5rem;
      border: 2px dashed #e0e0e0;
      border-radius: 4px;
      cursor: pointer;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      display: block;
      margin-top: 0.5rem;
    }

    .video-preview {
      margin-top: 1rem;
      border: 2px solid #667eea;
      border-radius: 8px;
      overflow: hidden;
      background: white;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #667eea;
      color: white;
      font-weight: 600;
    }

    .youtube-embed {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      height: 0;
      overflow: hidden;
    }

    .youtube-embed iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .file-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: white;
      border: 2px solid #667eea;
      border-radius: 4px;
      margin-top: 1rem;
    }

    .file-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .file-name {
      font-weight: 600;
      color: #333;
    }

    .file-size {
      font-size: 0.875rem;
      color: #666;
    }

    .btn-remove {
      background: transparent;
      border: 1px solid #e0e0e0;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      cursor: pointer;
      color: #666;
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-remove:hover {
      background: #ef4444;
      color: white;
      border-color: #ef4444;
    }

    .upload-progress {
      margin-top: 1rem;
    }

    .progress-bar {
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s;
    }

    .progress-text {
      font-size: 0.875rem;
      color: #666;
      text-align: center;
      display: block;
    }

    .upload-success {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #10b981;
      color: white;
      border-radius: 4px;
      text-align: center;
      font-weight: 600;
    }

    .current-video {
      margin-top: 1rem;
      border: 2px solid #667eea;
      border-radius: 8px;
      overflow: hidden;
      background: white;
    }

    .current-video-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #667eea;
      color: white;
      font-weight: 600;
    }

    .current-video-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .video-icon {
      font-size: 2rem;
    }

    .video-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }

    .video-title {
      font-weight: 600;
      color: #333;
    }

    .video-url {
      font-size: 0.875rem;
      color: #666;
      word-break: break-all;
    }
  `]
})
export class VideoInputComponent {
  readonly currentVideo = input<Video | null>(null);
  readonly videoChange = output<Video | null>();

  readonly videoType = signal<'youtube' | 'server'>('youtube');
  readonly youtubeUrl = signal<string>('');
  readonly youtubeError = signal<string | null>(null);
  readonly youtubePreview = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);
  readonly uploadError = signal<string | null>(null);
  readonly uploadProgress = signal<number>(0);

  youtubeUrlInput = '';

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
