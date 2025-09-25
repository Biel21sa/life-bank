import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Donation } from '../../../domain/model/donation';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { DonationReadService } from '../../../services/donation/donation-read.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-donation-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './user-donation-history.component.html',
  styleUrls: ['./user-donation-history.component.css']
})
export class UserDonationHistoryComponent implements OnInit {
  donations: Donation[] = [];
  loading = true;
  userId = '';
  timelineView: 'list' | 'timeline' = 'list';

  constructor(
    private donationReadService: DonationReadService,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userId = this.authService.getAuthenticatedUserId()!;
    this.loadDonationHistory();
  }

  loadDonationHistory() {
    this.loading = true;
    this.donationReadService.getDonationsByUserId(this.userId).subscribe({
      next: (data) => {
        this.donations = data.sort(
          (a, b) =>
            new Date(b.collectionDate).getTime() -
            new Date(a.collectionDate).getTime()
        );
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erro ao carregar histórico de doações');
        this.loading = false;
      }
    });
  }

  getTotalDonations(): number {
    return this.donations.length;
  }

  getTotalQuantity(): number {
    return this.donations.reduce(
      (total, donation) => total + (donation.quantity || 0),
      0
    );
  }

  getTimeDonating(): number {
    if (this.donations.length === 0) return 0;
    const first = new Date(
      Math.min(...this.donations.map((d) => new Date(d.collectionDate).getTime()))
    );
    const now = new Date();
    const months =
      (now.getFullYear() - first.getFullYear()) * 12 +
      (now.getMonth() - first.getMonth());
    return Math.max(1, months + 1);
  }

  getRecognitionTitle(): string {
    const total = this.getTotalDonations();
    if (total >= 10) return 'Herói de Ouro';
    if (total >= 5) return 'Herói de Prata';
    return 'Herói Iniciante';
  }

  getRecognitionMessage(): string {
    const total = this.getTotalDonations();
    if (total >= 10) return 'Você alcançou o nível máximo!';
    if (total >= 5) return 'Continue, você já impactou muitas vidas!';
    return 'Sua jornada de herói está apenas começando!';
  }

  getRecognitionIcon(): string {
    const total = this.getTotalDonations();
    if (total >= 10) return 'emoji_events';
    if (total >= 5) return 'military_tech';
    return 'star';
  }

  getNextLevelTarget(): number {
    const total = this.getTotalDonations();
    if (total >= 10) return 10;
    if (total >= 5) return 10;
    return 5;
  }

  getProgressPercentage(): number {
    return (this.getTotalDonations() / this.getNextLevelTarget()) * 100;
  }

  toggleTimelineView() {
    this.timelineView = this.timelineView === 'list' ? 'timeline' : 'list';
  }

  trackByDonationId(index: number, donation: Donation) {
    return donation.id ?? index;
  }

  viewDonationDetails(donationId: string) {
    this.router.navigate(['/donation-detail', donationId]);
  }

  getRelativeTime(date: Date | string): string {
    const now = new Date();
    const diff = Math.floor(
      (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    if (diff < 30) return `${diff} dias atrás`;
    const months = Math.floor(diff / 30);
    return `${months} mês(es) atrás`;
  }

  startDonationJourney() {
    this.toastr.info('Vamos iniciar sua jornada de doações!');
    this.router.navigate(['/donations/start']);
  }

  scheduleNextDonation() {
    this.toastr.success('Agendamento iniciado!');
    this.router.navigate(['/donations/schedule']);
  }

  findDonationCenters() {
    this.toastr.info('Buscando locais de doação...');
    this.router.navigate(['/donations/centers']);
  }
}