import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { Donor } from '../../../domain/model/donor';
import { DonationReadService } from '../../../services/donation/donation-read.service';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { DonorReadService } from '../../../services/donor/donor-read-service';

@Component({
  selector: 'app-user-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  donor: Donor | null = null;
  nextDonationDate: Date | null = null;
  canDonate: boolean = false;
  donorId: string = '';
  userId: string = '';

  constructor(
    private router: Router,
    private donorReadService: DonorReadService,
    private donationReadService: DonationReadService,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.donorId = this.authService.getAuthenticatedUserDonorId()!;
    this.userId = this.authService.getAuthenticatedUserId();
    this.loadDonorInfo();
  }

  loadDonorInfo() {
    this.donorReadService.findById(this.donorId).subscribe({
      next: (donor: Donor | null) => {
        this.donor = donor;
        this.calculateNextDonationDate();
      },
      error: () => this.toastr.error('Erro ao carregar informações do doador')
    });
  }

  calculateNextDonationDate() {
    if (!this.donor) return;

    this.donationReadService.getDonationsByUserId(this.userId).subscribe({
      next: (donations) => {
        if (donations.length === 0) {
          this.canDonate = this.donor!.apto;
          return;
        }

        const lastDonation = donations.sort((a, b) =>
          new Date(b.collectionDate).getTime() - new Date(a.collectionDate).getTime()
        )[0];

        const lastDonationDate = new Date(lastDonation.collectionDate);
        const daysToWait = this.donor!.gender.toLowerCase() === 'masculino' ? 60 : 90;

        this.nextDonationDate = new Date(lastDonationDate);
        this.nextDonationDate.setDate(this.nextDonationDate.getDate() + daysToWait);

        this.canDonate = this.donor!.apto && new Date() >= this.nextDonationDate;
      },
      error: () => this.toastr.error('Erro ao calcular próxima doação')
    });
  }

  getDaysUntilNextDonation(): number {
    if (!this.nextDonationDate) return 0;
    const today = new Date();
    const diffTime = this.nextDonationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  navigateToClinicList() {
    this.router.navigate(['/clinic/list']);
  }

  navigateToMyBenefits() {
    this.router.navigate(['/my-benefits']);
  }

  navigateToMyDonations() {
    this.router.navigate(['/my-donations']);
  }
}