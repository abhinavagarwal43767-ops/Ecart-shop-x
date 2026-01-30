import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  open = false;
  showLogoutModal = false;

  constructor(private auth: AuthService, private router: Router) { }

  get token() {
    return !!localStorage.getItem('token');
  }

  confirmLogout() {
    this.showLogoutModal = true;
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.cancelLogout();
        localStorage.clear();
        this.router.navigateByUrl('/login');
      },
      error: () => {
        this.cancelLogout();
        localStorage.clear();
        this.router.navigateByUrl('/login');
      }
    });
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}
