# Architecture du code - Refactoring

## 📁 Nouvelle structure

```
app/
├── core/
│   └── services/
│       └── phaser.service.ts          # Service singleton gérant Phaser
├── features/
│   └── game/
│       ├── entities/
│       │   └── player.entity.ts       # Classe Player
│       ├── scenes/
│       │   └── game.scene.ts          # Scène principale du jeu
│       ├── game.component.ts          # Composant Angular pour le jeu
│       └── index.ts                   # Barrel export
├── app.ts                             # Composant racine (simplifié)
├── app.html                           # Template racine
└── app.scss                           # Styles racine
```

## 🎯 Séparation des responsabilités

### 1. **App Component** (`app.ts`)
- **Responsabilité** : Conteneur principal de l'application
- **Tâches** : Orchestre les composants enfants
- **Principe** : Point d'entrée simple et léger

### 2. **PhaserService** (`core/services/phaser.service.ts`)
- **Responsabilité** : Gestion du cycle de vie de Phaser
- **Tâches** :
  - Initialisation du jeu
  - Destruction du jeu
  - Accès aux scènes
- **Pattern** : Singleton (providedIn: 'root')

### 3. **GameComponent** (`features/game/game.component.ts`)
- **Responsabilité** : Affichage et configuration du jeu
- **Tâches** :
  - Initialisation avec la config Phaser
  - Gestion du cycle de vie (OnInit, OnDestroy)
  - État de chargement avec signal
- **Pattern** : Component Angular avec template inline

### 4. **GameScene** (`features/game/scenes/game.scene.ts`)
- **Responsabilité** : Logique de la scène de jeu
- **Tâches** :
  - Création de la carte
  - Gestion du joueur
  - Collisions
  - Caméra
- **Pattern** : Phaser Scene avec méthodes privées organisées

### 5. **Player** (`features/game/entities/player.entity.ts`)
- **Responsabilité** : Comportement du joueur
- **Tâches** :
  - Mouvements
  - Contrôles clavier
  - Effets visuels
  - Particules
- **Pattern** : Entity avec configuration injectable

## ✨ Améliorations apportées

### Code Quality
- ✅ **Séparation des responsabilités** : Chaque fichier a un rôle unique
- ✅ **Single Responsibility Principle** : Un composant = une tâche
- ✅ **Documentation** : JSDoc sur toutes les méthodes publiques
- ✅ **Typage fort** : Interfaces et types explicites
- ✅ **Conventions Angular 21** : Signals, inject(), standalone components

### Architecture
- ✅ **Structure modulaire** : Facile d'ajouter de nouvelles features
- ✅ **Barrel exports** : Import simplifié via index.ts
- ✅ **Services réutilisables** : PhaserService peut servir à d'autres jeux
- ✅ **Composants découplés** : Pas de dépendances croisées

### Maintenance
- ✅ **Lisibilité** : Code clair et bien organisé
- ✅ **Testabilité** : Services et composants isolés
- ✅ **Évolutivité** : Facile d'ajouter nouvelles entités/scènes
- ✅ **Réutilisabilité** : Composants et services indépendants

## 🚀 Comment utiliser

### Ajouter une nouvelle entité
```typescript
// 1. Créer le fichier dans features/game/entities/
// features/game/entities/enemy.entity.ts
export class Enemy extends Phaser.GameObjects.Sprite {
  // ...
}

// 2. L'utiliser dans une scène
import { Enemy } from '../entities/enemy.entity';
```

### Ajouter une nouvelle scène
```typescript
// 1. Créer le fichier dans features/game/scenes/
// features/game/scenes/menu.scene.ts
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }
}

// 2. L'ajouter à la config dans game.component.ts
scene: [MenuScene, GameScene]
```

### Accéder au PhaserService depuis un autre composant
```typescript
import { inject } from '@angular/core';
import { PhaserService } from '@app/core/services/phaser.service';

export class AnotherComponent {
  private readonly phaserService = inject(PhaserService);
  
  pauseGame(): void {
    const gameScene = this.phaserService.getScene('GameScene');
    gameScene?.scene.pause();
  }
}
```

## 📊 Comparaison avant/après

| Aspect | Avant | Après |
|--------|-------|-------|
| Fichiers | 1 fichier monolithique | 6 fichiers organisés |
| Lignes par fichier | ~350 lignes | ~50-200 lignes |
| Responsabilités | Tout dans App | Séparées par domaine |
| Testabilité | Difficile | Facile (services isolés) |
| Réutilisabilité | Faible | Élevée |
| Maintenance | Complexe | Simple |

## 🎓 Bonnes pratiques appliquées

1. **SOLID Principles**
   - Single Responsibility ✅
   - Open/Closed ✅
   - Dependency Inversion ✅

2. **Angular 21 Best Practices**
   - Signals pour la réactivité ✅
   - inject() au lieu de constructor DI ✅
   - Standalone components ✅
   - styleUrl au singulier ✅

3. **Clean Code**
   - Noms descriptifs ✅
   - Méthodes courtes ✅
   - Documentation JSDoc ✅
   - Typage strict ✅

## 🔄 Prochaines étapes recommandées

1. **Tests unitaires** : Ajouter des tests pour chaque service/composant
2. **Configuration externalisée** : Déplacer les configs dans des fichiers dédiés
3. **State management** : Ajouter un service pour gérer l'état du jeu
4. **Assets management** : Créer un service pour charger les assets
5. **Event system** : Implémenter un système d'événements custom
