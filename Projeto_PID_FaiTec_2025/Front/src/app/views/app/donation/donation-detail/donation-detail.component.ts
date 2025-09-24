import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { DonationReadService } from '../../../../services/donation/donation-read.service';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-donation-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgxMaskPipe,
    MatMenuModule
  ],
  templateUrl: './donation-detail.component.html',
  styleUrl: './donation-detail.component.css'
})
export class DonationDetailComponent implements OnInit {
  donation: any = null;
  donationId: string = '';
  hasError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donationReadService: DonationReadService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.donationId = this.route.snapshot.paramMap.get('id') || '';
    if (this.donationId) {
      this.loadDonation();
    }
  }

  loadDonation() {
    this.donationReadService.findById(this.donationId).subscribe({
      next: (donation) => {
        this.donation = donation;
        this.hasError = false;
      },
      error: (error) => {
        this.toastr.error('Erro ao carregar detalhes da doação');
        console.error(error);
        this.hasError = true;
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

  getRole(): string {
    return this.authenticationService.getAuthenticatedUserRole() || '';
  }

  goBack() {
    if (this.getRole() === 'ADMINISTRATOR') {
      this.router.navigate(['/donation-history']);
    } else {
      this.router.navigate(['/my-donations']);
    }
  }

  getDaysUntilExpiration(): number {
    if (!this.donation?.expirationDate) return 0;
    const today = new Date();
    const expiration = new Date(this.donation.expirationDate);
    const diff = expiration.getTime() - today.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  }

  getStorageTime(): number {
    if (!this.donation?.collectionDate) return 0;
    const collection = new Date(this.donation.collectionDate);
    const today = new Date();
    const diff = today.getTime() - collection.getTime();
    return Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0);
  }

  getStatusClass(): string {
    const days = this.getDaysUntilExpiration();
    if (days > 14) return 'status-valid';
    if (days > 0) return 'status-warning';
    return 'status-expired';
  }

  getStatusIcon(): string {
    const days = this.getDaysUntilExpiration();
    if (days > 14) return 'check_circle';
    if (days > 0) return 'warning';
    return 'error';
  }

  getStatusText(): string {
    const days = this.getDaysUntilExpiration();
    if (days > 14) return 'Válida';
    if (days > 0) return 'Perto do vencimento';
    return 'Expirada';
  }

  getExpirationClass(): string {
    return this.getStatusClass();
  }

  getProcessingDate(): Date {
    if (!this.donation?.collectionDate) return new Date();
    const date = new Date(this.donation.collectionDate);
    date.setDate(date.getDate() + 1); // processamento leva 1 dia
    return date;
  }

  getAvailabilityStatus(): string {
    return this.getDaysUntilExpiration() > 0 ? 'available' : 'unavailable';
  }

  getAvailabilityIcon(): string {
    return this.getDaysUntilExpiration() > 0 ? 'check_circle' : 'error';
  }

  getAvailabilityDate(): Date {
    if (!this.donation?.collectionDate) return new Date();
    const date = new Date(this.donation.collectionDate);
    date.setDate(date.getDate() + 2); // disponibilidade leva 2 dias
    return date;
  }

  getAvailabilityDescription(): string {
    return this.getDaysUntilExpiration() > 0
      ? 'Disponível para uso'
      : 'Não disponível';
  }

  getExpirationStatus(): string {
    return this.getDaysUntilExpiration() > 0 ? 'valid' : 'expired';
  }

  getExpirationIcon(): string {
    return this.getDaysUntilExpiration() > 0 ? 'check_circle' : 'error';
  }

  getExpirationDescription(): string {
    return this.getDaysUntilExpiration() > 0
      ? 'Produto dentro do prazo'
      : 'Produto vencido';
  }

  openMap() {
    if (this.donation?.donationLocation?.latitude && this.donation?.donationLocation?.longitude) {
      window.open(
        `https://www.google.com/maps?q=${this.donation.donationLocation.latitude},${this.donation.donationLocation.longitude}`,
        '_blank'
      );
    } else {
      this.toastr.warning('Localização não disponível');
    }
  }

  printDetails() {
    window.print();
  }

  shareDetails() {
    if (navigator.share) {
      navigator.share({
        title: 'Detalhes da Doação',
        text: `Confira os detalhes desta doação realizada em ${this.donation.collectionDate}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      this.toastr.info('Compartilhamento não suportado neste navegador');
    }
  }

  downloadCertificate() {
    this.toastr.info('Funcionalidade de certificado em implementação');
  }

  viewHistory() {
    this.router.navigate(['/donation-history']);
  }

  reportIssue() {
    this.toastr.warning('Funcionalidade de reporte em implementação');
  }
}
