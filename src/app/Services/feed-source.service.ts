import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedSourceService {
  private baseUrl = `${environment.apiBaseUrl}/feedsource`;

  constructor(private http: HttpClient) {}

  /** ✅ Get all feed sources */
  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get`);
  }

  /** ✅ Create new feed source */
  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  /** ✅ Update feed source */
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, data);
  }

  /** ✅ Delete feed source */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}
