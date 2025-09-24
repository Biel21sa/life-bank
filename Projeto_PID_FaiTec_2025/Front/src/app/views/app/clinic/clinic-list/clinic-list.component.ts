import { Component, OnInit } from '@angular/core';
import { UserReadService } from '../../../../services/user/user-read.service';
import { UserDeleteService } from '../../../../services/user/user-delete.service';
import { User } from '../../../../domain/model/user';
import { UserRole } from '../../../../domain/model/user-role';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-clinic-list',
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
    NgxMaskPipe,
    MatMenu,
    MatMenuModule,
    MatDivider,
    MatListModule
  ],
  templateUrl: './clinic-list.component.html',
  styleUrl: './clinic-list.component.css'
})
export class ClinicListComponent implements OnInit {

  clinics: User[] = [];
  dataSource = new MatTableDataSource(this.clinics);
  displayedColumns: string[] = ['name', 'clinic', 'contact', 'address', 'actions'];

  // controles extras
  isCardView = false;
  isCompactView = false;
  selectedClinic?: User;
  isLoading = false;

  constructor(
    private userReadService: UserReadService,
    private userDeleteService: UserDeleteService,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loadClinics();
  }

  async loadClinics() {
    this.isLoading = true;
    try {
      let clinicList = await this.userReadService.findByRole(UserRole.CLINIC);
      if (clinicList) {
        this.clinics = clinicList;
        this.dataSource.data = this.clinics;
      }
    } finally {
      this.isLoading = false;
    }
  }

  /** ===================== FILTROS E BUSCA ===================== */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch(input: HTMLInputElement) {
    input.value = '';
    this.dataSource.filter = '';
  }

  getFilteredCount(): number {
    return this.dataSource.filteredData.length;
  }

  /** ===================== AÇÕES ===================== */
  isAdministrator(): boolean {
    return this.authenticationService.isAdministrator();
  }

  exportClinics() {
    // exemplo simples em CSV
    const csvContent = [
      ['Nome', 'Email', 'CNPJ', 'Telefone'],
      ...this.clinics.map(c => [c.name, c.email, c.cnpj, c.phone])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'clinicas.csv';
    link.click();
  }

  refreshData() {
    this.loadClinics();
  }

  contactClinic(clinic: User) {
    window.open(`mailto:${clinic.email}?subject=Contato com a clínica ${clinic.nameClinic}`, '_blank');
  }

  viewReports(clinic: User) {
    this.toastr.info(`Visualizando relatórios da clínica ${clinic.nameClinic}`);
  }

  viewHistory(clinic: User) {
    this.toastr.info(`Visualizando histórico da clínica ${clinic.nameClinic}`);
  }

  async deleteClinic(clinicId: string) {
    if (confirm('Tem certeza que deseja excluir esta clínica?')) {
      try {
        await this.userDeleteService.delete(clinicId);
        this.toastr.success('Clínica removida com sucesso!');
        this.loadClinics();
      } catch (error) {
        this.toastr.error('Erro ao remover clínica');
        console.error(error);
      }
    }
  }

  /** ===================== VISUALIZAÇÃO ===================== */
  toggleCompactView() {
    this.isCompactView = !this.isCompactView;
  }

  toggleCardView() {
    this.isCardView = !this.isCardView;
  }

  isRowHighlighted(row: User): boolean {
    return this.selectedClinic?.id === row.id;
  }

  selectRow(row: User) {
    this.selectedClinic = row;
  }

  selectClinic(clinic: User) {
    this.selectedClinic = clinic;
  }

  trackByClinicId(index: number, clinic: User) {
    return clinic.id;
  }
}