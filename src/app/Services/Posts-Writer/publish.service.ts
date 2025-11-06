import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PublishResponse } from '../../models/publish';
import { environment } from '../../environments/environment';

// نموذج للطلبات المعلقة
export interface PublishRequest {
  id: number;
  writer: {
    id: number;
    email: string | null;
    name: string;
  };
  publishContent: {
    id: number;
    title: string;
    summary: string;
    content: string;
    category: number;
    language: string;
    imageUrl: string;
  };
  approved: boolean;
  approvedDate: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PublishService {
  private listUrl = `${environment.apiBaseUrl}/publish/list`;
  private createUrl = `${environment.apiBaseUrl}/publish/create`;
  private pendingUrl = `${environment.apiBaseUrl}/publish/pending-requests`;
  private respondUrl = `${environment.apiBaseUrl}/publish/respond`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found! Please login first.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  // القديم: جلب جميع المنشورات
  getPublishes(): Observable<PublishResponse[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<PublishResponse[]>(this.listUrl, { headers })
      .pipe(catchError(err => {
        console.error('Error fetching publishes:', err);
        return throwError(() => err);
      }));
  }

  // القديم: إنشاء منشور جديد
  createPublish(formData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    // لا تحدد Content-Type للـ multipart/form-data، المتصفح يتعامل معها
    return this.http.post<any>(this.createUrl, formData, { headers })
      .pipe(catchError(err => {
        console.error('Error creating publish:', err);
        return throwError(() => err);
      }));
  }

  // جديد: جلب جميع الطلبات المعلقة
  getPendingRequests(): Observable<PublishRequest[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<PublishRequest[]>(this.pendingUrl, { headers })
      .pipe(catchError(err => {
        console.error('Error fetching pending requests:', err);
        return throwError(() => err);
      }));
  }

  // جديد: الرد على طلب معين (قبول / رفض)
  respondRequest(requestId: number, isAccepted: boolean): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.respondUrl, { requestId, isAccepted }, { headers })
      .pipe(catchError(err => {
        console.error('Error responding to request:', err);
        return throwError(() => err);
      }));
  }


getPublishesByWriter(writerId: number): Observable<PublishResponse[]> {
  const url = `${environment.apiBaseUrl}/publish/writer/${writerId}`;
  return this.http.get<PublishResponse[]>(url);
}


}
