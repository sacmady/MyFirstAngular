import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  protected readonly form = new FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
  }>({
    username: new FormControl<string>('', { nonNullable: true }),
    password: new FormControl<string>('', { nonNullable: true }),
  });

  protected errorMessage: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.form.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });
  }

  protected async onSubmit(): Promise<void> {
    this.errorMessage = null; // clear before auth (Req 4.4)
    const { username, password } = this.form.getRawValue();
    const success = this.authService.validate(username, password);
    if (success) {
      this.authService.login(username);
      try {
        const navigated = await this.router.navigate(['/welcome']);
        if (!navigated) {
          this.errorMessage = 'Navigation failed. Please try again.';
        }
      } catch {
        this.errorMessage = 'Navigation failed. Please try again.';
      }
    } else {
      this.errorMessage = 'Invalid username or password. Please try again.';
    }
  }
}
