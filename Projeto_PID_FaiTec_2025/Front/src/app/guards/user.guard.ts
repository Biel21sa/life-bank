import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/security/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {

    constructor(
        private authService: AuthenticationService,
        private router: Router
    ) { }

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
            const role = this.authService.getAuthenticatedUserRole();
            if (role === 'USER') {
                return true;
            }
        }

        this.router.navigate(['/']);
        return false;
    }
}