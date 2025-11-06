import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Subscriber {
  id: number;
  emailAddress: string;
  isActive: boolean;
  subscriptionDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  content: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {
  private baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  // ✅ Add new subscriber
  subscribe(emailAddress: string): Observable<ApiResponse<Subscriber>> {
    const body = { emailAddress };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ApiResponse<Subscriber>>(`${this.baseUrl}/subscribe`, body, { headers });
  }

  // 🔹 Get all subscribers
  getSubscribers(): Observable<Subscriber[]> {
    const headers = new HttpHeaders({ 'accept': 'application/json' });
    return this.http.get<Subscriber[]>(`${this.baseUrl}/subscribers`, { headers });
  }
}
