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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-donor-list',
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
    MatListModule,
    MatMenuModule,
    MatChipsModule
  ],
  templateUrl: './donor-list.component.html',
  styleUrl: './donor-list.component.css'
})
export class DonorListComponent implements OnInit {

  donors: User[] = [];
  dataSource = new MatTableDataSource<User>(this.donors);
  displayedColumns: string[] = ['name', 'bloodType', 'contact', 'address', 'status', 'actions'];

  viewMode: 'table' | 'cards' = 'table';
  selectedBloodTypes: string[] = [];
  bloodTypes: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  isLoading = false;

  constructor(
    private userReadService: UserReadService,
    private userDeleteService: UserDeleteService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadDonors();
  }

  async loadDonors() {
    this.isLoading = true;
    try {
      let donorList = await this.userReadService.findByRole(UserRole.USER);
      if (donorList) {
        this.donors = donorList;
        this.dataSource.data = this.donors;
      }
    } catch (error) {
      this.toastr.error('Erro ao carregar doadores');
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  getAptoDonorsCount(): number {
    return this.donors.filter(d => d.apto).length;
  }

  getAptoPercentage(): number {
    return this.donors.length > 0
      ? Math.round((this.getAptoDonorsCount() / this.donors.length) * 100)
      : 0;
  }

  getBloodTypesCount(): number {
    return new Set(this.donors.map(d => d.bloodType).filter(Boolean)).size;
  }

  getFilteredCount(): number {
    return this.dataSource.filteredData.length;
  }

  clearFilters() {
    this.selectedBloodTypes = [];
    this.dataSource.filter = '';
  }

  toggleBloodTypeFilter(type: string) {
    if (this.selectedBloodTypes.includes(type)) {
      this.selectedBloodTypes = this.selectedBloodTypes.filter(t => t !== type);
    } else {
      this.selectedBloodTypes.push(type);
    }

    this.dataSource.filterPredicate = (donor: User) => {
      return this.selectedBloodTypes.length === 0 ||
        this.selectedBloodTypes.includes(donor.bloodType ?? '');
    };
    this.dataSource.filter = Math.random().toString();
  }

  exportData() {
    const json = JSON.stringify(this.donors, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donors.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  refreshData() {
    this.loadDonors();
  }

  toggleView() {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }

  trackByDonorId(index: number, donor: User) {
    return donor.id;
  }

  async deleteDonor(donorId: string) {
    if (confirm('Tem certeza que deseja excluir este doador?')) {
      try {
        await this.userDeleteService.delete(donorId);
        this.toastr.success('Doador removido com sucesso!');
        this.loadDonors();
      } catch (error) {
        this.toastr.error('Erro ao remover doador');
        console.error(error);
      }
    }
  }

  getCountByBloodType(bloodType: string): number {
    return this.donors.filter(donor => donor.bloodType === bloodType).length;
  }

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
