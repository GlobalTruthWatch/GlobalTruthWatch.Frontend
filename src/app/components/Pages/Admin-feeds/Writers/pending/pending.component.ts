import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WriterRequest, WriterType } from '../../../../../models/writer-requests';
import { WriterService } from '../../../../../Services/writer.service';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit {
  writerRequests: WriterRequest[] = [];
  loading = false;
  message = '';
  writerTypeEnum = WriterType;

  constructor(private writerService: WriterService) {}

  ngOnInit() {
    this.loadRequests();
  }

  // 🔄 Load all pending writer requests
  loadRequests() {
    this.loading = true;
    this.writerService.getPendingRequests().subscribe({
      next: res => {
        this.writerRequests = res.map(r => ({
          ...r,
          selectedType: r.type ?? WriterType.Blogger,
          status: 'pending'
        }));
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // ✅ Accept request
  acceptRequest(req: WriterRequest) {
    const typeNumber = Number(req.selectedType ?? WriterType.Blogger);
    this.writerService.acceptApplication(req.id, typeNumber).subscribe({
      next: res => {
        this.message = res.message || 'Application accepted.';
        req.status = 'accepted';
        this.removeRequestFromList(req.id);
      },
      error: err => {
        console.error(err);
        this.message = 'Error processing request.';
      }
    });
  }

  // ❌ Reject request
  rejectRequest(req: WriterRequest) {
    this.writerService.rejectApplication(req.id).subscribe({
      next: res => {
        this.message = res.message || 'Application rejected.';
        req.status = 'rejected';
        this.removeRequestFromList(req.id);
      },
      error: err => {
        console.error(err);
        this.message = 'Error processing request.';
      }
    });
  }

  // 🔹 Remove request from local list
  private removeRequestFromList(id: number) {
    this.writerRequests = this.writerRequests.filter(r => r.id !== id);
  }
}
