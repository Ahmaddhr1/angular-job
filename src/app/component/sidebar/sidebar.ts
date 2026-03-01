import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { navLinks } from '../../../utils/navLinks';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  

  navLinkss = navLinks;
  
  mobileOpen = false;

  admin$;

  constructor(public router: Router, public auth: Auth) {
    this.admin$ = this.auth.admin$;
  }
  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  isLoginPage() {
    return this.router.url.startsWith('/login');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
