import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { BenefitReadService } from '../../../../services/benefit/benefit-read.service';
import { Router } from '@angular/router';
import { Benefit } from '../../../../domain/model/benefit';

@Component({
  selector: 'app-benefit-list',
  standalone: true,
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
    private toastr: ToastrService,
    private router: Router
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

  clearFilters() {
    this.selectedFilter = 'all';
    this.applyFilter();
  }

  getFilterIcon(value: string): string {
    switch (value) {
      case 'available': return 'check_circle';
      case 'used': return 'done';
      case 'expired': return 'block';
      default: return 'list';
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

  getStatusIcon(status: string): string {
    switch (status) {
      case 'used': return 'done';
      case 'expired': return 'block';
      case 'available': return 'check_circle';
      default: return 'help';
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

  getSelectedFilterLabel(): string {
    const option = this.filterOptions.find(opt => opt.value === this.selectedFilter);
    return option?.label || 'Filtro';
  }

  getUsagePercentage(): number {
    if (this.benefits.length === 0) return 0;
    const usedCount = this.benefits.filter(b => b.used).length;
    return Math.round((usedCount / this.benefits.length) * 100);
  }

  getEmptyStateTitle(): string {
    switch (this.selectedFilter) {
      case 'available': return 'Nenhum benefício disponível';
      case 'used': return 'Nenhum benefício utilizado';
      case 'expired': return 'Nenhum benefício expirado';
      default: return 'Nenhum benefício encontrado';
    }
  }

  getEmptyStateMessage(): string {
    switch (this.selectedFilter) {
      case 'available': return 'Faça mais doações para desbloquear novos descontos.';
      case 'used': return 'Você ainda não utilizou nenhum benefício.';
      case 'expired': return 'Não há benefícios expirados no momento.';
      default: return 'Ainda não há benefícios cadastrados.';
    }
  }

  getDaysUntilExpiration(expirationDate: Date): number {
    const now = new Date();
    const diff = new Date(expirationDate).getTime() - now.getTime();
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, dias);
  }

  getExpirationClass(expirationDate: Date): string {
    const now = new Date();
    const expDate = new Date(expirationDate);
    const diff = expDate.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    if (days <= 0) {
      return 'expired';
    }
    if (days <= 7) {
      return 'expiring-soon';
    }
    return '';
  }

  getUrgencyClass(expirationDate: Date): string {
    const now = new Date();
    const diff = new Date(expirationDate).getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    if (days <= 0) return 'expired';
    if (days <= 7) return 'urgent';
    return 'normal';
  }

  getUrgencyIcon(expirationDate: Date): string {
    const now = new Date();
    const diff = new Date(expirationDate).getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    if (days <= 0) return 'event_busy';
    if (days <= 7) return 'warning';
    return 'event_available';
  }

  getUrgencyText(expirationDate: Date): string {
    const now = new Date();
    const diff = new Date(expirationDate).getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days <= 0) return 'Expirado';
    if (days <= 7) return `Expira em ${days} dia(s)`;
    return `Expira em ${days} dias`;
  }

  useBenefit(benefit: Benefit) {
    if (this.getBenefitStatus(benefit) !== 'available') {
      this.toastr.warning('Este benefício não está disponível para uso.');
      return;
    }
    this.toastr.success(`Benefício utilizado: ${benefit.description}`, 'Sucesso');
    benefit.used = true;
    this.applyFilter();
  }

  goToDonation() {
    this.router.navigate(['/donations/schedule']);
  }
}