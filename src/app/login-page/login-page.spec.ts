import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import * as fc from 'fast-check';
import { LoginPage } from './login-page';
import { AuthService } from '../services/auth.service';
import { routes } from '../app.routes';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let component: LoginPage;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // ── Unit tests: form structure ───────────────────────────────────────────────

  it('renders a username input', () => {
    const input = fixture.nativeElement.querySelector('#username') as HTMLInputElement;
    expect(input).toBeTruthy();
  });

  it('renders a password input', () => {
    const input = fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    expect(input).toBeTruthy();
  });

  it('renders a submit button', () => {
    const btn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(btn).toBeTruthy();
  });

  it('password input has type="password"', () => {
    const input = fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('submit button has text "Login"', () => {
    const btn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(btn.textContent?.trim()).toBe('Login');
  });

  it('username label is associated with the username input via for/id', () => {
    const label = fixture.nativeElement.querySelector('label[for="username"]') as HTMLLabelElement;
    expect(label).toBeTruthy();
    expect(label.textContent?.trim()).toBe('Username');
  });

  it('password label is associated with the password input via for/id', () => {
    const label = fixture.nativeElement.querySelector('label[for="password"]') as HTMLLabelElement;
    expect(label).toBeTruthy();
    expect(label.textContent?.trim()).toBe('Password');
  });

  // ── Unit tests: submission behaviour ────────────────────────────────────────

  it('submitting valid credentials calls validate, login, and navigate', fakeAsync(() => {
    spyOn(authService, 'validate').and.returnValue(true);
    spyOn(authService, 'login');
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    (component as any).form.setValue({ username: 'admin', password: 'pwd' });
    (component as any).onSubmit();
    tick();

    expect(authService.validate).toHaveBeenCalledWith('admin', 'pwd');
    expect(authService.login).toHaveBeenCalledWith('admin');
    expect(router.navigate).toHaveBeenCalledWith(['/welcome']);
  }));

  it('submitting invalid credentials displays error message', fakeAsync(() => {
    spyOn(authService, 'validate').and.returnValue(false);

    (component as any).form.setValue({ username: 'bad', password: 'bad' });
    (component as any).onSubmit();
    tick();
    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.error-banner') as HTMLElement;
    expect(banner).toBeTruthy();
    expect(banner.textContent).toContain('Invalid username or password');
  }));

  it('error message is cleared at the start of re-submission', fakeAsync(() => {
    // First: trigger an error
    spyOn(authService, 'validate').and.returnValue(false);
    (component as any).form.setValue({ username: 'bad', password: 'bad' });
    (component as any).onSubmit();
    tick();
    fixture.detectChanges();
    expect((component as any).errorMessage).toBe('Invalid username or password. Please try again.');

    // Second: re-submit — errorMessage should be null before validate returns
    let errorDuringValidate: string | null = 'not-checked';
    (authService.validate as jasmine.Spy).and.callFake(() => {
      errorDuringValidate = (component as any).errorMessage;
      return false;
    });
    (component as any).onSubmit();
    tick();

    expect(errorDuringValidate).toBeNull();
  }));

  it('all form controls remain enabled while error is displayed', fakeAsync(() => {
    spyOn(authService, 'validate').and.returnValue(false);
    (component as any).form.setValue({ username: 'bad', password: 'bad' });
    (component as any).onSubmit();
    tick();
    fixture.detectChanges();

    const usernameInput = fixture.nativeElement.querySelector('#username') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(usernameInput.disabled).toBeFalse();
    expect(passwordInput.disabled).toBeFalse();
    expect(submitBtn.disabled).toBeFalse();
  }));

  it('Router.navigate returning false displays navigation-failure error', fakeAsync(() => {
    spyOn(authService, 'validate').and.returnValue(true);
    spyOn(authService, 'login');
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(false));

    (component as any).form.setValue({ username: 'admin', password: 'pwd' });
    (component as any).onSubmit();
    tick();
    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.error-banner') as HTMLElement;
    expect(banner).toBeTruthy();
    expect(banner.textContent).toContain('Navigation failed');
  }));

  // ── Property-based tests ─────────────────────────────────────────────────────

  // Feature: login-page, Property 2: username field preserves value after failed login
  it('Property 2: username field preserves value after failed login for any username', fakeAsync(() => {
    spyOn(authService, 'validate').and.returnValue(false);

    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (username) => {
        (component as any).form.setValue({ username, password: 'wrong' });
        (component as any).onSubmit();
        tick();
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('#username') as HTMLInputElement;
        expect(input.value).toBe(username);
      }),
      { numRuns: 100 }
    );
  }));

  // Feature: login-page, Property 3: typing any value into either field clears the error message
  it('Property 3: typing any value into either field clears the error message', () => {
    fc.assert(
      fc.property(fc.string(), fc.boolean(), (newValue, changeUsername) => {
        // Set error state directly
        (component as any).errorMessage = 'some error';

        const control = changeUsername
          ? (component as any).form.get('username')
          : (component as any).form.get('password');
        control.setValue(newValue);

        expect((component as any).errorMessage).toBeNull();
      }),
      { numRuns: 100 }
    );
  });
});
