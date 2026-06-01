import { TestBed } from '@angular/core/testing';
import * as fc from 'fast-check';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  // ── Unit tests ──────────────────────────────────────────────────────────────

  describe('validate()', () => {
    it('returns true for exact admin credentials', () => {
      expect(service.validate('admin', 'pwd')).toBe(true);
    });

    it('returns false for wrong password', () => {
      expect(service.validate('admin', 'wrong')).toBe(false);
    });

    it('returns false for blank username', () => {
      expect(service.validate('', 'pwd')).toBe(false);
    });

    it('returns false for blank password', () => {
      expect(service.validate('admin', '')).toBe(false);
    });

    it('returns false for whitespace-only username', () => {
      expect(service.validate('   ', 'pwd')).toBe(false);
    });
  });

  describe('login() and logout()', () => {
    it('login() sets getCurrentUser() to the given username', () => {
      service.login('admin');
      expect(service.getCurrentUser()).toBe('admin');
    });

    it('login() causes currentUser$ to emit the given username', (done) => {
      service.login('admin');
      service.currentUser$.subscribe(user => {
        expect(user).toBe('admin');
        done();
      });
    });

    it('logout() sets getCurrentUser() to null', () => {
      service.login('admin');
      service.logout();
      expect(service.getCurrentUser()).toBeNull();
    });

    it('logout() causes currentUser$ to emit null', (done) => {
      service.login('admin');
      service.logout();
      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  // ── Property-based tests ─────────────────────────────────────────────────────

  // Feature: login-page, Property 1: validate returns true iff username==='admin' AND password==='pwd'
  it('Property 1: returns true only for exact admin credentials (property test)', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (username, password) => {
        const expected = username === 'admin' && password === 'pwd';
        expect(service.validate(username, password)).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });
});
