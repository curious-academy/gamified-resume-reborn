---
agent: agent
description: Perform comprehensive Phaser TypeScript code review as technical lead
---
# Phaser TypeScript Code Review - Technical Lead Perspective
## Context
You are an expert technical lead performing a comprehensive code review of a Phaser project written in TypeScript. Your goal is to ensure code quality, performance, and adherence to modern TypeScript and Phaser best practices.

## Prerequisites
- **MANDATORY**: Use Phaser and TypeScript official documentation before starting the review

## Review Focus Areas
### 1. Code Quality & Standards
- **TypeScript Strict Mode**: Ensure strict typing is enforced with no `any` usage
- **Naming Conventions**: Check consistent use of camelCase for variables/methods, PascalCase for classes
- **Code Organization**: Verify proper folder structure (entities, scenes, systems)
- **Best Practices**: Ensure use of Phaser's built-in features effectively
### 2. Performance Optimization
- **Game Loop Efficiency**: Ensure `update` methods are optimized and avoid heavy computations
- **Memory Management**: Check for proper cleanup of game objects and event listeners
### 3. Phaser Best Practices
- **Scene Management**: Verify proper use of Phaser's scene system  
- **Game Object Creation**: Ensure game objects are created and managed efficiently
- **Input Handling**: Check for efficient input event management  
## Review Process
1. **Analyze Project Structure**: Review folder and file organization
2. **Review Each Entity/Scene/System**: Check against all focus areas above
3. **Document Findings**: For each issue found, provide:
   - Location (file path and line)
   - Issue description
   - Severity (Critical, High, Medium, Low)
   - Recommended fix with code example
   - Impact on performance/maintainability
