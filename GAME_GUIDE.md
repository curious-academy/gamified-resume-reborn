# Jeu 2D Style Final Fantasy 6

## 🎮 Contrôles

- **Flèches directionnelles** : Déplacer le personnage
  - ⬆️ Flèche haut : Marcher vers le haut (personnage bleu)
  - ⬇️ Flèche bas : Marcher vers le bas (personnage vert)  
  - ⬅️ Flèche gauche : Marcher vers la gauche (personnage rouge)
  - ➡️ Flèche droite : Marcher vers la droite (personnage jaune)

## 🗺️ Carte

- **Fond vert** : Zones marchables (herbe)
- **Blocs gris** : Murs et obstacles (collision activée)
- Le personnage ne peut pas traverser les murs
- La caméra suit automatiquement le personnage

## ✨ Fonctionnalités

- **Mouvement fluide** : 150 pixels/seconde
- **Changement de direction visuel** : La couleur du personnage change selon la direction
- **Effet de mouvement** : Légère transparence animée pendant le déplacement
- **Caméra intelligente** : Suit le joueur avec un zoom adapté
- **Collisions** : Système de physique Arcade de Phaser
- **Monde borné** : Le personnage ne peut pas sortir des limites de la carte

## 🎨 Style Final Fantasy 6

Ce jeu reproduit le style de déplacement classique de FF6 :
- Vue de dessus (top-down)
- Déplacement en 4 directions
- Personnage centré à l'écran
- Obstacles statiques sur la carte
- Système de tiles 32x32 pixels

## 🔧 Technique

Le jeu est développé avec :
- **Phaser 3** : Moteur de jeu 2D
- **Angular 21** : Framework frontend
- **TypeScript** : Langage de programmation
- **Physique Arcade** : Système de collisions et mouvement

## 🚀 Prochaines améliorations possibles

1. **Sprites animés** : Remplacer les rectangles colorés par de vrais sprites
2. **Cartes Tiled** : Utiliser Tiled Map Editor pour créer des cartes complexes
3. **Sons** : Ajouter des effets sonores et musique
4. **NPCs** : Personnages non-joueurs avec dialogues
5. **Objets collectibles** : Items à ramasser sur la carte
6. **Système de combat** : Batailles au tour par tour style FF6
