import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../services/security/authentication.service';

@Component({
  selector: 'app-admin-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  navigateToDonors() {
    this.router.navigate(['/donor/list']);
  }

  navigateToClinics() {
    this.router.navigate(['/clinic/list']);
  }

  navigateToDonations() {
    this.router.navigate(['/donation-history']);
  }

  getDonationLocationId(): string {
    return this.authenticationService.getDonationLocationId()!;
  }

  navigateToBloodWithdrawal() {
    this.router.navigate([`blood-withdrawal`]);
  }

  navigateToBloodStock() {
    this.router.navigate(['/blood-stock']);
  }
}