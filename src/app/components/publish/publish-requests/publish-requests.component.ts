import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs';
import { PublishRequest, PublishService } from '../../../Services/Posts-Writer/publish.service';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-publish-requests',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './publish-requests.component.html',
  styleUrls: ['./publish-requests.component.css']
})
export class PublishRequestsComponent implements OnInit {
  requests: PublishRequest[] = [];
  loading = true;
  errorMessage = '';
  api = environment.apiBaseUrl2

  constructor(private publishService: PublishService) {}

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests() {
    this.loading = true;
    this.publishService.getPendingRequests()
      .subscribe({
        next: (res) => { this.requests = res; this.loading = false; },
        error: (err) => { this.errorMessage = 'Failed to load requests.'; this.loading = false; console.error(err); }
      });
  }

  respond(requestId: number, accept: boolean) {
    this.publishService.respondRequest(requestId, accept).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.id !== requestId);
      },
      error: (err) => console.error('Error responding:', err)
    });
  }
}
