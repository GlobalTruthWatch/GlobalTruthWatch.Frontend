import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { FeedDetail } from '../models/FeedDetails';
import { Feed } from '../models/feed';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private baseUrl = `${environment.apiBaseUrl}/feeds`;

  constructor(private http: HttpClient) {}

  /** Get all feeds */
  getAllFeeds(): Observable<Feed[]> {
    return this.http.get<Feed[]>(this.baseUrl);
  }

// src/app/Services/feed.service.ts

getFeedById(id: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/${id}`);
}

  /** Get feeds by category */
  getFeedsByCategory(category: string | number): Observable<Feed[]> {
    return this.http.get<Feed[]>(`${this.baseUrl}/category/${category}`);
  }
}
