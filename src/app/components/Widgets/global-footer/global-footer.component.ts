import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscribeService } from '../../../Services/subscribe.service';

@Component({
  selector: 'app-global-footer',
  standalone: true,
  templateUrl: './global-footer.component.html',
  styleUrls: ['./global-footer.component.css'],
  imports: [CommonModule, FormsModule]
})
export class GlobalFooterComponent {
  currentYear: number = new Date().getFullYear();
  email: string = '';
  message: string = '';
  loading: boolean = false;

  constructor(private subscribeService: SubscribeService) {}

  subscribe(): void {
    if (!this.email) {
      this.message = 'Please enter your email address.';
      return;
    }
    this.loading = true;
    this.subscribeService.subscribe(this.email).subscribe({
      next: (res) => {
        this.message = res.message || 'Subscription successful!';
        this.loading = false;
        this.email = '';
      },
      error: () => {
        this.message = 'Subscription failed. Try again later.';
        this.loading = false;
      }
    });
  }
}
