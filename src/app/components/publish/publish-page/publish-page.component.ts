import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PublishResponse } from '../../../models/publish';
import { PublishService } from '../../../Services/Posts-Writer/publish.service';
import { environment } from '../../../environments/environment';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-publish-page',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './publish-page.component.html',
  styleUrls: ['./publish-page.component.css']
})
export class PublishPageComponent implements OnInit {
  publishes: PublishResponse[] = [];
  loading = true;
  error = '';
  api = environment.apiBaseUrl2
  constructor(private publishService: PublishService) {}

  ngOnInit(): void {
    this.fetchPublishes();
  }

  fetchPublishes() {
    this.publishService.getPublishes().subscribe({
      next: data => {
        this.publishes = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;

        if (err.status === 401) {
          this.error = 'Unauthorized. Please login as admin.';
        } else if (err.status === 403) {
          this.error = 'Forbidden. You do not have permission to view these publishes.';
        } else {
          this.error = 'Failed to load publishes. Please check the API.';
        }

        console.error(err);
      }
    });
  }
}
