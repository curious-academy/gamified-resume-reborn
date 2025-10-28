---
mode: agent
---

# Prepare Pull Request with Copilot Review

## Objective
Create a professional pull request from the current branch and request an automated code review from GitHub Copilot.

## Steps to Execute

### 1. Verify Current State
- Check current branch and recent changes
- Identify associated issue (if any)
- Review modified, added, and deleted files

### 2. Create Pull Request
- **Title**: Clear and descriptive (following conventional commits if applicable)
- **Description**: Include:
  - 🎯 Context/Background
  - 📝 Changes made (with detailed list)
  - 🧪 Validation criteria
  - 📊 Impact (if applicable)
  - 🔗 Related issue link (if applicable)
- **Base branch**: Usually `main` (verify project conventions)
- **Head branch**: Current working branch

### 3. Request Copilot Review
- Automatically request GitHub Copilot to review the code
- Copilot will analyze:
  - Code quality and best practices
  - Potential issues and bugs
  - Security vulnerabilities
  - Performance improvements
  - Code style consistency

### 4. Confirmation
- Display PR number and URL
- Confirm Copilot review request
- Provide next steps (wait for review, address feedback, etc.)

## Output Format

```
✅ Pull Request créée avec succès !

📝 Détails de la PR
- Numéro: #[number]
- URL: [url]
- Titre: [title]
- Base: [base] ← Head: [head]

🤖 Review Copilot demandée
GitHub Copilot va analyser le code et fournir des suggestions d'amélioration.

📦 Contenu
- [X] fichiers modifiés
- [Y] fichiers créés
- [Z] fichiers supprimés

⏳ Prochaines étapes
1. Attendre la review de Copilot
2. Examiner les commentaires et suggestions
3. Apporter les corrections nécessaires
4. Demander une review humaine si besoin
```

## Notes
- The PR description should be in French (for user communication)
- Code and technical details remain in English
- Follow the project's contribution guidelines
- Ensure all validation criteria are met before creating the PR
