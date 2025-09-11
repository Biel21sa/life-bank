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
  ],
  templateUrl: './clinic-list.component.html',
  styleUrl: './clinic-list.component.css'
})
export class ClinicListComponent implements OnInit {

  clinics: User[] = [];
  dataSource = new MatTableDataSource(this.clinics);
  displayedColumns: string[] = ['name', 'clinic', 'contact', 'address', 'actions'];

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
    let clinicList = await this.userReadService.findByRole(UserRole.CLINIC);
    if (clinicList == null) {
      return;
    }

    this.clinics = clinicList;
    this.dataSource.data = this.clinics;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAdministrator(): boolean {
    return this.authenticationService.isAdministrator();
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
}