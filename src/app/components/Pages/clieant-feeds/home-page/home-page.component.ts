import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FeedService } from '../../../../Services/feed.service';
import { Feed } from '../../../../models/feed';
import { environment } from '../../../../environments/environment';
import { Category } from '../../../../models/Categories';
import { interval, Subscription } from 'rxjs';

interface FeedMapped {
  id: number;
  title: string;
  description: string;
  author?: string;
  category?: Category;
  sourceName: string;
  publishedAt?: string;
  imageUrl: string;
  logoUrl?: string;
  writerId?: number | null;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  loading = true;
  mainHeadline: FeedMapped | null = null;
  quickTakes: FeedMapped[] = [];
  categories: { categor: Category; posts: FeedMapped[] }[] = [];
  latestHeadlines: FeedMapped[] = [];
  environment = environment;

  private feeds: FeedMapped[] = [];
  private rotationSub!: Subscription;
  private tickerSub!: Subscription;

  tickerIndex = 0;
  feedIndex = 0;
  currentTicker: string = '';

  constructor(
    private router: Router,
    private feedService: FeedService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.loadFeedsFromBackend();
  }

  ngOnDestroy(): void {
    if (this.rotationSub) this.rotationSub.unsubscribe();
    if (this.tickerSub) this.tickerSub.unsubscribe();
  }

  loadFeedsFromBackend(): void {
    this.feedService.getAllFeeds().subscribe({
      next: (res: Feed[]) => {
        if (!res?.length) {
          this.loading = false;
          return;
        }
        this.processFeeds(res);
        this.loading = false;
        this.startFeedRotation();
        this.startNewsTicker();
      },
      error: err => {
        console.error('❌ Error loading feeds:', err);
        this.loading = false;
      }
    });
  }

  private processFeeds(feeds: Feed[]): void {
    this.feeds = feeds
      .map(feed => ({
        id: feed.id,
        title: feed.title,
        description: feed.summary || feed.content || '',
        author: feed.author || '',
        category: feed.category,
        sourceName: feed.sourceName || 'Unknown',
        publishedAt: feed.publishedAt || '',
        imageUrl: feed.imageUrl || '',
        logoUrl: this.getSourceLogo(feed.sourceName ?? undefined),
        writerId: feed.writerId
      }))
      .filter(f => f.imageUrl && f.imageUrl.trim() !== '');

    this.latestHeadlines = this.feeds.slice(0, 10);
    this.updateFeedDisplay();
  }

  private updateFeedDisplay(): void {
    if (this.feeds.length === 0) return;

    // تدوير الأخبار بشكل حصري
    const totalFeeds = this.feeds.length;

    this.mainHeadline = this.feeds[this.feedIndex % totalFeeds];

    this.quickTakes = [];
    for (let i = 1; i <= 10; i++) {
      const idx = (this.feedIndex + i) % totalFeeds;
      if (this.feeds[idx].category !== undefined) {
        this.quickTakes.push(this.feeds[idx]);
      }
    }

    const feedsForCategories = [];
    for (let i = 11; i < totalFeeds; i++) {
      feedsForCategories.push(this.feeds[(this.feedIndex + i) % totalFeeds]);
    }

    const grouped = feedsForCategories.reduce((acc: Record<number, FeedMapped[]>, feed) => {
      if (feed.category !== undefined) {
        if (!acc[feed.category]) acc[feed.category] = [];
        acc[feed.category].push(feed);
      }
      return acc;
    }, {} as Record<number, FeedMapped[]>);

    this.categories = Object.keys(grouped)
      .map(key => Number(key))
      .filter(cat => cat !== undefined)
      .map(category => ({
        categor: category as Category,
        posts: grouped[category].slice(0, 3)
      }));
  }

  private startFeedRotation(): void {
    // كل 10 ثواني يحدث تغيير شامل للأخبار
    this.rotationSub = interval(10000).subscribe(() => {
      this.feedIndex = (this.feedIndex + 1) % this.feeds.length;
      this.updateFeedDisplay();
      this.triggerAnimation();
    });
  }

  private startNewsTicker(): void {
    if (this.latestHeadlines.length === 0) return;
    this.currentTicker = this.latestHeadlines[0].title;
    this.tickerIndex = 0;

    this.tickerSub = interval(10000).subscribe(() => {
      this.tickerIndex = (this.tickerIndex + 1) % this.latestHeadlines.length;
      this.currentTicker = this.latestHeadlines[this.tickerIndex].title;
    });
  }

  triggerAnimation(): void {
    const container = this.document.querySelector('.home-container');
    if (container) {
      container.classList.add('animate-news');
      setTimeout(() => container.classList.remove('animate-news'), 1000);
    }
  }

  getCategoryName(category: Category): string {
    return Category[category] || 'Unknown';
  }

  getSourceLogo(source?: string): string {
    if (!source) return '/assets/logos/default-news.png';
    const name = source.toLowerCase();
    if (name.includes('bbc')) return '/assets/logos/bbc.png';
    if (name.includes('cnn')) return '/assets/logos/cnn.png';
    if (name.includes('aljazeera')) return '/assets/logos/aljazeera.png';
    if (name.includes('reuters')) return '/assets/logos/reuters.png';
    return '/assets/logos/default-news.png';
  }

  openNews(feed: FeedMapped) {
    this.router.navigate(['/feeds', feed.id]);
  }
}
