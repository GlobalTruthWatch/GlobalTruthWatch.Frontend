import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FeedService } from '../../../../Services/feed.service';

@Component({
  selector: 'app-feed-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed-details.component.html',
  styleUrls: ['./feed-details.component.css']
})
export class FeedDetailsComponent implements OnInit {
  feed: any;
  loading = true;

  constructor(private route: ActivatedRoute, private feedService: FeedService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.feedService.getFeedById(+id).subscribe({
        next: (data) => {
          this.feed = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching feed:', err);
          this.loading = false;
        }
      });
    }
  }
}
