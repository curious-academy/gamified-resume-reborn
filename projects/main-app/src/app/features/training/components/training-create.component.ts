import { Component, output, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { VideoInputComponent } from './video-input.component';
import { Video } from '../models';

/**
 * Component for creating a new training course with quests and objectives
 */
@Component({
  selector: 'app-training-create',
  imports: [ReactiveFormsModule, VideoInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './training-create.component.html',
  styleUrls: ['./training-create.component.scss']
})
export class TrainingCreateComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly trainingCreated = output<{
    title: string;
    description: string;
    video?: Video;
    quests: any[];
  }>();
  protected readonly cancelled = output<void>();

  protected readonly isSubmitting = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);

  private trainingVideo: Video | null = null;
  private questVideos: Map<number, Video | null> = new Map();
  private objectiveVideos: Map<string, Video | null> = new Map();

  protected readonly trainingForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    quests: this.fb.array([])
  });

  // Getters for FormArrays
  protected get questsArray(): FormArray {
    return this.trainingForm.get('quests') as FormArray;
  }

  protected getObjectivesArray(questIndex: number): FormArray {
    return this.questsArray.at(questIndex).get('objectives') as FormArray;
  }

  // Create FormGroup for Quest
  private createQuestFormGroup(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      objectives: this.fb.array([])
    });
  }

  // Create FormGroup for Objective
  private createObjectiveFormGroup(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      points: [10, [Validators.required, Validators.min(1)]]
    });
  }

  // Training video selection
  onTrainingVideoSelected(video: Video | null): void {
    this.trainingVideo = video;
  }

  // Quest management
  addQuest(): void {
    this.questsArray.push(this.createQuestFormGroup());
  }

  removeQuest(index: number): void {
    this.questsArray.removeAt(index);
    this.questVideos.delete(index);

    // Clean up objective videos for this quest
    const keysToDelete: string[] = [];
    this.objectiveVideos.forEach((_, key) => {
      if (key.startsWith(`${index}-`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.objectiveVideos.delete(key));
  }

  onQuestVideoSelected(questIndex: number, video: Video | null): void {
    this.questVideos.set(questIndex, video);
  }

  // Objective management
  addObjective(questIndex: number): void {
    const objectivesArray = this.getObjectivesArray(questIndex);
    objectivesArray.push(this.createObjectiveFormGroup());
  }

  removeObjective(questControl: any, objectiveIndex: number): void {
    const questIndex = this.questsArray.controls.indexOf(questControl);
    const objectivesArray = this.getObjectivesArray(questIndex);
    objectivesArray.removeAt(objectiveIndex);

    // Clean up video reference
    const videoKey = `${questIndex}-${objectiveIndex}`;
    this.objectiveVideos.delete(videoKey);
  }

  onObjectiveVideoSelected(questControl: any, objectiveIndex: number, video: Video | null): void {
    const questIndex = this.questsArray.controls.indexOf(questControl);
    const videoKey = `${questIndex}-${objectiveIndex}`;
    this.objectiveVideos.set(videoKey, video);
  }

  // Form validation
  private validateForm(): boolean {
    if (this.questsArray.length === 0) {
      this.errorMessage.set('Ajoutez au moins une quête');
      return false;
    }

    for (let i = 0; i < this.questsArray.length; i++) {
      const questGroup = this.questsArray.at(i) as FormGroup;
      const objectivesArray = this.getObjectivesArray(i);

      if (objectivesArray.length === 0) {
        this.errorMessage.set(`La quête ${i + 1} doit avoir au moins un objectif`);
        return false;
      }
    }

    return true;
  }

  // Build output data with videos
  private buildOutputData(): any {
    const quests = this.questsArray.value.map((quest: any, questIndex: number) => {
      const objectives = quest.objectives.map((objective: any, objectiveIndex: number) => {
        const videoKey = `${questIndex}-${objectiveIndex}`;
        return {
          ...objective,
          video: this.objectiveVideos.get(videoKey) || null
        };
      });

      return {
        ...quest,
        video: this.questVideos.get(questIndex) || null,
        objectives
      };
    });

    return {
      title: this.trainingForm.value.title.trim(),
      description: this.trainingForm.value.description.trim(),
      video: this.trainingVideo || undefined,
      quests
    };
  }

  // Form submission
  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    this.trainingForm.markAllAsTouched();

    if (this.trainingForm.invalid) {
      this.errorMessage.set('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    // Validate quests and objectives
    if (!this.validateForm()) {
      return;
    }

    // Reset error
    this.errorMessage.set(null);

    // Set submitting state
    this.isSubmitting.set(true);

    // Build and emit the training data with quests and objectives
    this.trainingCreated.emit(this.buildOutputData());

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
    this.questsArray.clear();
    this.trainingVideo = null;
    this.questVideos.clear();
    this.objectiveVideos.clear();
    this.errorMessage.set(null);
  }
}
