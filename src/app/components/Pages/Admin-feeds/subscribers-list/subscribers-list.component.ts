import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscriber, SubscribeService } from '../../../../Services/subscribe.service';

@Component({
  selector: 'app-subscribers-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscribers-list.component.html',
  styleUrls: ['./subscribers-list.component.css']
})
export class SubscribersListComponent implements OnInit {
  subscribers: Subscriber[] = [];
  loading = true;

  constructor(private subscribeService: SubscribeService) {}

  ngOnInit(): void {
    this.subscribeService.getSubscribers().subscribe({
      next: (data) => {
        this.subscribers = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
