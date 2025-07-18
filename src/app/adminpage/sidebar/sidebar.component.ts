import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterLink,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private router: Router) {}

  confirmLogout() {
    if (confirm('Are you sure you want to log out?')) {
      // Perform logout logic here (clear session, etc.)
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}


