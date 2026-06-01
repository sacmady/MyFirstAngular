import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { routes } from '../app.routes';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  // ── Unit tests ───────────────────────────────────────────────────────────────

  it('allows navigation when user is authenticated', (done) => {
    authService.login('admin');

    authService.currentUser$.pipe(take(1)).subscribe(user => {
      expect(user).toBe('admin');
      done();
    });
  });

  it('redirects to /login when user is not authenticated', async () => {
    await RouterTestingHarness.create('/welcome');
    expect(router.url).toBe('/login');
  });

  // ── Route integration tests ──────────────────────────────────────────────────

  it('navigating to / redirects to /login', async () => {
    await RouterTestingHarness.create('/');
    expect(router.url).toBe('/login');
  });

  it('navigating to /welcome without auth redirects to /login', async () => {
    await RouterTestingHarness.create('/welcome');
    expect(router.url).toBe('/login');
  });

  it('navigating to /welcome with auth renders WelcomePage', async () => {
    authService.login('admin');
    await RouterTestingHarness.create('/welcome');
    expect(router.url).toBe('/welcome');
  });
});
