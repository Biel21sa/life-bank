import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';

import { Blood } from '../../../domain/model/blood';
import { BloodReadService } from '../../../services/blood/blood-read.service';
import { BloodUpdateService } from '../../../services/blood/blood-update.service';
import { AuthenticationService } from '../../../services/security/authentication.service';

@Component({
  selector: 'app-blood-withdrawal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './blood-withdrawal.component.html',
  styleUrls: ['./blood-withdrawal.component.css']
})
export class BloodWithdrawalComponent implements OnInit {
  // Lista original completa de bolsas de sangue
  bloodList: Blood[] = []; 
  // Lista filtrada e ordenada que será usada na tabela
  filteredBloodList: Blood[] = []; 
  selection = new SelectionModel<Blood>(true, []);
  displayedColumns: string[] = ['select', 'bloodType', 'quantity', 'expirationDate'];
  locationId: string = '';
  selectedReason: string = '';

  // Propriedades para o select de tipo sanguíneo
  bloodTypes: string[] = [];
  selectedBloodType: string = '';

  constructor(
    private router: Router,
    private bloodReadService: BloodReadService,
    private bloodUpdateService: BloodUpdateService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.locationId = this.authenticationService.getDonationLocationId()!;
    this.loadBloodList();
  }

  loadBloodList() {
    this.bloodReadService.getBloodByLocationId(this.locationId).subscribe({
      next: (data) => {
        // Ordena as bolsas por data de validade (mais próxima primeiro)
        this.bloodList = data.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());
        this.filteredBloodList = [...this.bloodList]; // Inicializa a lista filtrada
        this.populateBloodTypes();
      },
      error: () => this.toastr.error('Erro ao carregar bolsas de sangue')
    });
  }

  // Popula o array de tipos sanguíneos para o select
  populateBloodTypes() {
    const types = new Set<string>();
    this.bloodList.forEach(blood => types.add(blood.bloodType));
    this.bloodTypes = Array.from(types).sort();
  }

  // Método para lidar com a seleção do tipo sanguíneo
  onBloodTypeChange(type: string) {
    this.selectedBloodType = type;
    if (type === 'Todos') {
      this.filteredBloodList = [...this.bloodList];
    } else {
      this.filteredBloodList = this.bloodList.filter(blood => blood.bloodType === type);
    }
    // Mantém a seleção de bolsas consistente após o filtro
    this.selection.clear();
  }

  isAllSelected() {
    return this.selection.selected.length === this.filteredBloodList.length;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.filteredBloodList.forEach(row => this.selection.select(row));
  }

  onReasonChange(reason: string) {
    this.selectedReason = reason;
  }

  onSubmit() {
    if (this.selection.selected.length > 0 && this.selectedReason !== '') {
      const request = {
        bloodIds: this.selection.selected.map(blood => blood.id!),
        reason: this.selectedReason
      };

      this.bloodUpdateService.withdrawBlood(request).subscribe({
        next: () => {
          this.toastr.success('Retirada realizada com sucesso');
          this.router.navigate(['/blood-stock']);
        },
        error: () => this.toastr.error('Erro ao realizar retirada')
      });
    } else {
      this.toastr.warning('Selecione pelo menos uma bolsa e um motivo para a retirada.');
    }
  }

  goBack() {
    this.router.navigate(['/admin-home']);
  }

  isExpired(dateString: string): boolean {
    const expirationDate = new Date(dateString);
    const now = new Date();
    // A data de validade é considerada no final do dia
    expirationDate.setHours(23, 59, 59, 999);
    return expirationDate.getTime() < now.getTime();
  }
}