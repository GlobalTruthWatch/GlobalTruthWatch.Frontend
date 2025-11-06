import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { UserService, User } from '../../../Services/user.service';

@Component({
  selector: 'app-global-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './global-nav.component.html',
  styleUrls: ['./global-nav.component.css']
})
export class GlobalNavComponent implements OnInit {
  isSidebarOpen = false;
  user: User | null = null;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.loadUserProfile();
    }
  }

  loadUserProfile() {
    const token = this.authService.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        payload['nameid'] ||
        payload['id'];

      if (userId) {
        this.userService.getUserById(userId).subscribe({
          next: (res: any) => {
            this.user = res?.content ?? res;
          },
          error: (err) => console.error('Error loading user', err),
        });
      }
    } catch (e) {
      console.error('Invalid token structure', e);
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  goToProfile() {
    this.router.navigate(['/MyProfileUser']);
  }
}
