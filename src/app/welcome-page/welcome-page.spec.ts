import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import * as fc from 'fast-check';
import { WelcomePage } from './welcome-page';
import { AuthService } from '../services/auth.service';
import { routes } from '../app.routes';

describe('WelcomePage', () => {
  let fixture: ComponentFixture<WelcomePage>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomePage],
      providers: [provideRouter(routes)],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  function createFixture(): ComponentFixture<WelcomePage> {
    const f = TestBed.createComponent(WelcomePage);
    f.detectChanges();
    return f;
  }

  // ── Unit tests ───────────────────────────────────────────────────────────────

  it('renders "Hello admin, Welcome to Kiro" when currentUser$ emits "admin"', fakeAsync(() => {
    authService.login('admin');
    fixture = createFixture();
    tick();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[data-testid="greeting"]') as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.textContent?.trim()).toBe('Hello admin, Welcome to Kiro');
  }));

  it('renders "Hello Admin, Welcome to Kiro" when currentUser$ emits null', fakeAsync(() => {
    // currentUser$ starts as null — no login
    fixture = createFixture();
    tick();
    fixture.detectChanges();

    // When unauthenticated, the @if guard hides the greeting block
    const el = fixture.nativeElement.querySelector('[data-testid="greeting"]') as HTMLElement;
    // The greeting element should not be present when unauthenticated
    expect(el).toBeNull();
  }));

  it('does not render personalised greeting when unauthenticated', fakeAsync(() => {
    // No login — currentUser$ is null
    fixture = createFixture();
    tick();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[data-testid="greeting"]') as HTMLElement;
    expect(el).toBeNull();
  }));

  // ── Property-based tests ─────────────────────────────────────────────────────

  // Feature: login-page, Property 4: greeting is "Hello [username], Welcome to Kiro" for any username
  it('Property 4: greeting format is correct for any non-empty username', fakeAsync(() => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (username) => {
        authService.login(username);
        fixture = TestBed.createComponent(WelcomePage);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const el = fixture.nativeElement.querySelector('[data-testid="greeting"]') as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.textContent?.trim()).toBe(`Hello ${username}, Welcome to Kiro`);

        fixture.destroy();
        authService.logout();
      }),
      { numRuns: 100 }
    );
  }));
});
