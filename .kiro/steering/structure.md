# Project Structure

```
MyFirstAngular/
├── src/
│   ├── app/
│   │   ├── app.ts           # Root component (class named App, selector: app-root)
│   │   ├── app.html         # Root component template
│   │   ├── app.css          # Root component styles
│   │   ├── app.config.ts    # Application config (providers, router setup)
│   │   ├── app.routes.ts    # Top-level route definitions
│   │   └── app.spec.ts      # Root component tests
│   ├── index.html           # HTML shell
│   ├── main.ts              # Bootstrap entry point
│   └── styles.css           # Global styles
├── public/                  # Static assets (copied as-is to output)
├── angular.json             # Angular CLI workspace config
├── tsconfig.json            # Base TypeScript config
├── tsconfig.app.json        # App-specific TS config
└── tsconfig.spec.json       # Test-specific TS config
```

## Conventions

- **Standalone components only** — do not use NgModules. Every component, directive, and pipe is standalone and declares its own `imports`.
- **File naming**: use kebab-case for filenames (e.g. `user-profile.ts`, `user-profile.html`). Component class files omit the `.component` infix (e.g. `app.ts` not `app.component.ts`) — follow this pattern for new files.
- **Component structure**: each component gets its own folder under `src/app/` containing `.ts`, `.html`, and `.css` files.
- **Routing**: add new routes to `src/app/app.routes.ts`. Use lazy-loaded routes (`loadComponent`) for feature components.
- **Services**: place injectable services in `src/app/` or a `src/app/services/` subfolder. Use `providedIn: 'root'` unless scoped injection is needed.
- **Selector prefix**: all component selectors must use the `app-` prefix (e.g. `app-user-profile`).
- **Templates**: use Angular control flow syntax (`@if`, `@for`, `@switch`) — not `*ngIf` / `*ngFor` directives.
