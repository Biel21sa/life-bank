import { Component, OnInit } from '@angular/core';
import { DonationLocationReadService } from '../../../../services/donation-location/donation-location-read.service';
import { DonationLocation } from '../../../../domain/model/donation-location';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-donation-location-list',
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './donation-location-list.component.html',
  styleUrl: './donation-location-list.component.css'
})
export class DonationLocationListComponent implements OnInit {

  donationLocations: DonationLocation[] = [];
  dataSource = new MatTableDataSource(this.donationLocations);
  displayedColumns: string[] = ['name', 'address', 'neighborhood', 'actions'];

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
        this.dataSource.data = this.donationLocations;
      },
      error: (error) => {
        console.error('Erro ao carregar locais de doação:', error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}