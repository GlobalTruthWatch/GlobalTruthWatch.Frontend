import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FeedService } from '../../../../Services/feed.service';
import { Feed } from '../../../../models/feed';
import { environment } from '../../../../environments/environment';
import { Category } from '../../../../models/Categories';

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
export class HomePageComponent implements OnInit {
  loading = true;
  categories: { categor: Category; posts: FeedMapped[] }[] = [];
  environment = environment;
  
  constructor(
    private router: Router,
    private feedService: FeedService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.loadFeedsFromBackend();
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
      },
      error: err => {
        console.error('❌ Error loading feeds:', err);
        this.loading = false;
      }
    });
  }

  private processFeeds(feeds: Feed[]): void {
    // Map the API data to FeedMapped
    const mapped: FeedMapped[] = feeds
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
      .filter(f => f.imageUrl.trim() !== '');

    // Group feeds by category
    const grouped = mapped.reduce((acc: Record<number, FeedMapped[]>, feed) => {
      if (feed.category !== undefined) {
        if (!acc[feed.category]) acc[feed.category] = [];
        acc[feed.category].push(feed);
      }
      return acc;
    }, {} as Record<number, FeedMapped[]>);

    // Take top 3 posts per category
    this.categories = Object.keys(grouped)
      .map(key => Number(key))
      .filter(cat => cat !== undefined)
      .map(category => ({
        categor: category as Category,
        posts: grouped[category].slice(0, 3)
      }));

    console.log('Mapped Categories:', this.categories);
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

  scrollToNews() {
    const element = this.document.getElementById('news-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
