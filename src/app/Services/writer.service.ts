import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { WriterRequest, WriterType } from '../models/writer-requests';

export interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class WriterService {
  private baseUrl = `${environment.apiBaseUrl}/writer`;

  constructor(private http: HttpClient) {}

  // 🔄 Get all pending writer requests
  getPendingRequests(): Observable<WriterRequest[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<WriterRequest[]>(`${this.baseUrl}/pending-requests`, { headers });
  }

  // ✅ Accept writer application
  acceptApplication(applicationId: number, type: WriterType): Observable<ApiResponse> {
    const headers = this.getAuthHeaders();
    const body = { applicationId, accepted: true, type };
    return this.http.post<ApiResponse>(`${this.baseUrl}/application/accept`, body, { headers });
  }

  // ❌ Reject writer application
  rejectApplication(applicationId: number): Observable<ApiResponse> {
    const headers = this.getAuthHeaders();
    const body = { applicationId, accepted: false };
    return this.http.post<ApiResponse>(`${this.baseUrl}/application/accept`, body, { headers });
  }

  // 🔹 Get all writers (pending + accepted)
  getAllWriters(): Observable<WriterRequest[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<WriterRequest[]>(`${this.baseUrl}/request-list`, { headers });
  }



  // 🔹 Get all writers (new endpoint)
  getAllWritersList(): Observable<WriterRequest[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<WriterRequest[]>(`${this.baseUrl}/writers-list`, { headers });
  }

  // ✅ Remove writer by ID
  removeWriter(id: number): Observable<ApiResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<ApiResponse>(`${this.baseUrl}/remove/${id}`, {}, { headers });
  }

  // ⚙️ Common: Add Authorization Header
  private getAuthHeaders(): HttpHeaders {
    const token =
      localStorage.getItem('auth_token') ??
      sessionStorage.getItem('auth_token') ??
      localStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    });
  }
}
