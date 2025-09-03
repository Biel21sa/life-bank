import { Component, OnInit } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../domain/model/user';
import { UserDeleteService } from '../../../../services/user/user-delete.service';
import { UserReadService } from '../../../../services/user/user-read.service';


@Component({
  selector: 'app-user-detail',
  imports: [
    RouterModule,
    FontAwesomeModule,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit {

  fa = fontawesome;
      
  user?: User;

  constructor(
    private userReadService: UserReadService,
    private userDeleteService: UserDeleteService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void {
    let userId = this.route.snapshot.paramMap.get('id');
    this.loadUserById(userId!);
  }

  async loadUserById(userId: string) {
    this.user = await this.userReadService.findById(userId);
    console.log(this.user);
  }

}
