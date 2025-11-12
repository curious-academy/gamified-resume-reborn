import { TestBed } from '@angular/core/testing';
import { TrainingService } from './training.service';
import { CreateTrainingDto, CreateQuestDto, CreateObjectiveDto, VideoSourceType } from '../models';

describe('TrainingService', () => {
  let service: TrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainingService]
    });
    service = TestBed.inject(TrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Training CRUD', () => {
    it('should create a new training', () => {
      const dto: CreateTrainingDto = {
        title: 'Test Training',
        description: '<p>Test Description</p>'
      };

      const training = service.createTraining(dto);

      expect(training).toBeDefined();
      expect(training.title).toBe(dto.title);
      expect(training.description).toBe(dto.description);
      expect(training.quests).toEqual([]);
      expect(training.totalPoints).toBe(0);
      expect(training.earnedPoints).toBe(0);
      expect(training.isCompleted).toBe(false);
    });

    it('should get all trainings', () => {
      const trainings = service.getAllTrainings();
      expect(Array.isArray(trainings)).toBe(true);
      expect(trainings.length).toBeGreaterThan(0); // Mock data is loaded
    });

    it('should get training by id', () => {
      const dto: CreateTrainingDto = {
        title: 'Test Training',
        description: '<p>Test</p>'
      };
      const created = service.createTraining(dto);

      const found = service.getTrainingById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should update a training', () => {
      const dto: CreateTrainingDto = {
        title: 'Original Title',
        description: '<p>Original</p>'
      };
      const created = service.createTraining(dto);

      const success = service.updateTraining(created.id, {
        title: 'Updated Title'
      });

      expect(success).toBe(true);

      const updated = service.getTrainingById(created.id);
      expect(updated?.title).toBe('Updated Title');
    });

    it('should delete a training', () => {
      const dto: CreateTrainingDto = {
        title: 'To Delete',
        description: '<p>Delete me</p>'
      };
      const created = service.createTraining(dto);

      const success = service.deleteTraining(created.id);

      expect(success).toBe(true);
      expect(service.getTrainingById(created.id)).toBeUndefined();
    });

    it('should select a training', () => {
      const dto: CreateTrainingDto = {
        title: 'To Select',
        description: '<p>Select me</p>'
      };
      const created = service.createTraining(dto);

      service.selectTraining(created.id);

      expect(service.selectedTraining$()).toBe(created);
    });
  });

  describe('Quest CRUD', () => {
    let trainingId: string;

    beforeEach(() => {
      const training = service.createTraining({
        title: 'Test Training',
        description: '<p>Test</p>'
      });
      trainingId = training.id;
    });

    it('should create a new quest', () => {
      const dto: CreateQuestDto = {
        title: 'Test Quest',
        description: '<p>Quest Description</p>',
        order: 1,
        trainingId
      };

      const quest = service.createQuest(dto);

      expect(quest).toBeDefined();
      expect(quest?.title).toBe(dto.title);
      expect(quest?.description).toBe(dto.description);
      expect(quest?.order).toBe(dto.order);
      expect(quest?.objectives).toEqual([]);
    });

    it('should update a quest', () => {
      const quest = service.createQuest({
        title: 'Original Quest',
        description: '<p>Original</p>',
        order: 1,
        trainingId
      });

      const success = service.updateQuest(trainingId, quest!.id, {
        title: 'Updated Quest'
      });

      expect(success).toBe(true);

      const training = service.getTrainingById(trainingId);
      const updated = training?.quests.find(q => q.id === quest!.id);
      expect(updated?.title).toBe('Updated Quest');
    });

    it('should delete a quest', () => {
      const quest = service.createQuest({
        title: 'To Delete',
        description: '<p>Delete</p>',
        order: 1,
        trainingId
      });

      const success = service.deleteQuest(trainingId, quest!.id);

      expect(success).toBe(true);

      const training = service.getTrainingById(trainingId);
      expect(training?.quests.find(q => q.id === quest!.id)).toBeUndefined();
    });
  });

  describe('Objective CRUD', () => {
    let trainingId: string;
    let questId: string;

    beforeEach(() => {
      const training = service.createTraining({
        title: 'Test Training',
        description: '<p>Test</p>'
      });
      trainingId = training.id;

      const quest = service.createQuest({
        title: 'Test Quest',
        description: '<p>Quest</p>',
        order: 1,
        trainingId
      });
      questId = quest!.id;
    });

    it('should create a new objective', () => {
      const dto: CreateObjectiveDto = {
        title: 'Test Objective',
        description: '<p>Objective Description</p>',
        points: 50,
        order: 1,
        questId
      };

      const objective = service.createObjective(dto);

      expect(objective).toBeDefined();
      expect(objective?.title).toBe(dto.title);
      expect(objective?.points).toBe(dto.points);
      expect(objective?.isCompleted).toBe(false);
    });

    it('should create objective with video', () => {
      const dto: CreateObjectiveDto = {
        title: 'Video Objective',
        description: '<p>Watch this</p>',
        points: 30,
        order: 1,
        questId,
        video: {
          id: 'video-1',
          type: VideoSourceType.YOUTUBE,
          url: 'https://youtube.com/watch?v=test',
          title: 'Test Video'
        }
      };

      const objective = service.createObjective(dto);

      expect(objective?.video).toBeDefined();
      expect(objective?.video?.type).toBe(VideoSourceType.YOUTUBE);
    });

    it('should update an objective', () => {
      const objective = service.createObjective({
        title: 'Original Objective',
        description: '<p>Original</p>',
        points: 10,
        order: 1,
        questId
      });

      const success = service.updateObjective(
        trainingId,
        questId,
        objective!.id,
        { title: 'Updated Objective' }
      );

      expect(success).toBe(true);

      const training = service.getTrainingById(trainingId);
      const quest = training?.quests.find(q => q.id === questId);
      const updated = quest?.objectives.find(o => o.id === objective!.id);
      expect(updated?.title).toBe('Updated Objective');
    });

    it('should complete an objective', () => {
      const objective = service.createObjective({
        title: 'To Complete',
        description: '<p>Complete me</p>',
        points: 25,
        order: 1,
        questId
      });

      const success = service.completeObjective(
        trainingId,
        questId,
        objective!.id
      );

      expect(success).toBe(true);

      const training = service.getTrainingById(trainingId);
      const quest = training?.quests.find(q => q.id === questId);
      const completed = quest?.objectives.find(o => o.id === objective!.id);
      expect(completed?.isCompleted).toBe(true);
    });

    it('should delete an objective', () => {
      const objective = service.createObjective({
        title: 'To Delete',
        description: '<p>Delete</p>',
        points: 15,
        order: 1,
        questId
      });

      const success = service.deleteObjective(
        trainingId,
        questId,
        objective!.id
      );

      expect(success).toBe(true);

      const training = service.getTrainingById(trainingId);
      const quest = training?.quests.find(q => q.id === questId);
      expect(quest?.objectives.find(o => o.id === objective!.id)).toBeUndefined();
    });
  });

  describe('Points Calculation', () => {
    it('should recalculate quest points when objectives change', () => {
      const training = service.createTraining({
        title: 'Points Test',
        description: '<p>Test</p>'
      });

      const quest = service.createQuest({
        title: 'Quest',
        description: '<p>Quest</p>',
        order: 1,
        trainingId: training.id
      });

      // Add objectives
      service.createObjective({
        title: 'Obj 1',
        description: '<p>Obj 1</p>',
        points: 10,
        order: 1,
        questId: quest!.id
      });

      service.createObjective({
        title: 'Obj 2',
        description: '<p>Obj 2</p>',
        points: 20,
        order: 2,
        questId: quest!.id
      });

      const updated = service.getTrainingById(training.id);
      const updatedQuest = updated?.quests.find(q => q.id === quest!.id);

      expect(updatedQuest?.totalPoints).toBe(30);
      expect(updated?.totalPoints).toBe(30);
    });

    it('should calculate earned points when objectives are completed', () => {
      const training = service.createTraining({
        title: 'Earned Points Test',
        description: '<p>Test</p>'
      });

      const quest = service.createQuest({
        title: 'Quest',
        description: '<p>Quest</p>',
        order: 1,
        trainingId: training.id
      });

      const obj1 = service.createObjective({
        title: 'Obj 1',
        description: '<p>Obj 1</p>',
        points: 10,
        order: 1,
        questId: quest!.id
      });

      const obj2 = service.createObjective({
        title: 'Obj 2',
        description: '<p>Obj 2</p>',
        points: 20,
        order: 2,
        questId: quest!.id
      });

      // Complete first objective
      service.completeObjective(training.id, quest!.id, obj1!.id);

      const updated = service.getTrainingById(training.id);
      const updatedQuest = updated?.quests.find(q => q.id === quest!.id);

      expect(updatedQuest?.earnedPoints).toBe(10);
      expect(updated?.earnedPoints).toBe(10);
      expect(updatedQuest?.isCompleted).toBe(false);

      // Complete second objective
      service.completeObjective(training.id, quest!.id, obj2!.id);

      const fullyUpdated = service.getTrainingById(training.id);
      const fullyUpdatedQuest = fullyUpdated?.quests.find(q => q.id === quest!.id);

      expect(fullyUpdatedQuest?.earnedPoints).toBe(30);
      expect(fullyUpdated?.earnedPoints).toBe(30);
      expect(fullyUpdatedQuest?.isCompleted).toBe(true);
      expect(fullyUpdated?.isCompleted).toBe(true);
    });
  });

  describe('Computed Signals', () => {
    it('should compute total trainings', () => {
      const initial = service.totalTrainings();

      service.createTraining({
        title: 'New Training',
        description: '<p>New</p>'
      });

      expect(service.totalTrainings()).toBe(initial + 1);
    });

    it('should compute completed trainings', () => {
      const training = service.createTraining({
        title: 'Completed Training',
        description: '<p>Complete</p>'
      });

      service.updateTraining(training.id, { isCompleted: true });

      expect(service.completedTrainings()).toBeGreaterThan(0);
    });

    it('should compute total and earned points', () => {
      expect(service.totalPoints()).toBeGreaterThanOrEqual(0);
      expect(service.earnedPoints()).toBeGreaterThanOrEqual(0);
      expect(service.earnedPoints()).toBeLessThanOrEqual(service.totalPoints());
    });
  });
});
