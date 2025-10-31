import { Component, OnInit, OnDestroy } from '@angular/core';
import { DonationLocationReadService } from '../../../../services/donation-location/donation-location-read.service';
import { DonationLocation } from '../../../../domain/model/donation-location';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-donation-location-list',
  standalone: true,
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
    MatMenuModule,
    MatListModule
  ],
  templateUrl: './donation-location-list.component.html',
  styleUrl: './donation-location-list.component.css'
})
export class DonationLocationListComponent implements OnInit, OnDestroy {

  donationLocations: DonationLocation[] = [];
  dataSource = new MatTableDataSource(this.donationLocations);
  displayedColumns: string[] = ['icon', 'name', 'address', 'municipality', 'status', 'actions'];

  isCardView = false;
  isCompactView = false;
  selectedLocation?: DonationLocation;
  isLoading = false;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private donationLocationReadService: DonationLocationReadService,
    private toastr: ToastrService,
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.performSearch(searchTerm);
      });
  }

  ngOnInit(): void {
    this.loadDonationLocations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDonationLocations(): void {
    this.isLoading = true;
    this.donationLocationReadService.findAll().subscribe({
      next: (locations) => {
        this.donationLocations = locations;
        this.dataSource.data = this.donationLocations;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar locais de doação:', error);
        this.toastr.error('Erro ao carregar locais de doação');
        this.isLoading = false;
      }
    });
  }

  refreshData(): void {
    this.loadDonationLocations();
    this.toastr.info('Dados atualizados');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue);
  }

  private performSearch(searchTerm: string): void {
    this.dataSource.filter = searchTerm.trim().toLowerCase();
  }

  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    this.dataSource.filter = '';
  }

  getFilteredCount(): number {
    return this.dataSource.filteredData.length;
  }

  toggleCardView(): void {
    this.isCardView = !this.isCardView;
    this.toastr.info(`Visualização alterada para ${this.isCardView ? 'cards' : 'lista'}`);
  }

  toggleCompactView(): void {
    this.isCompactView = !this.isCompactView;
    this.toastr.info(`Visualização ${this.isCompactView ? 'compacta' : 'normal'} ativada`);
  }

  selectRow(location: DonationLocation): void {
    this.selectedLocation = this.selectedLocation?.id === location.id ? undefined : location;
  }

  isRowHighlighted(location: DonationLocation): boolean {
    return this.selectedLocation?.id === location.id;
  }

  selectLocation(location: DonationLocation): void {
    this.selectedLocation = this.selectedLocation?.id === location.id ? undefined : location;
  }

  viewOnMap(location: DonationLocation): void {
    const address = `${location.street}, ${location.number}, ${location.neighborhood}, ${location.municipality.name}, ${location.municipality.state}`;
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    window.open(mapsUrl, '_blank');
    this.toastr.info(`Abrindo localização de ${location.name} no mapa`);
  }

  getActiveLocationsCount(): number {
    return this.donationLocations.length;
  }

  getRecentLocationsCount(): number {
    return Math.ceil(this.donationLocations.length / 3);
  }

  getCitiesCount(): number {
    const uniqueCities = new Set(
      this.donationLocations.map(location => location.municipality.name)
    );
    return uniqueCities.size;
  }

  trackByLocationId(index: number, location: DonationLocation): string {
    return location.id?.toString() || index.toString();
  }

  getLocationDisplayName(location: DonationLocation): string {
    return location.name || 'Local sem nome';
  }

  getFullAddress(location: DonationLocation): string {
    const parts = [
      location.street,
      location.number,
      location.neighborhood,
      location.municipality.name,
      location.municipality.state
    ].filter(part => part && part.trim() !== '');

    return parts.join(', ');
  }

  getLocationStatus(location: DonationLocation): string {
    return 'Ativo';
  }

  getLocationCapacity(location: DonationLocation): string {
    return 'Alta';
  }
}
