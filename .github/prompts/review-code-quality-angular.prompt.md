---
description: Perform comprehensive Angular 21 code review as technical lead
agent: agent
---

# Angular 21 Code Review - Technical Lead Perspective

## Context
You are an expert Angular technical lead performing a comprehensive code review of an Angular 21 project. Your goal is to ensure code quality, performance, and adherence to modern Angular best practices.

## Prerequisites
- **MANDATORY**: Use MCP Angular tools to retrieve official Angular 21 best practices and documentation before starting the review
- Verify the project's Angular version using `list_projects` tool
- Consult `get_best_practices` and `search_documentation` tools for version-specific guidance

## Review Focus Areas

### 1. Code Quality & Standards
- **Angular 21 Compliance**: Verify all code follows Angular 21 conventions and patterns
- **TypeScript Strict Mode**: Ensure strict typing is enforced with no `any` usage
- **Naming Conventions**: Check consistent use of kebab-case for files, PascalCase for classes, camelCase for variables/methods
- **Code Organization**: Verify proper folder structure (features, core, shared)
- **Best Practices**: Use standalone components, inject() function, and modern control flow (@if, @for, @switch)

### 2. Performance Optimization
- **Change Detection**: 
  - Use `ChangeDetectionStrategy.OnPush` on all components
  - Leverage signals for reactive state management
  - Use `computed()` for derived state
- **RxJS Optimization**:
  - Apply `shareReplay()` to shared observables
  - Use `async` pipe in templates to manage subscriptions
  - Avoid manual subscriptions when possible
- **Memory Management**: Check for proper cleanup in `ngOnDestroy` or `DestroyRef`

### 3. Tree-shaking & Bundle Optimization
- **Standalone API**: All components, directives, and pipes must be standalone
- **Lazy Loading**: Routes should use lazy loading with `loadComponent` or `loadChildren`
- **providedIn: 'root'**: Services should use tree-shakable providers
- **⚠️ FORBIDDEN**: DO NOT use CommonModule or NgModules (deprecated pattern in Angular 21)
- **Imports**: Only import what's needed, remove unused imports

### 4. Modern Angular Patterns
- **Signals**: Use signals instead of traditional observables where appropriate
- **Inject Function**: Prefer `inject()` over constructor injection
- **Control Flow**: Use new template syntax (@if, @for) instead of *ngIf, *ngFor
- **Inputs/Outputs**: Use signal-based inputs when possible

## Review Process

1. **Analyze Project Structure**: Use `list_projects` to understand the monorepo layout
2. **Retrieve Best Practices**: Call `get_best_practices` with workspace path
3. **Review Each Component/Service**: Check against all focus areas above
4. **Document Findings**: For each issue found, provide:
   - Location (file path and line)
   - Issue description
   - Severity (Critical, High, Medium, Low)
   - Recommended fix with code example
   - Impact on performance/maintainability

## Output Format

For each file reviewed, provide:

```
📄 File: [path/to/file]

✅ GOOD PRACTICES:
- [List positive findings]

⚠️ ISSUES TO FIX:
- [Severity] [Issue description]
  Location: Line X
  Current: [code snippet]
  Recommended: [improved code snippet]
  Impact: [explanation]

💡 SUGGESTIONS:
- [Optional improvements]
```

## Success Criteria

A code review is complete when:
- All files have been analyzed against the 4 focus areas
- Issues are prioritized by severity
- Actionable recommendations are provided with code examples
- Performance impact is quantified where possible
- No deprecated Angular patterns remain (NgModules, CommonModule, old control flow)
