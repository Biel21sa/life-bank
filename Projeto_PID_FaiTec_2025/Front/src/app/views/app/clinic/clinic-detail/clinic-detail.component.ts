import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../../../domain/model/user';
import { UserReadService } from '../../../../services/user/user-read.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-clinic-detail',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    NgxMaskPipe,
    MatMenuModule
  ],
  templateUrl: './clinic-detail.component.html',
  styleUrl: './clinic-detail.component.css',
})
export class ClinicDetailComponent implements OnInit {
  clinic?: User;
  hasError = false;

  constructor(
    private userReadService: UserReadService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let clinicId = this.route.snapshot.paramMap.get('id');
    if (clinicId) {
      this.loadClinicById(clinicId);
    }
  }

  async loadClinicById(clinicId: string) {
    try {
      this.hasError = false;
      this.clinic = await this.userReadService.findById(clinicId);
    } catch (err) {
      console.error('Erro ao carregar clínica:', err);
      this.hasError = true;
    }
  }

  isAdministrator(): boolean {
    return this.authenticationService.isAdministrator();
  }

  getFullAddress(): string {
    if (!this.clinic) return '';
    const { street, number, neighborhood, postalCode } = this.clinic;
    return `${street || ''}, ${number || ''} - ${neighborhood || ''}, CEP: ${postalCode || ''}`;
  }

  openMap(): void {
    if (!this.clinic) return;
    const query = encodeURIComponent(this.getFullAddress());
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }

  contactClinic(): void {
    if (!this.clinic) return;
    const phone = this.clinic.phone ? `tel:${this.clinic.phone}` : null;
    const email = this.clinic.email ? `mailto:${this.clinic.email}` : null;

    if (phone) {
      window.open(phone, '_self');
    } else if (email) {
      window.open(email, '_self');
    } else {
      alert('Nenhum contato disponível para esta clínica.');
    }
  }

  viewReports(): void {
    if (this.clinic) {
      this.router.navigate(['/clinic/reports', this.clinic.id]);
    }
  }

  viewHistory(): void {
    if (this.clinic) {
      this.router.navigate(['/clinic/history', this.clinic.id]);
    }
  }
}
