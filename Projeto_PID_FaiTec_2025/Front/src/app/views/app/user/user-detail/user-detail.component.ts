import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { User } from '../../../../domain/model/user';
import { UserRole } from '../../../../domain/model/user-role';
import { UserReadService } from '../../../../services/user/user-read.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';


@Component({
  selector: 'app-user-detail',
  imports: [
    RouterModule,
    FontAwesomeModule,
    MatCardModule,
    MatButtonModule,
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

}
