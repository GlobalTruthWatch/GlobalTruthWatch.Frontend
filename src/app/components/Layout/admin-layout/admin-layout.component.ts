import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminNavComponent } from "../../Widgets/admin-nav/admin-nav.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, AdminNavComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  isSidebarOpen = true; // الشريط الجانبي مفتوح دائمًا في لوحة التحكم

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
