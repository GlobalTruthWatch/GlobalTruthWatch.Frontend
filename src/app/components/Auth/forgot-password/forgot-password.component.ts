import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading: boolean = false;
  successMsg: string = '';
  errorMsg: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.http.post(`${environment.apiBaseUrl}/auth/forgot-password`, this.forgotForm.value)
      .subscribe({
        next: (res: any) => {
          this.successMsg = res.message || 'Reset link sent successfully!';
          this.loading = false;
          this.forgotForm.reset();
        },
        error: err => {
          console.error(err);
          this.errorMsg = err.error?.message || 'Failed to send reset link.';
          this.loading = false;
        }
      });
  }
}
