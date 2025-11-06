// src/app/components/Pages/clieant-feeds/news-details/news-details.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedService } from '../../../../Services/feed.service';
import { FeedDetail } from '../../../../models/FeedDetails';
import { environment } from '../../../../environments/environment';
import { Category } from '../../../../models/Categories';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.css']
})
export class NewsDetailsComponent implements OnInit {
  feed: FeedDetail | null = null;
  formattedDate: string = '';
  primaryContent: string = '';
  loading = true;
  originalLink: string | null = null; // ✅ Added missing property
  apiUrl = environment.apiBaseUrl2;
  

  constructor(
    private route: ActivatedRoute,
    private feedService: FeedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.feedService.getFeedById(id).subscribe({
        next: (response) => {
          // Handle the new backend response format
          if (response.success && response.content) {
            const content = response.content;
            // Map backend camelCase to component PascalCase format
            this.feed = {
              Id: content.id,
              Title: content.title || '',
              Summary: content.summary,
              Content: content.content,
              ImageUrl: content.imageUrl,
              Category: content.category,
              Language: content.language,
              PublishedAt: content.publishedDate,
              PubDate: content.publishedDate,
              WriterId: content.writerId,
              WriterName: content.writerName
            };
          } else {
            // Fallback for old format (if needed)
            this.feed = response;
          }
          // ✅ Safely set the original link from possible fields
          this.originalLink = this.feed?.Link || this.feed?.SourceUrl || null;
          this.formatFeedDetails();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }
  getCategoryName(category: Category): string {
    return Category[category] || 'Unknown';
  }
  formatFeedDetails(): void {
    if (!this.feed) return;

    const dateStr = this.feed.PublishedAt || this.feed.PubDate;
    if (dateStr) {
      this.formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    this.primaryContent = this.getCleanContent(this.feed);
  }

  getCleanContent(feed: FeedDetail): string {
    let content = feed.Content || '';
    const rawDataSeparator = '--- RAW DATA ---';
    if (content.includes(rawDataSeparator)) {
      content = content.substring(0, content.indexOf(rawDataSeparator)).trim();
      if (!content) {
        try {
          const rawJsonStr = feed.Content?.split(rawDataSeparator)[1]?.trim();
          if (rawJsonStr) {
            const rawObj = JSON.parse(rawJsonStr);
            content = rawObj.description || rawObj.content || '';
          }
        } catch (e) {
          console.warn('Failed to parse RAW DATA', e);
        }
      }
    }
    return content;
  }

  goBack(): void {
    this.router.navigate(['/africa']);
  }
}
