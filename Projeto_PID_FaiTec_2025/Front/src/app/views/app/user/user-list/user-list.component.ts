import { Component, OnInit } from '@angular/core';
import { UserReadService } from '../../../../services/user/user-read.service';
import { User } from '../../../../domain/model/user';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDeleteService } from '../../../../services/user/user-delete.service';

@Component({
  selector: 'app-user-list',
  imports: [
    RouterModule,
    FontAwesomeModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit{

    fa = fontawesome;
  
  users: User[] = [];

  constructor(
    private userReadService: UserReadService,
    private userDeleteService: UserDeleteService,
    private toastrService: ToastrService,
  ){}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(){
    console.log('preparando para obter os usuarios');

    let userList = await this.userReadService.findAll();
    if(userList == null) {
      console.log('nenhum usuario encontrado...');
      return;
    }

    console.log(userList);

    this.users = userList;

    console.log('usuarios obtidos com sucesso');
  }

  async deleteUser(userId: string) {
    try {
      console.log(`removendo o usuario com o id: ${userId}`);

      await this.userDeleteService.delete(userId);

      this.toastrService.success('Usuário removido com sucesso!');

      console.log('usuario removido com sucesso!');

      this.loadUsers();
    } catch (error) {
      console.error(error);
    }
  }

}
