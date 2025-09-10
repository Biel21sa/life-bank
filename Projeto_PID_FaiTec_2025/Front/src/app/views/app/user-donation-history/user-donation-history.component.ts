import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ToastrService } from 'ngx-toastr';

import { Donation } from '../../../domain/model/donation';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { DonationReadService } from '../../../services/donation/donation-read.service';

@Component({
  selector: 'app-user-donation-history',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './user-donation-history.component.html',
  styleUrls: ['./user-donation-history.component.css']
})
export class UserDonationHistoryComponent implements OnInit {
  donations: Donation[] = [];
  loading: boolean = true;
  userId: string = '';

  constructor(
    private donationReadService: DonationReadService,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.userId = this.authService.getAuthenticatedUserId()!;
    this.loadDonationHistory();
  }

  loadDonationHistory() {
    this.loading = true;
    this.donationReadService.getDonationsByUserId(this.userId).subscribe({
      next: (data) => {
        this.donations = data.sort((a, b) =>
          new Date(b.collectionDate).getTime() - new Date(a.collectionDate).getTime()
        );
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erro ao carregar histórico de doações');
        this.loading = false;
      }
    });
  }

  getTotalDonations(): number {
    return this.donations.length;
  }

  getTotalQuantity(): number {
    return this.donations
      .reduce((total, donation) => total + (donation.quantity || 0), 0);
  }
}