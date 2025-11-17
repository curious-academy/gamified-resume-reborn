import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoInputComponent } from './video-input.component';
import { Video } from '../models';

/**
 * Component for creating a new training course
 */
@Component({
  selector: 'app-training-create',
  imports: [CommonModule, FormsModule, VideoInputComponent],
  template: `
    <div class="training-create">
      <div class="form-header">
        <h2>Créer une nouvelle formation</h2>
        <button type="button" class="btn-close" (click)="onCancel()">✕</button>
      </div>

      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Titre *</label>
          <input
            id="title"
            type="text"
            [(ngModel)]="formData.title"
            name="title"
            required
            placeholder="Ex: Angular Fundamentals"
          />
        </div>

        <div class="form-group">
          <label for="description">Description *</label>
          <textarea
            id="description"
            [(ngModel)]="formData.description"
            name="description"
            required
            rows="4"
            placeholder="Description de la formation..."
          ></textarea>
        </div>

        <div class="form-group">
          <label>Vidéo d'introduction (optionnelle)</label>
          <app-video-input
            (videoChange)="onVideoSelected($event)"
          ></app-video-input>
        </div>

        @if (errorMessage()) {
          <div class="error-message">
            {{ errorMessage() }}
          </div>
        }

        <div class="form-actions">
          <button type="button" class="btn-secondary" (click)="onCancel()">
            Annuler
          </button>
          <button type="submit" class="btn-primary" [disabled]="isSubmitting()">
            {{ isSubmitting() ? 'Création...' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .training-create {
      background: white;
      border: 2px solid #667eea;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .form-header h2 {
      margin: 0;
      color: #667eea;
    }

    .btn-close {
      background: transparent;
      border: 1px solid #e0e0e0;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      font-size: 1.5rem;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background: #ef4444;
      color: white;
      border-color: #ef4444;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    .error-message {
      background: #fee;
      color: #c33;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      border-left: 4px solid #c33;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5568d3;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #d0d0d0;
    }
  `]
})
export class TrainingCreateComponent {
  readonly trainingCreated = output<{
    title: string;
    description: string;
    video?: Video;
  }>();
  readonly cancelled = output<void>();

  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  formData = {
    title: '',
    description: '',
    video: null as Video | null
  };

  onVideoSelected(video: Video | null): void {
    this.formData.video = video;
  }

  onSubmit(): void {
    // Reset error
    this.errorMessage.set(null);

    // Validate form
    if (!this.formData.title.trim()) {
      this.errorMessage.set('Le titre est obligatoire');
      return;
    }

    if (!this.formData.description.trim()) {
      this.errorMessage.set('La description est obligatoire');
      return;
    }

    // Set submitting state
    this.isSubmitting.set(true);

    // Emit the training data
    this.trainingCreated.emit({
      title: this.formData.title,
      description: this.formData.description,
      video: this.formData.video || undefined
    });

    // Reset form
    this.resetForm();
    this.isSubmitting.set(false);
  }

  onCancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  private resetForm(): void {
    this.formData = {
      title: '',
      description: '',
      video: null
    };
    this.errorMessage.set(null);
  }
}
