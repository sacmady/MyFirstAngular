import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'pwd';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authState = new BehaviorSubject<string | null>(null);

  /** Emits the authenticated username, or null when unauthenticated. */
  readonly currentUser$: Observable<string | null> = this.authState.asObservable();

  /** Returns the current username synchronously (for guard canActivate). */
  getCurrentUser(): string | null {
    return this.authState.getValue();
  }

  /**
   * Validates credentials against the Admin_Account.
   * Returns true on success, false on failure.
   * Blank (whitespace-only) username or password always returns false
   * without performing a string comparison.
   */
  validate(username: string, password: string): boolean {
    if (username.trim() === '' || password.trim() === '') {
      return false;
    }
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  }

  /** Stores the authenticated username after a successful login. */
  login(username: string): void {
    this.authState.next(username);
  }

  /** Clears authentication state (for session expiry / logout). */
  logout(): void {
    this.authState.next(null);
  }
}
