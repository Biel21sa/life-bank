import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DonationLocationUpdateService } from '../../../../services/donation-location/donation-location-update.service';
import { DonationLocation } from '../../../../domain/model/donation-location';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-donation-location-detail',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgxMaskPipe
  ],
  templateUrl: './donation-location-detail.component.html',
  styleUrl: './donation-location-detail.component.css'
})
export class DonationLocationDetailComponent implements OnInit {

  donationLocation: DonationLocation | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donationLocationService: DonationLocationUpdateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDonationLocation(id);
    }
  }

  loadDonationLocation(id: string) {
    this.donationLocationService.findById(id).subscribe({
      next: (location) => {
        this.donationLocation = location;
      },
      error: (error) => {
        console.error('Erro ao carregar local de doação:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/donation-location/list']);
  }
}