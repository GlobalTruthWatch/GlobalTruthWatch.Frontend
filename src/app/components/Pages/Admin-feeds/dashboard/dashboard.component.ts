import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { RouterOutlet } from '@angular/router';
import { FeedService } from '../../../../Services/feed.service';
import { Feed } from '../../../../models/feed';
import { ChartConfiguration } from 'chart.js';

declare const window: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // layout
  isSidebarExpanded = true;
  isMobileMenuOpen = false;

  // data
  totalFeeds = 0;
  totalSources = 0;
  recentFeedsCount = 0;
  activeCategoriesCount: { [cat: string]: number } = {};
  topSources: { name: string, count: number }[] = [];
  feedsLast7Days: { date: string, count: number }[] = [];

  // charts
  lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { position: 'bottom' } }
  };

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } }
  };

  loading = true;
  error: string | null = null;

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadFeedsAndCompute();
  }

  @HostListener('window:resize')
  onResize() { this.checkScreenSize(); }

  toggleSidebar() { this.isSidebarExpanded = !this.isSidebarExpanded; }
  toggleMobileMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen; }

  private checkScreenSize() {
    this.isSidebarExpanded = window.innerWidth > 768;
    this.isMobileMenuOpen = false;
  }

  private loadFeedsAndCompute() {
    this.loading = true;
    this.feedService.getAllFeeds().subscribe({
      next: (feeds: Feed[]) => {
        this.computeStatsFromFeeds(feeds);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading feeds:', err);
        this.error = err?.message || 'Failed to load feeds';
        this.loading = false;
      }
    });
  }

  private computeStatsFromFeeds(feeds: Feed[]) {
    this.totalFeeds = feeds.length;

    const sourceMap: Record<string, number> = {};
    const catMap: Record<string, number> = {};
    const last7Dates = this.getLastNDates(7).reverse();
    const last7Map: Record<string, number> = {};
    last7Dates.forEach(d => last7Map[d] = 0);

    feeds.forEach(f => {
      const src = f.sourceName || 'Unknown';
      sourceMap[src] = (sourceMap[src] || 0) + 1;

      const c = f.category != null ? f.category.toString() : 'Uncategorized';
      catMap[c] = (catMap[c] || 0) + 1;

      if (f.publishedAt) {
        const dateKey = this.formatDateKey(new Date(f.publishedAt));
        if (dateKey in last7Map) last7Map[dateKey] += 1;
      }
    });

    this.topSources = Object.entries(sourceMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    this.activeCategoriesCount = catMap;
    this.totalSources = Object.keys(sourceMap).length;

    this.feedsLast7Days = last7Dates.map(d => ({ date: d, count: last7Map[d] }));
    this.recentFeedsCount = this.feedsLast7Days.reduce((sum, x) => sum + x.count, 0);

    // Line chart for last 7 days
    this.lineChartData = {
      labels: this.feedsLast7Days.map(x => x.date),
      datasets: [
        {
          data: this.feedsLast7Days.map(x => x.count),
          label: 'Posts (last 7 days)',
          borderColor: '#4c51bf',
          backgroundColor: 'rgba(76,81,191,0.12)',
          fill: 'origin',
          tension: 0.3,
          pointRadius: 4
        }
      ]
    };

    // Doughnut chart for category distribution
    const catLabels = Object.keys(catMap);
    const catValues = catLabels.map(l => catMap[l]);
    this.doughnutChartData = {
      labels: catLabels,
      datasets: [{ data: catValues, label: 'Categories' }]
    };
  }

  private formatDateKey(date: Date) {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  private getLastNDates(n: number): string[] {
    const arr: string[] = [];
    for (let i = 0; i < n; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push(this.formatDateKey(d));
    }
    return arr;
  }
}
