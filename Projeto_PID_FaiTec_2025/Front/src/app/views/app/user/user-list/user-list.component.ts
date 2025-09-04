import { Component, OnInit } from '@angular/core';
import { UserReadService } from '../../../../services/user/user-read.service';
import { User } from '../../../../domain/model/user';
import { UserRole } from '../../../../domain/model/user-role';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDeleteService } from '../../../../services/user/user-delete.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
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
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit{
  
  users: User[] = [];
  dataSource = new MatTableDataSource(this.users);
  displayedColumns: string[] = ['name', 'role', 'contact', 'actions'];
  
  userRoleLabels = {
    [UserRole.ADMINISTRATOR]: 'Administrador',
    [UserRole.USER]: 'Doador',
    [UserRole.CLINIC]: 'Clínica',
    [UserRole.SYSTEM]: 'Admin do Sistema'
  };

  constructor(
    private userReadService: UserReadService,
    private userDeleteService: UserDeleteService,
    private toastrService: ToastrService,
  ){}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(){
    let userList = await this.userReadService.findAll();
    if(userList == null) {
      return;
    }

    this.users = userList;
    this.dataSource.data = this.users;
  }

  getCountByRole(role: string): number {
    return this.users.filter(user => user.role === role).length;
  }

  getUserRoleLabel(role: UserRole): string {
    return this.userRoleLabels[role] || role;
  }

  getRoleClass(role: UserRole): string {
    const classes = {
      [UserRole.ADMINISTRATOR]: 'role-admin',
      [UserRole.USER]: 'role-user', 
      [UserRole.CLINIC]: 'role-clinic',
      [UserRole.SYSTEM]: 'role-system'
    };
    return classes[role] || '';
  }

  getRoleIcon(role: UserRole): string {
    const icons = {
      [UserRole.ADMINISTRATOR]: 'admin_panel_settings',
      [UserRole.USER]: 'volunteer_activism',
      [UserRole.CLINIC]: 'local_hospital',
      [UserRole.SYSTEM]: 'settings'
    };
    return icons[role] || 'person';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async deleteUser(userId: string) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await this.userDeleteService.delete(userId);
        this.toastrService.success('Usuário removido com sucesso!');
        this.loadUsers();
      } catch (error) {
        this.toastrService.error('Erro ao remover usuário');
        console.error(error);
      }
    }
  }
}