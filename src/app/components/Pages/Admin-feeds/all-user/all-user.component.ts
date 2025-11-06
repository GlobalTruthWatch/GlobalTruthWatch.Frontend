import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../../../Services/user.service';

@Component({
  selector: 'app-all-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-user.component.html',
  styleUrls: ['./all-user.component.css']
})
export class AllUserComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.items; // ✅ استخدم items
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'حدث خطأ أثناء تحميل المستخدمين';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('are you sure Wonna delete this ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
        },
        error: (err) => {
          alert(' failed delete');
          console.error(err);
        }
      });
    }
  }
}
