import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';
import { DonationReadService } from '../../../../services/donation/donation-read.service';
import { UserReadService } from '../../../../services/user/user-read.service';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-donation-history',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    NgxMaskPipe,
    MatMenuModule,
    MatChipsModule
  ],
  templateUrl: './donation-history.component.html',
  styleUrls: ['./donation-history.component.css']
})
export class DonationHistoryComponent implements OnInit {

  donations: any[] = [];
  dataSource = new MatTableDataSource(this.donations);
  displayedColumns: string[] = ['donor', 'bloodType', 'date', 'quantity', 'actions'];

  currentUser: any = null;
  selectedBloodTypeFilter: string = 'all';
  viewMode: string = 'table';
  isLoading: boolean = true;

  constructor(
    private donationReadService: DonationReadService,
    private userReadService: UserReadService,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  async loadCurrentUser() {
    try {
      const email = this.authService.getAuhenticatedUserEmail();
      const users = await this.userReadService.findAll();
      this.currentUser = users?.find((u: { email: string; }) => u.email === email) || null;

      if (this.currentUser?.donationLocationId) {
        this.loadDonations();
      } else {
        this.toastr.error('Local de doação não encontrado');
      }
    } catch (error) {
      this.toastr.error('Erro ao carregar dados do usuário');
      console.error(error);
    }
  }

  loadDonations() {
    if (!this.currentUser?.donationLocationId) return;

    this.donationReadService.findByDonationLocationId(this.currentUser.donationLocationId.toString()).subscribe({
      next: (donations) => {
        this.donations = (donations || []).sort(
          (a, b) =>
            new Date(b.collectionDate).getTime() -
            new Date(a.collectionDate).getTime()
        );

        this.dataSource.data = this.donations;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Erro ao carregar doações');
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  getBloodTypeClass(bloodType: string): string {
    const classes: { [key: string]: string } = {
      'A': 'blood-a-positive',
      'A_POSITIVE': 'blood-a-positive',
      'A_NEGATIVE': 'blood-a-negative',
      'B_POSITIVE': 'blood-b-positive',
      'B_NEGATIVE': 'blood-b-negative',
      'AB_POSITIVE': 'blood-ab-positive',
      'AB_NEGATIVE': 'blood-ab-negative',
      'O_POSITIVE': 'blood-o-positive',
      'O_NEGATIVE': 'blood-o-negative'
    };
    return classes[bloodType] || '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch(input: HTMLInputElement) {
    input.value = '';
    this.dataSource.filter = '';
  }

  filterByBloodType(type: string) {
    this.selectedBloodTypeFilter = type;
    if (type === 'all') {
      this.dataSource.data = this.donations;
    } else {
      this.dataSource.data = this.donations.filter(d => d.bloodType === type);
    }
  }

  getAvailableBloodTypes(): string[] {
    const types = Array.from(new Set(this.donations.map(d => d.bloodType)));
    return types;
  }

  getFilteredCount(): number {
    return this.dataSource.filteredData.length;
  }

  toggleView() {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }

  getFilteredDonations(): any[] {
    if (this.selectedBloodTypeFilter === 'all') return this.donations;
    return this.donations.filter(d => d.bloodType === this.selectedBloodTypeFilter);
  }

  trackByDonation(index: number, donation: any): any {
    return donation.id;
  }

  getRelativeDate(date: string): string {
    const diff = (new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24);
    if (diff < 1) return 'Hoje';
    if (diff < 2) return 'Ontem';
    return `${Math.floor(diff)} dias atrás`;
  }

  getImpactText(quantity: number): string {
    const lives = Math.floor(quantity / 0.45);
    return `${lives} vidas salvas`;
  }

  getStatusClass(donation: any): string {
    return donation.status === 'completed' ? 'status-completed' : 'status-pending';
  }

  getStatusIcon(donation: any): string {
    return donation.status === 'completed' ? 'check_circle' : 'hourglass_empty';
  }

  getStatusText(donation: any): string {
    return donation.status === 'completed' ? 'Concluído' : 'Pendente';
  }

  getTotalVolume(): number {
    return this.donations.reduce((total, d) => total + d.quantity, 0).toFixed(2);
  }

  getMonthlyGrowth(): number {
    return 12;
  }

  getLivesSaved(): number {
    return Math.floor(this.getTotalVolume() / 0.45);
  }

  getRecentDonations(): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.donations.filter(d => new Date(d.collectionDate) >= thirtyDaysAgo).length;
  }

  getAverageDonationsPerDay(): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCount = this.donations.filter(d => new Date(d.collectionDate) >= thirtyDaysAgo).length;
    return Math.ceil(recentCount / 30);
  }

  getUniqueBloodTypes(): number {
    return new Set(this.donations.map(d => d.bloodType)).size;
  }

  getMostCommonBloodType(): string {
    const counts: { [key: string]: number } = {};
    this.donations.forEach(d => counts[d.bloodType] = (counts[d.bloodType] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, '');
  }

  viewDonationDetails(donation: any) {
    console.log('Visualizando detalhes', donation);
  }
}
