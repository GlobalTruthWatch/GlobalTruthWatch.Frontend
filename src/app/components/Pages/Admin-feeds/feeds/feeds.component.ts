import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Feed } from '../../../../models/feed';
import { FeedService } from '../../../../Services/feed.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-feeds',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent {
  feeds: Feed[] = [];
  filtered: Feed[] = [];
  loading = true;
  error: string | null = null;

  searchCtl = new FormControl('');
  category = 'All';
  displayCount = 12;

  placeholderImg = 'assets/image1.png';

  categoryNames: Record<number, string> = {
    0: 'Africa',
    1: 'Americas',
    2: 'Asia',
    3: 'Europe',
    4: 'MiddleEast',
    5: 'Oceania',
    6: 'World'
  };

  constructor(
    private feedService: FeedService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.searchCtl.valueChanges.pipe(debounceTime(250)).subscribe(() => this.applyFilters());
    this.loadFeeds();
  }

  private loadFeeds() {
    this.loading = true;
    this.feedService.getAllFeeds().subscribe({
      next: (res) => {
        this.feeds = res.sort((a: Feed, b: Feed) => {
          const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return db - da;
        });
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message ?? 'Failed to load feeds';
        this.loading = false;
      }
    });
  }

  get categories(): string[] {
    const cats = Array.from(new Set(
      this.feeds.map(f => f.category !== undefined ? this.categoryNames[f.category] : 'Uncategorized')
    ));
    return ['All', ...cats];
  }

  applyFilters() {
    const q = (this.searchCtl.value ?? '').toString().trim().toLowerCase();
    const cat = this.category;

    this.filtered = this.feeds.filter(f => {
      const feedCategoryString = f.category !== undefined ? this.categoryNames[f.category] : 'Uncategorized';
      const inCat = cat === 'All' ? true : feedCategoryString === cat;
      if (!inCat) return false;
      if (!q) return true;

      const hay = [
        f.title, f.summary, f.content, f.sourceName, f.author
      ].filter(Boolean).join(' ').toLowerCase();

      return hay.includes(q);
    });
  }

  // Fix: HTMLImageElement cast removed, use any
  onImageError(event: Event) {
    const img = event.target as any;
    if (img) img.src = this.placeholderImg;
  }

  getImageUrl(feed: Feed): string {
    return feed.imageUrl && feed.imageUrl.trim() !== '' ? feed.imageUrl : this.placeholderImg;
  }

  setCategory(c: string) {
    this.category = c;
    this.applyFilters();
  }

  showMore() {
    this.displayCount += 12;
  }

  // Fix: cast window as any
//   openExternal(url?: string) {
//     if (!url) return;
//     if (isPlatformBrowser(this.platformId)) {
//       (window as any).open(url, '_blank');
//     }
//   }

  truncate(text?: string | null, len = 140) {
    if (!text) return '';
    return text.length > len ? text.slice(0, len).trim() + '…' : text;
  }
}
