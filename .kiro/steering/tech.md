# Tech Stack

## Framework & Language
- **Angular 20** (standalone components API)
- **TypeScript 5.8** with strict mode enabled (`strict`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature`)
- **RxJS 7.8**
- **Zone.js 0.15** for change detection (event coalescing enabled)

## Build System
- **Angular CLI 20** with `@angular/build:application` builder (esbuild-based)
- Entry point: `src/main.ts`
- Global styles: `src/styles.css`
- Static assets served from `public/`
- Production builds use output hashing; development builds include source maps

## Testing
- **Karma** test runner with **Jasmine** framework
- Coverage via `karma-coverage`

## Code Formatting
- **Prettier** configured with the `angular` HTML parser for `.html` files

## Common Commands

```bash
# Start dev server (localhost:4200)
ng serve

# Production build (outputs to dist/)
ng build

# Development build with watch mode
ng build --watch --configuration development

# Run unit tests
ng test

# Generate a new component
ng generate component <name>

# Generate a new service
ng generate service <name>
```
