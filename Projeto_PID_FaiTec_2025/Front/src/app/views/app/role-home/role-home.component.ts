import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/security/authentication.service';

@Component({
  selector: 'app-role-home',
  template: '<div>Redirecionando...</div>'
})
export class RoleHomeComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    const role = this.authService.getAuthenticatedUserRole();
    
    switch (role) {
      case 'SYSTEM':
        this.router.navigate(['/system-home']);
        break;
      case 'ADMINISTRATOR':
        this.router.navigate(['/admin-home']);
        break;
      case 'CLINIC':
        this.router.navigate(['/clinic-home']);
        break;
      case 'USER':
        this.router.navigate(['/user-home']);
        break;
      default:
        this.router.navigate(['/account/sign-in']);
    }
  }
}