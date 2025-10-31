import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-list',
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
    MatMenuModule,
    MatListModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  dataSource = new MatTableDataSource(this.users);
  displayedColumns: string[] = ['avatar', 'name', 'role', 'contact', 'actions'];

  isCardView = false;
  isCompactView = false;
  selectedUser?: User;
  isLoading = false;

  userRoleLabels = {
    [UserRole.ADMINISTRATOR]: 'Administrador',
    [UserRole.USER]: 'Doador',
    [UserRole.CLINIC]: 'Clínica',
    [UserRole.SYSTEM]: 'Admin do Sistema'
  };

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private userReadService: UserReadService,
    private userDeleteService: UserDeleteService,
    private toastrService: ToastrService,
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.performSearch(searchTerm);
      });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadUsers(): Promise<void> {
    this.isLoading = true;
    try {
      const userList = await this.userReadService.findAll();
      if (userList) {
        this.users = userList;
        this.dataSource.data = this.users;
      }
    } catch (error) {
      this.toastrService.error('Erro ao carregar usuários');
      console.error('Erro ao carregar usuários:', error);
    } finally {
      this.isLoading = false;
    }
  }

  refreshData(): void {
    this.loadUsers();
    this.toastrService.info('Dados atualizados');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue);
  }

  private performSearch(searchTerm: string): void {
    this.dataSource.filter = searchTerm.trim().toLowerCase();
  }

  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    this.dataSource.filter = '';
  }

  getFilteredCount(): number {
    return this.dataSource.filteredData.length;
  }

  toggleCardView(): void {
    this.isCardView = !this.isCardView;
    this.toastrService.info(`Visualização alterada para ${this.isCardView ? 'cards' : 'lista'}`);
  }

  toggleCompactView(): void {
    this.isCompactView = !this.isCompactView;
    this.toastrService.info(`Visualização ${this.isCompactView ? 'compacta' : 'normal'} ativada`);
  }

  selectRow(user: User): void {
    this.selectedUser = this.selectedUser?.id === user.id ? undefined : user;
  }

  isRowHighlighted(user: User): boolean {
    return this.selectedUser?.id === user.id;
  }

  selectUser(user: User): void {
    this.selectedUser = this.selectedUser?.id === user.id ? undefined : user;
  }

  async deleteUser(userId: string): Promise<void> {
    const user = this.users.find(u => u.id === userId);
    const confirmMessage = `Tem certeza que deseja excluir o usuário "${user?.name}"?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await this.userDeleteService.delete(userId);
      this.toastrService.success('Usuário removido com sucesso!');
      await this.loadUsers();
    } catch (error) {
      this.toastrService.error('Erro ao remover usuário');
      console.error('Erro ao excluir usuário:', error);
    }
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

  getUserInitials(name: string): string {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  getUserAvatarColor(name: string): string {
    if (!name) return '#1976d2';

    const colors = [
      '#1976d2'
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }

  trackByUserId(index: number, user: User): string {
    return user.id || index.toString();
  }
}
