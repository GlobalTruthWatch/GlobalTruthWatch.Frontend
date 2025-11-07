import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = environment.apiBaseUrl;
  private role: string | null = null;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {
    this.role = this.getRoleFromToken();
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, payload)
      .pipe(tap(res => this.handleAuthSuccess(res, payload.rememberMe ?? false)));
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/register`, payload)
      .pipe(tap(res => this.handleAuthSuccess(res, payload.rememberMe ?? false)));
  }

  loginWithGoogle(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/oauth/google`, { idToken })
    // return this.http.post<AuthResponse>(`http://localhost:5016/api/oauth/google`, { idToken })
      .pipe(tap(res => this.handleAuthSuccess(res, true)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    this.role = null;
  }

  private handleAuthSuccess(res: AuthResponse, remember: boolean): void {
    if (!res || !res.content?.token) return;

    const token = res.content.token;
    if (remember) localStorage.setItem(this.tokenKey, token);
    else sessionStorage.setItem(this.tokenKey, token);

    this.role = this.getRoleFromToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) ?? sessionStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    if (!this.role) {
      this.role = this.getRoleFromToken();
    }
    return this.role;
  }

  hasRole(expectedRole: string): boolean {
    return this.getRole()?.toLowerCase() === expectedRole.toLowerCase();
  }

  private getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['role']
        || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']
        || null;
    } catch (e) {
      console.error('Failed to decode JWT', e);
      return null;
    }
  }
}
