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
  ],
  templateUrl: './donor-list.component.html',
  styleUrl: './donor-list.component.css'
})
export class DonorListComponent implements OnInit {

  donors: User[] = [];
  dataSource = new MatTableDataSource(this.donors);
  displayedColumns: string[] = ['name', 'bloodType', 'contact', 'address', 'apto', 'actions'];

  constructor(
    private userReadService: UserReadService,
    private userDeleteService: UserDeleteService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadDonors();
  }

  async loadDonors() {
    let donorList = await this.userReadService.findByRole(UserRole.USER);
    if (donorList == null) {
      return;
    }

    this.donors = donorList;
    this.dataSource.data = this.donors;
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
}