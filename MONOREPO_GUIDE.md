# Angular Monorepo Guide

## Overview

This project uses an Angular 21 (next version) monorepo architecture, allowing multiple applications and libraries to coexist in the same workspace. This setup enables:

- **Code Sharing**: Libraries can be shared across multiple applications
- **Unified Dependencies**: All projects share the same node_modules and Angular version
- **Simplified Maintenance**: Update dependencies once for all projects
- **Better Development Experience**: Build and test related projects together

## Architecture

```
gamified-resume-reborn/
├── projects/
│   ├── main-app/          # Main application
│   │   ├── src/
│   │   │   ├── app/       # Application components
│   │   │   ├── index.html
│   │   │   ├── main.ts
│   │   │   └── styles.scss
│   │   ├── tsconfig.app.json
│   │   └── tsconfig.spec.json
│   │
│   └── shared-ui/         # Shared UI library
│       ├── src/
│       │   ├── lib/       # Library components
│       │   └── public-api.ts  # Public exports
│       ├── ng-package.json
│       ├── package.json
│       └── tsconfig.lib.json
│
├── angular.json           # Workspace configuration
├── package.json          # Root dependencies
└── tsconfig.json        # Root TypeScript config
```

## Working with Applications

### Create a New Application

```bash
ng generate application <app-name> --routing --style=scss
```

This creates a new application in `projects/<app-name>/`.

### Serve an Application

```bash
# Using npm script (for main-app)
npm start

# Using Angular CLI directly
ng serve <app-name>
```

### Build an Application

```bash
# Build specific application
ng build <app-name>

# Build with production configuration
ng build <app-name> --configuration production
```

### Test an Application

```bash
ng test <app-name>
```

## Working with Libraries

### Create a New Library

```bash
ng generate library <library-name>
```

This creates a new library in `projects/<library-name>/`.

### Generate Components in a Library

```bash
ng generate component <component-name> --project=<library-name> --export
```

The `--export` flag automatically adds the component to the library's public API.

### Build a Library

```bash
# Development build
ng build <library-name>

# Production build
ng build <library-name> --configuration production
```

### Using a Library in an Application

1. Build the library first:
   ```bash
   ng build shared-ui
   ```

2. Import from the library in your application:
   ```typescript
   import { Button } from 'shared-ui';
   ```

3. Use in your component:
   ```typescript
   @Component({
     selector: 'app-root',
     imports: [Button],
     template: '<lib-button [label]="\'Click me\'" />'
   })
   export class App { }
   ```

## Best Practices

### Library Development

1. **Public API**: Always export components through `public-api.ts`
   ```typescript
   // projects/shared-ui/src/public-api.ts
   export * from './lib/button/button';
   ```

2. **Rebuild After Changes**: When developing a library, rebuild it after making changes so applications can use the latest version

3. **Version Management**: Libraries use semantic versioning in their package.json

### Application Development

1. **Import from Libraries**: Always import from the library name, not relative paths
   ```typescript
   // Good
   import { Button } from 'shared-ui';
   
   // Bad
   import { Button } from '../../../shared-ui/src/lib/button/button';
   ```

2. **Build Order**: Libraries must be built before applications that depend on them

## NPM Scripts

The root `package.json` includes helpful scripts:

```bash
# Start main application
npm start

# Build main application
npm run build

# Build shared library
npm run build:lib

# Build all projects
npm run build:all

# Test main application
npm run test:main-app

# Test shared library
npm run test:lib
```

## Adding Dependencies

### Workspace Dependencies

Add to the root `package.json`:
```bash
npm install <package-name>
```

### Library-Specific Dependencies

For peer dependencies in libraries, update the library's `package.json`:
```json
{
  "peerDependencies": {
    "@angular/common": "^21.0.0-next.0",
    "@angular/core": "^21.0.0-next.0"
  }
}
```

## TypeScript Path Mapping

The workspace automatically configures TypeScript path mappings for libraries in `tsconfig.json`:

```json
{
  "paths": {
    "shared-ui": [
      "dist/shared-ui"
    ]
  }
}
```

This allows importing from libraries by name.

## Angular Configuration

The `angular.json` file defines all projects in the workspace. Each project has:

- **projectType**: `application` or `library`
- **root**: Project root directory
- **sourceRoot**: Source files directory
- **architect**: Build, serve, test configurations

## Troubleshooting

### Library Changes Not Reflected

Rebuild the library:
```bash
ng build <library-name>
```

### Cannot Find Module

Ensure:
1. Library is built: `ng build <library-name>`
2. Path is correct in `tsconfig.json`
3. Import statement uses library name, not relative path

### Build Errors

Try:
```bash
# Clean builds
rm -rf dist/

# Rebuild everything
npm run build:all
```

## Next Steps

1. Create more specialized libraries (e.g., `core`, `shared-services`, `feature-modules`)
2. Add more applications as needed
3. Set up CI/CD to build and test all projects
4. Consider adding Nx or other monorepo tools for advanced features

## Resources

- [Angular Workspace Configuration](https://angular.dev/reference/configs/workspace-config)
- [Angular Libraries](https://angular.dev/tools/libraries)
- [Angular CLI](https://angular.dev/tools/cli)
