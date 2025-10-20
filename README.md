# gamified-resume-reborn
A world to learn, a real world, in 2D

## Angular Monorepo Workspace

This project is built with Angular 21 (next version) in a monorepo architecture where libraries and applications live together under the same workspace.

### Project Structure

```
projects/
├── main-app/        # Main application
└── shared-ui/       # Shared UI library
```

### Prerequisites

- Node.js v20.19.5 or higher
- npm 10.8.2 or higher
- Angular CLI 21.0.0-next.8

### Installation

```bash
npm install
```

### Development

#### Start the main application
```bash
npm start
# or
ng serve main-app
```

#### Build projects
```bash
# Build main application
npm run build
# or
ng build main-app

# Build shared library
npm run build:lib
# or
ng build shared-ui

# Build all projects
npm run build:all
```

### Testing

```bash
# Test main application
npm run test:main-app

# Test shared library
npm run test:lib
```

### Adding New Projects

#### Add a new application
```bash
ng generate application <app-name> --routing --style=scss
```

#### Add a new library
```bash
ng generate library <lib-name>
```

### Technology Stack

- **Angular**: 21.0.0-next.8
- **TypeScript**: 5.9.3
- **RxJS**: 7.8.2
- **Package Manager**: npm
- **Styling**: SCSS

