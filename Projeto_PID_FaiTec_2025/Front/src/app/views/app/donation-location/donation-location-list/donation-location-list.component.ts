import { Component, OnInit } from '@angular/core';
import { DonationLocationReadService } from '../../../../services/donation-location/donation-location-read.service';
import { DonationLocationDeleteService } from '../../../../services/donation-location/donation-location-delete.service';
import { DonationLocation } from '../../../../domain/model/donation-location';
import { ToastrService } from 'ngx-toastr';
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
    private donationLocationDeleteService: DonationLocationDeleteService,
    private toastr: ToastrService,
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

  async deleteLocation(locationId: string) {
    if (confirm('Tem certeza que deseja excluir este local de doação?')) {
      try {
        await this.donationLocationDeleteService.delete(locationId);
        this.toastr.success('Local de doação removido com sucesso!');
        this.loadDonationLocations();
      } catch (error) {
        this.toastr.error('Erro ao remover local de doação');
        console.error(error);
      }
    }
  }
}