import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.css',
})
export class WelcomePage implements OnInit {
  protected readonly greeting$: Observable<string>;

  constructor(
    protected readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.greeting$ = this.authService.currentUser$.pipe(
      map(user => (user ? `Hello ${user}, Welcome to Kiro` : 'Hello Admin, Welcome to Kiro')),
    );

    // Session expiry: navigate to /login when currentUser$ emits null (Requirement 6.3)
    this.authService.currentUser$
      .pipe(takeUntilDestroyed())
      .subscribe(user => {
        if (user === null) {
          this.router.navigate(['/login']);
        }
      });
  }

  ngOnInit(): void {}
}
