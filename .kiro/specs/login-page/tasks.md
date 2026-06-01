# Implementation Plan: Login Page

## Overview

Implement credential-based authentication for the MyFirstAngular application by adding `AuthService`, a `LoginPage` component, a `WelcomePage` component, an `authGuard`, and updated route configuration. All components are standalone, lazy-loaded, and written in strict TypeScript following the project's Angular 20 conventions.

## Tasks

- [x] 1. Implement AuthService
  - [x] 1.1 Create `src/app/services/auth.service.ts` with `AuthService`
    - Declare `private readonly authState = new BehaviorSubject<string | null>(null)`
    - Expose `readonly currentUser$: Observable<string | null>` from the subject
    - Implement `getCurrentUser(): string | null` returning the current BehaviorSubject value
    - Implement `validate(username: string, password: string): boolean` — returns `true` only when `username === 'admin'` AND `password === 'pwd'`; returns `false` for blank/whitespace-only inputs without performing a string comparison
    - Implement `login(username: string): void` that calls `authState.next(username)`
    - Implement `logout(): void` that calls `authState.next(null)`
    - Decorate with `@Injectable({ providedIn: 'root' })`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x]* 1.2 Write property test for `AuthService.validate` (Property 1)
    - Add `fast-check` as a dev dependency (`npm install --save-dev fast-check`)
    - Create `src/app/services/auth.service.spec.ts`
    - **Property 1: Credential Validation Correctness** — for any `username` and `password` strings, `validate(username, password)` returns `true` if and only if `username === 'admin'` AND `password === 'pwd'`
    - Use `fc.assert(fc.property(fc.string(), fc.string(), ...))` with `{ numRuns: 100 }`
    - Tag with comment: `// Feature: login-page, Property 1: validate returns true iff username==='admin' AND password==='pwd'`
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**

  - [x]* 1.3 Write unit tests for `AuthService`
    - Cover: `validate('admin', 'pwd')` → `true`
    - Cover: `validate('admin', 'wrong')` → `false`
    - Cover: `validate('', 'pwd')` → `false` (blank username)
    - Cover: `validate('admin', '')` → `false` (blank password)
    - Cover: `validate('   ', 'pwd')` → `false` (whitespace-only username)
    - Cover: `login('admin')` sets `getCurrentUser()` to `'admin'` and `currentUser$` emits `'admin'`
    - Cover: `logout()` sets `getCurrentUser()` to `null` and `currentUser$` emits `null`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2. Implement LoginPage component
  - [x] 2.1 Create `LoginPage` component files
    - Create `src/app/login-page/login-page.ts`, `login-page.html`, `login-page.css`
    - Declare as `standalone: true` with `imports: [ReactiveFormsModule]`
    - Use selector `app-login-page`
    - Define typed `FormGroup<{ username: FormControl<string>; password: FormControl<string> }>`
    - Declare `protected errorMessage: string | null = null`
    - Inject `AuthService` and `Router`
    - Subscribe to `form.valueChanges` in the constructor to set `errorMessage = null` whenever either field changes (Requirement 4.3)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.2 Implement `onSubmit()` method on `LoginPage`
    - Set `this.errorMessage = null` at the start of every call (Requirement 4.4)
    - Call `authService.validate(username, password)`
    - On success: call `authService.login(username)`, then `await router.navigate(['/welcome'])`; if the promise resolves to `false` or rejects, set `errorMessage` to `'Navigation failed. Please try again.'`
    - On failure: set `errorMessage` to `'Invalid username or password. Please try again.'`
    - _Requirements: 2.1, 3.1, 3.3, 4.1, 4.4_

  - [x] 2.3 Write `LoginPage` template (`login-page.html`)
    - Render `<form (ngSubmit)="onSubmit()">` with a username text input, a password input (`type="password"`), and a submit button (`type="submit"`, label "Login")
    - Associate labels using `for`/`id` pairing ("Username" → `#username`, "Password" → `#password`)
    - Use `@if (errorMessage)` to conditionally render the error banner
    - Bind form controls with `formControlName`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.1, 4.2_

  - [x]* 2.4 Write property tests for `LoginPage` (Properties 2 and 3)
    - Create `src/app/login-page/login-page.spec.ts` (or extend it)
    - **Property 2: Username Preserved After Failed Login** — for any non-empty username string, after a failed submission the `#username` input still displays that username
    - Tag: `// Feature: login-page, Property 2: username field preserves value after failed login`
    - **Property 3: Input Change Dismisses Error** — for any string typed into username or password while `errorMessage` is set, `errorMessage` becomes `null`
    - Tag: `// Feature: login-page, Property 3: typing any value into either field clears the error message`
    - Use `fc.assert` with `{ numRuns: 100 }` for both properties
    - **Validates: Requirements 4.1, 4.3**

  - [x]* 2.5 Write unit tests for `LoginPage`
    - Cover: form renders username input, password input, and submit button
    - Cover: password input has `type="password"`
    - Cover: submit button has `type="submit"` and text "Login"
    - Cover: labels are correctly associated with inputs via `for`/`id`
    - Cover: submitting valid credentials calls `AuthService.validate`, then `AuthService.login`, then `Router.navigate(['/welcome'])`
    - Cover: submitting invalid credentials displays error message
    - Cover: error message is cleared at the start of re-submission (before auth response)
    - Cover: all form controls remain enabled while error is displayed
    - Cover: `Router.navigate` returning `false` displays navigation-failure error
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.3, 4.1, 4.2, 4.3, 4.4_

- [x] 3. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement WelcomePage component
  - [x] 4.1 Create `WelcomePage` component files
    - Create `src/app/welcome-page/welcome-page.ts`, `welcome-page.html`, `welcome-page.css`
    - Declare as `standalone: true` with `imports: [AsyncPipe]`
    - Use selector `app-welcome-page`
    - Inject `AuthService` and `Router`
    - Build `protected readonly greeting$: Observable<string>` by piping `authService.currentUser$` through `map(user => user ? \`Hello ${user}, Welcome to Kiro\` : 'Hello Admin, Welcome to Kiro')`
    - Subscribe to `authService.currentUser$` in `ngOnInit` using `takeUntilDestroyed()`; when it emits `null`, call `router.navigate(['/login'])` (session expiry, Requirement 6.3)
    - _Requirements: 5.1, 5.2, 5.3, 6.3_

  - [x] 4.2 Write `WelcomePage` template (`welcome-page.html`)
    - Use `@if (authService.getCurrentUser())` to guard the greeting block (Requirement 5.3)
    - Inside the guarded block, render `{{ greeting$ | async }}` in an element with `data-testid="greeting"`
    - _Requirements: 5.1, 5.2, 5.3_

  - [x]* 4.3 Write property test for `WelcomePage` (Property 4)
    - Create `src/app/welcome-page/welcome-page.spec.ts` (or extend it)
    - **Property 4: Greeting Format Correctness** — for any non-empty username string stored as the authenticated user, the element with `data-testid="greeting"` displays exactly `"Hello [username], Welcome to Kiro"`
    - Tag: `// Feature: login-page, Property 4: greeting is "Hello [username], Welcome to Kiro" for any username`
    - Use `fc.assert(fc.property(fc.string({ minLength: 1 }), ...))` with `{ numRuns: 100 }`
    - **Validates: Requirements 5.1**

  - [x]* 4.4 Write unit tests for `WelcomePage`
    - Cover: renders `"Hello admin, Welcome to Kiro"` when `currentUser$` emits `'admin'`
    - Cover: renders `"Hello Admin, Welcome to Kiro"` when `currentUser$` emits `null`
    - Cover: does not render personalised greeting when unauthenticated
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 5. Implement authGuard and update route configuration
  - [x] 5.1 Create `authGuard` in `src/app/guards/auth.guard.ts`
    - Export `authGuard` as a `CanActivateFn`
    - Inject `AuthService` and `Router` via `inject()`
    - Return `authService.currentUser$.pipe(take(1), map(user => user !== null ? true : router.createUrlTree(['/login'])))`
    - _Requirements: 6.1, 6.2_

  - [x] 5.2 Update `src/app/app.routes.ts` with all three routes
    - Add `{ path: '', redirectTo: 'login', pathMatch: 'full' }` (Requirement 7.1)
    - Add `{ path: 'login', loadComponent: () => import('./login-page/login-page').then(m => m.LoginPage) }`
    - Add `{ path: 'welcome', loadComponent: () => import('./welcome-page/welcome-page').then(m => m.WelcomePage), canActivate: [authGuard] }`
    - _Requirements: 3.1, 3.2, 6.1, 6.2, 7.1_

  - [x]* 5.3 Write unit tests for `authGuard`
    - Create `src/app/guards/auth.guard.spec.ts`
    - Cover: returns `true` when `AuthService.getCurrentUser()` is non-null
    - Cover: returns `UrlTree` for `/login` when `AuthService.getCurrentUser()` is `null`
    - _Requirements: 6.1, 6.2_

  - [x]* 5.4 Write route configuration integration tests
    - Cover: navigating to `/` redirects to `/login`
    - Cover: navigating to `/welcome` without auth redirects to `/login`
    - Cover: navigating to `/welcome` with auth renders `WelcomePage`
    - _Requirements: 3.2, 6.1, 6.2, 7.1_

- [x] 6. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- `fast-check` must be installed before running property tests: `npm install --save-dev fast-check`
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at logical boundaries
- Property tests validate universal correctness properties using `fc.assert` with `{ numRuns: 100 }`
- Unit tests validate specific examples and edge cases
- All components are standalone — no NgModules

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3"] },
    { "id": 3, "tasks": ["2.4", "2.5", "4.1", "5.1"] },
    { "id": 4, "tasks": ["4.2", "5.2"] },
    { "id": 5, "tasks": ["4.3", "4.4", "5.3", "5.4"] }
  ]
}
```
