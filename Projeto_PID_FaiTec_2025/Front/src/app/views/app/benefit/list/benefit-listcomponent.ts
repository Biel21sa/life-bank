import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';
import { Benefit } from '../../../../domain/model/benefit';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { BenefitReadService } from '../../../../services/benefit/benefit-read.service';

@Component({
  selector: 'app-benefit-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './benefit-list.component.html',
  styleUrls: ['./benefit-list.component.css']
})
export class BenefitListComponent implements OnInit {
  benefits: Benefit[] = [];
  filteredBenefits: Benefit[] = [];
  loading: boolean = true;
  userId: string = '';
  selectedFilter: string = 'all';

  filterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'available', label: 'Disponíveis' },
    { value: 'used', label: 'Utilizados' },
    { value: 'expired', label: 'Expirados' }
  ];

  constructor(
    private benefitReadService: BenefitReadService,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.userId = this.authService.getAuthenticatedUserId()!;
    this.loadBenefits();
  }

  loadBenefits() {
    this.loading = true;
    this.benefitReadService.getBenefitsByUserId(this.userId).subscribe({
      next: (data) => {
        this.benefits = data.sort((a, b) =>
          new Date(b.expirationDate).getTime() - new Date(a.expirationDate).getTime()
        );
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erro ao carregar benefícios');
        this.loading = false;
      }
    });
  }

  onFilterChange() {
    this.applyFilter();
  }

  applyFilter() {
    switch (this.selectedFilter) {
      case 'available':
        this.filteredBenefits = this.benefits.filter(b => !b.used && !this.isExpired(b));
        break;
      case 'used':
        this.filteredBenefits = this.benefits.filter(b => b.used);
        break;
      case 'expired':
        this.filteredBenefits = this.benefits.filter(b => this.isExpired(b) && !b.used);
        break;
      default:
        this.filteredBenefits = [...this.benefits];
    }
  }

  isExpired(benefit: Benefit): boolean {
    return new Date(benefit.expirationDate) < new Date();
  }

  getBenefitStatus(benefit: Benefit): string {
    if (benefit.used) return 'used';
    if (this.isExpired(benefit)) return 'expired';
    return 'available';
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'used': return 'Utilizado';
      case 'expired': return 'Expirado';
      case 'available': return 'Disponível';
      default: return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'used': return 'primary';
      case 'expired': return 'warn';
      case 'available': return 'accent';
      default: return 'primary';
    }
  }

  getTotalBenefits(): number {
    return this.benefits.length;
  }

  getAvailableBenefits(): number {
    return this.benefits.filter(b => !b.used && !this.isExpired(b)).length;
  }

  getTotalValue(): number {
    return this.benefits
      .filter(b => !b.used && !this.isExpired(b))
      .reduce((total, benefit) => total + benefit.amount, 0);
  }
}