import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  serverError: string | null = null;
  loading = false;
  showPassword = false; // ✅ للتحكم في إظهار أو إخفاء الباسورد

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.serverError = null;
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.signupForm.value;

    this.authService.register(payload)
      .pipe(
        catchError(err => {
          this.serverError = err?.error?.message ?? 'Registration failed.';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(res => {
        this.loading = false;
        if (res?.success) {
          this.router.navigate(['/Login']);
        }
      });
  }

  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
}
