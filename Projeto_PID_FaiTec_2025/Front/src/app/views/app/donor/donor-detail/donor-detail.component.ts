import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../../../domain/model/user';
import { UserReadService } from '../../../../services/user/user-read.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-donor-detail',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    NgxMaskPipe,
    MatMenuModule,
    MatListModule
  ],
  templateUrl: './donor-detail.component.html',
  styleUrl: './donor-detail.component.css'
})
export class DonorDetailComponent implements OnInit {
  donor?: User;

  constructor(
    private userReadService: UserReadService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let donorId = this.route.snapshot.paramMap.get('id');
    this.loadDonorById(donorId!);
  }

  async loadDonorById(donorId: string) {
    this.donor = await this.userReadService.findById(donorId);
  }

  // ===== FUNÇÕES CHAMADAS NO HTML =====

  getBloodTypeClass(bloodType: string): string {
    const classes: { [key: string]: string } = {
      'A+': 'blood-a-positive',
      'A-': 'blood-a-negative',
      'B+': 'blood-b-positive',
      'B-': 'blood-b-negative',
      'AB+': 'blood-ab-positive',
      'AB-': 'blood-ab-negative',
      'O+': 'blood-o-positive',
      'O-': 'blood-o-negative'
    };
    return classes[bloodType] || '';
  }

  contactDonor() {
    if (this.donor?.phone) {
      window.open(`tel:${this.donor.phone}`, '_self');
    } else {
      this.toastr.warning('Telefone não disponível');
    }
  }

  sendEmail() {
    if (this.donor?.email) {
      window.open(`mailto:${this.donor.email}`, '_self');
    } else {
      this.toastr.warning('Email não disponível');
    }
  }

  viewHistory() {
    this.router.navigate(['/donations/history', this.donor?.id]);
  }

  editPersonalInfo() {
    this.router.navigate(['/donor/edit', this.donor?.id]);
  }

  copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    this.toastr.success('Copiado para a área de transferência!');
  }

  callDonor(phone: string) {
    window.open(`tel:${phone}`, '_self');
  }

  viewCompatibility() {
    this.toastr.info('Exibindo compatibilidade sanguínea...');
  }

  getBloodTypeName(bloodType: string): string {
    const map: { [key: string]: string } = {
      'A+': 'A Positivo',
      'A-': 'A Negativo',
      'B+': 'B Positivo',
      'B-': 'B Negativo',
      'AB+': 'AB Positivo',
      'AB-': 'AB Negativo',
      'O+': 'O Positivo',
      'O-': 'O Negativo'
    };
    return map[bloodType] || 'Não informado';
  }

  showCompatibility() {
    this.toastr.info('Abrindo tabela de compatibilidade...');
  }

  updateBloodType() {
    this.router.navigate(['/donor/edit', this.donor?.id]);
  }

  openMap() {
    if (this.donor?.street && this.donor.number && this.donor.neighborhood) {
      const address = `${this.donor.street}, ${this.donor.number}, ${this.donor.neighborhood}`;
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
    } else {
      this.toastr.warning('Endereço incompleto para abrir no mapa');
    }
  }

  copyAddress() {
    if (this.donor?.street && this.donor.number && this.donor.neighborhood) {
      const address = `${this.donor.street}, ${this.donor.number}, ${this.donor.neighborhood} - CEP: ${this.donor.postalCode}`;
      navigator.clipboard.writeText(address);
      this.toastr.success('Endereço copiado!');
    }
  }

  viewDonationHistory() {
    this.router.navigate(['/donations/history', this.donor?.id]);
  }

  scheduleDonation() {
    this.router.navigate(['/donations/schedule', this.donor?.id]);
  }

  generateReport() {
    this.toastr.success('Relatório gerado com sucesso!');
  }

  printDetails() {
    window.print();
  }

  exportData() {
    this.toastr.success('Exportação concluída!');
  }

  reportIssue() {
    this.toastr.error('Reportando problema...');
  }
}
