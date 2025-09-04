import { Component, OnInit } from '@angular/core';
import { DonationLocationReadService } from '../../../../services/donation-location/donation-location-read.service';
import { DonationLocation } from '../../../../domain/model/donation-location';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-donation-location-list',
  imports: [
    RouterModule,
    FontAwesomeModule,
  ],
  templateUrl: './donation-location-list.component.html',
  styleUrl: './donation-location-list.component.css'
})
export class DonationLocationListComponent implements OnInit {

  fa = fontawesome;
  donationLocations: DonationLocation[] = [];

  constructor(
    private donationLocationReadService: DonationLocationReadService,
  ) { }

  ngOnInit(): void {
    this.loadDonationLocations();
  }

  loadDonationLocations() {
    this.donationLocationReadService.findAll().subscribe({
      next: (locations) => {
        this.donationLocations = locations;
      },
      error: (error) => {
        console.error('Erro ao carregar locais de doação:', error);
      }
    });
  }
}