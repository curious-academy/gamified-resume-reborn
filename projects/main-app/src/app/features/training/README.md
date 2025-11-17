# E-Learning Training Feature

## 📋 Overview

This feature implements a comprehensive e-learning training system that complements the existing gamified Phaser-based platform. It allows administrators to create structured training courses through an intuitive Angular-based form interface.

## ✨ Features

### Hierarchical Training Structure
- **Training** → **Quests** → **Objectives**
- Each level can be created, edited, and deleted independently
- Automatic points calculation and progress tracking

### Video Integration
- **YouTube Links**: Embed YouTube videos with preview
- **Server Upload**: Upload video files directly to the server
- Video management component with file validation

### Gamification System
- Points-based system for objectives
- Quest completion tracking
- Training progress calculation
- Earned vs total points visualization

### Rich Content Support
- HTML content support for descriptions
- Responsive Angular interface
- Real-time progress updates using Angular 21 signals

## 🗂️ File Structure

```
projects/main-app/src/app/features/training/
├── models/
│   ├── video.model.ts          # Video types and interfaces
│   ├── objective.model.ts      # Objective interface and DTOs
│   ├── quest.model.ts          # Quest interface and helper functions
│   ├── training.model.ts       # Training interface and calculations
│   └── index.ts                # Public API for models
├── services/
│   ├── training.service.ts     # Main service with CRUD operations
│   ├── training.service.spec.ts # Unit tests
│   └── index.ts                # Public API for services
├── components/
│   ├── training-list.component.ts    # List and create trainings
│   ├── training-detail.component.ts  # Manage quests and objectives
│   ├── video-input.component.ts      # Video upload/YouTube input
│   └── index.ts                      # Public API for components
└── index.ts                    # Public API for training feature
```

## 🚀 Usage

### Accessing the Training System

The training system is available at the root route:
- **Training List**: `/` or `/trainings`
- **Training Detail**: `/trainings/:id`

### Creating a Training

1. Navigate to the trainings page
2. Click **"+ Nouvelle Formation"**
3. Fill in the title and description (HTML supported)
4. Click **"Créer"**

### Adding Quests

1. Open a training detail page
2. Click **"+ Ajouter une Quête"**
3. Fill in quest details
4. Click **"Créer"**

### Adding Objectives

1. Expand a quest by clicking the **▼** button
2. Click **"+ Objectif"**
3. Fill in objective details (title, description, points)
4. Optionally add a video (YouTube or upload)
5. Click **"Créer"**

### Completing Objectives

- Check the checkbox next to an objective to mark it as completed
- Points are automatically calculated
- Quest and training completion status updates automatically

## 🧪 Testing

Run the unit tests:
```bash
npm test
```

The test suite covers:
- Training CRUD operations
- Quest CRUD operations
- Objective CRUD operations
- Points calculation
- Completion tracking
- Computed signals

## 🎨 Styling

All components use inline styles with:
- Modern gradient colors (#667eea to #764ba2)
- Responsive grid layouts
- Smooth transitions and hover effects
- Consistent spacing and typography

## 🔧 Technical Details

### Angular 21 Signals

The service uses Angular 21 signals for reactive state management:
- `trainings$`: Readonly signal of all trainings
- `selectedTraining$`: Currently selected training
- `isLoading$`: Loading state
- `error$`: Error state
- Computed signals for totals and statistics

### Video Types

```typescript
enum VideoSourceType {
  YOUTUBE = 'youtube',
  SERVER = 'server'
}
```

### Data Models

- **Training**: Top-level entity with quests
- **Quest**: Contains multiple objectives, belongs to a training
- **Objective**: Smallest unit, can have a video

### Points System

- Objectives have configurable points
- Quest points = sum of objective points
- Training points = sum of quest points
- Earned points calculated based on completed objectives
- Automatic completion when all children are completed

## 📝 Future Enhancements

- [ ] Backend API integration (.NET 10)
- [ ] Real video upload to server
- [ ] User authentication and authorization
- [ ] Progress persistence in database
- [ ] Rich text editor for descriptions
- [ ] Drag-and-drop reordering
- [ ] Video playback tracking
- [ ] Certificates on completion
- [ ] Export/import training data

## 🐛 Known Limitations

- Video upload is currently simulated (no real backend)
- Mock data is loaded on service initialization
- No persistence (data lost on page refresh)
- No user management (single admin view)

## 📚 Related Documentation

- [Angular Best Practices](/.github/instructions/angular-best-practices.instructions.md)
- [Copilot Instructions](/.github/copilot-instructions.md)
- [Project Summary](/PROJECT_SUMMARY.md)
