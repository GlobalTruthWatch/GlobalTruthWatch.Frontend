import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../Services/user.service';
import { AuthService } from '../../../../Services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-myprofile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf],
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyProfileComponent implements OnInit {
  userForm!: FormGroup;
  passwordForm!: FormGroup;
  loading: boolean = false;
  pwdLoading: boolean = false;
  successMsg: string = '';
  errorMsg: string = '';
  pwdSuccessMsg: string = '';
  pwdErrorMsg: string = '';
  showPasswordForm: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.loadUserData();
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  loadUserData() {
    const token = this.authService.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        payload['nameid'] ||
        payload['id'];

      if (userId) {
        this.loading = true;
        this.userService.getUserById(userId).subscribe({
          next: (res: any) => {
            const user = res.content ?? res;
            this.userForm.patchValue({
              name: user.name,
              email: user.email
            });
            this.loading = false;
          },
          error: err => {
            console.error('Error loading user', err);
            this.errorMsg = 'Failed to load user data.';
            this.loading = false;
          }
        });
      }
    } catch (e) {
      console.error('Invalid token structure', e);
      this.errorMsg = 'Invalid authentication token.';
    }
  }

  updateProfile() {
    if (this.userForm.invalid) return;

    const token = this.authService.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        payload['nameid'] ||
        payload['id'];

      if (userId) {
        this.loading = true;
        this.successMsg = '';
        this.errorMsg = '';

        this.userService.updateUser(userId, this.userForm.value).subscribe({
          next: (res: any) => {
            this.successMsg = res.message || 'Profile updated successfully.';
            this.loading = false;
          },
          error: err => {
            console.error('Update failed', err);
            this.errorMsg = 'Failed to update profile.';
            this.loading = false;
          }
        });
      }
    } catch (e) {
      console.error('Invalid token structure', e);
      this.errorMsg = 'Invalid authentication token.';
    }
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    this.pwdSuccessMsg = '';
    this.pwdErrorMsg = '';
    this.passwordForm.reset();
  }

  updatePassword() {
    if (this.passwordForm.invalid) return;

    const token = this.authService.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
        payload['email'] ||
        payload['unique_name'];

      if (!email) return;

      this.pwdLoading = true;
      this.pwdSuccessMsg = '';
      this.pwdErrorMsg = '';

      const body = {
        email,
        token, 
        password: this.passwordForm.get('password')!.value
      };

      this.http.post(`${environment.apiBaseUrl}/auth/reset-password`, body)
        .subscribe({
          next: (res: any) => {
            this.pwdSuccessMsg = res.message || 'Password updated successfully.';
            this.pwdLoading = false;
            this.passwordForm.reset();
            this.showPasswordForm = false;
          },
          error: err => {
            console.error('Password update failed', err);
            this.pwdErrorMsg = 'Failed to update password.';
            this.pwdLoading = false;
          }
        });
    } catch (e) {
      console.error('Invalid token structure', e);
      this.pwdErrorMsg = 'Invalid authentication token.';
    }
  }
}
