import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../../Services/auth.service';

declare const google: any; // Google Identity Services SDK

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  loginForm: FormGroup;
  serverError: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngAfterViewInit(): void {
    this.initGoogleSignIn();
  }

  private initGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: '498969207883-os0gf7vs10g5rcekdlo6rtd316ubatqc.apps.googleusercontent.com', // Replace with your Client ID
      callback: (response: any) => this.handleGoogleResponse(response)
    });

    const googleBtn = document.getElementById('googleSignInBtn');
    if (googleBtn) {
      google.accounts.id.renderButton(googleBtn, {
        theme: 'outline',
        size: 'large',
        width: '100%'
      });
    }

    google.accounts.id.prompt(); // Show One Tap if available
  }

  triggerGoogleSignIn(): void {
    google.accounts.id.prompt(); // Show Google One Tap manually
  }

  private handleGoogleResponse(response: any): void {
    if (!response?.credential) return;

    this.loading = true;
    this.authService.loginWithGoogle(response.credential)
      .pipe(
        catchError(err => {
          this.serverError = err?.error?.message ?? 'Google login failed.';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(res => {
        this.loading = false;
        if (res?.success) this.router.navigate(['/']);
      });
  }

  onSubmit(): void {
    this.serverError = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.loginForm.value;

    this.authService.login(payload)
      .pipe(
        catchError(err => {
          this.serverError = err?.error?.message ?? 'Login failed.';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(res => {
        this.loading = false;
        if (res?.success) this.router.navigate(['/']);
      });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
