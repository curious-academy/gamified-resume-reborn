import { Component, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VideoInputComponent } from './video-input.component';
import { Video } from '../models';

/**
 * Component for creating a new training course
 */
@Component({
  selector: 'app-training-create',
  imports: [CommonModule, ReactiveFormsModule, VideoInputComponent],
  template: `
    <div class="training-create">
      <div class="form-header">
        <h2>Créer une nouvelle formation</h2>
        <button type="button" class="btn-close" (click)="onCancel()">✕</button>
      </div>

      <form [formGroup]="trainingForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Titre *</label>
          <input
            id="title"
            type="text"
            formControlName="title"
            placeholder="Ex: Angular Fundamentals"
          />
          @if (trainingForm.get('title')?.invalid && trainingForm.get('title')?.touched) {
            <span class="field-error">Le titre est obligatoire (min. 3 caractères)</span>
          }
        </div>

        <div class="form-group">
          <label for="description">Description *</label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
            placeholder="Description de la formation..."
          ></textarea>
          @if (trainingForm.get('description')?.invalid && trainingForm.get('description')?.touched) {
            <span class="field-error">La description est obligatoire (min. 10 caractères)</span>
          }
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
          <button
            type="submit"
            class="btn-primary"
            [disabled]="trainingForm.invalid || isSubmitting()"
          >
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

    .form-group input.ng-invalid.ng-touched,
    .form-group textarea.ng-invalid.ng-touched {
      border-color: #ef4444;
    }

    .field-error {
      display: block;
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
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
  private readonly fb = inject(FormBuilder);

  readonly trainingCreated = output<{
    title: string;
    description: string;
    video?: Video;
  }>();
  readonly cancelled = output<void>();

  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  private selectedVideo: Video | null = null;

  readonly trainingForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  onVideoSelected(video: Video | null): void {
    this.selectedVideo = video;
  }

  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    this.trainingForm.markAllAsTouched();

    if (this.trainingForm.invalid) {
      this.errorMessage.set('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    // Reset error
    this.errorMessage.set(null);

    // Set submitting state
    this.isSubmitting.set(true);

    // Emit the training data
    this.trainingCreated.emit({
      title: this.trainingForm.value.title.trim(),
      description: this.trainingForm.value.description.trim(),
      video: this.selectedVideo || undefined
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
    this.trainingForm.reset();
    this.selectedVideo = null;
    this.errorMessage.set(null);
  }
}
