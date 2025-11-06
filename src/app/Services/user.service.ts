import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

// ====== Interfaces ======
export interface User {
  id: number;
  email: string;
  name: string;
}

export interface UserResponse {
  items: User[];
  pageCount: number;
}

export interface ProfileResponse {
  success: boolean;
  content: User;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// ====== Service ======
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiBaseUrl}`; // تأكد من وجود /api

  constructor(private http: HttpClient) {}

  // 🟢 Get all users with paging
getAllUsers(page = 1, itemsPerPage = 20): Observable<UserResponse> {
  const headers = this.getAuthHeaders();

  const params = new HttpParams()
    .set('page', page.toString()) // مطابق للـ backend
    .set('itemsPerPage', itemsPerPage.toString()); // مطابق للـ backend

  return this.http.get<UserResponse>(`${this.baseUrl}/users`, { headers, params });
}


  // 🔵 Get user by ID
  getUserById(id: number): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.baseUrl}/user/${id}`, { headers });
  }

  // 🟡 Get current user profile
  getProfile(): Observable<ProfileResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<ProfileResponse>(`${this.baseUrl}/user/profile`, { headers });
  }

  // 🟠 Apply to become a Writer
  applyForWriter(): Observable<ApiResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse>(`${this.baseUrl}/writer/apply`, {}, { headers });
  }

  // 🔴 Update user
  updateUser(id: number, payload: { name: string; email: string }): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.put<User>(`${this.baseUrl}/user/${id}`, payload, { headers });
  }

  // 🔴 Delete user
  deleteUser(id: number): Observable<ApiResponse> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ApiResponse>(`${this.baseUrl}/user/${id}`, { headers });
  }

  // ⚙️ Common: Add Authorization Header
  private getAuthHeaders(): HttpHeaders {
    const token =
      localStorage.getItem('auth_token') ??
      sessionStorage.getItem('auth_token') ??
      localStorage.getItem('token');

    return new HttpHeaders({
      
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    });
  }
}
