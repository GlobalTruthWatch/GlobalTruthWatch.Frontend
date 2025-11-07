import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading: boolean = false;
  successMsg: string = '';
  errorMsg: string = '';

  // Show/Hide password toggles
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatch });
  }

  ngOnInit() {
    // Get token & email from query params
    this.route.queryParams.subscribe(params => {
      const token = params['token'] || '';
      const email = params['email'] || '';
      this.resetForm.patchValue({ token, email });
    });
  }

  // Custom validator to check if passwords match
  passwordMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { notMatching: true };
  }

  // Form submit
  onSubmit() {
    if (this.resetForm.invalid) return;

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    const payload = {
      email: this.resetForm.value.email,
      token: this.resetForm.value.token,
      password: this.resetForm.value.password
    };

    this.http.post(`http://localhost:5016/api/auth/reset-password`, payload)
      .subscribe({
        next: (res: any) => {
          this.successMsg = res.message || 'Password reset successfully!';
          this.loading = false;
          this.resetForm.reset();
        },
        error: err => {
          console.error(err);
          this.errorMsg = err.error?.message || 'Failed to reset password.';
          this.loading = false;
        }
      });
  }

  // Toggle password visibility
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // toggleConfirmPassword() {
  //   this.showConfirmPassword = !this.showConfirmPassword;
  // }
}
