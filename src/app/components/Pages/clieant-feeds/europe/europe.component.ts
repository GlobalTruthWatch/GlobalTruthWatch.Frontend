import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedService } from '../../../../Services/feed.service';
import { NewsDetailsComponent } from '../news-details/news-details.component';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-europe',
  standalone: true,
  imports: [CommonModule , NewsDetailsComponent],
  templateUrl: './europe.component.html',
  styleUrls: ['./europe.component.css']
})
export class EuropeComponent implements OnInit {
  feeds: any[] = [];
  currentPage = 1;
  pageSize = 9;
  categoryId = 3;
  apiUrl = environment.apiBaseUrl2;

  constructor(private feedService: FeedService, private router: Router) {}
  ngOnInit(): void {
    this.apiUrl = environment.apiBaseUrl2;
    this.loadFeeds();
  }

  loadFeeds(): void {
    this.feedService.getFeedsByCategory(this.categoryId).subscribe({
      next: (data: any[]) => (this.feeds = data),
      error: (err) => console.error(err)
    });
  }

  get paginatedFeeds(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.feeds.slice(start, start + this.pageSize);
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.feeds.length / this.pageSize))
      .fill(0)
      .map((_, i) => i + 1);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  viewDetails(feedId: number) {
    this.router.navigate(['/news', feedId]);
  }
}
