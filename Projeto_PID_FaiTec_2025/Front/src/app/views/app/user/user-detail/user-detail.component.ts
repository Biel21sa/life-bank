import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { User } from '../../../../domain/model/user';
import { UserRole } from '../../../../domain/model/user-role';
import { UserReadService } from '../../../../services/user/user-read.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';


@Component({
  selector: 'app-user-detail',
  imports: [
    RouterModule,
    FontAwesomeModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    NgxMaskPipe,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {

  fa = fontawesome;
  user?: User;

  userRoleLabels = {
    [UserRole.ADMINISTRATOR]: 'Administrador',
    [UserRole.USER]: 'Doador',
    [UserRole.CLINIC]: 'Clínica',
    [UserRole.SYSTEM]: 'Admin do Sistema'
  };

  constructor(
    private userReadService: UserReadService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    let userId = this.route.snapshot.paramMap.get('id');
    this.loadUserById(userId!);
  }

  async loadUserById(userId: string) {
    this.user = await this.userReadService.findById(userId);
    console.log(this.user);
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

}
