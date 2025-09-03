import { Component, OnInit } from '@angular/core';
import { UserReadService } from '../../../services/user/user-read.service';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../domain/model/user';
import { ToastrService } from 'ngx-toastr';
import { UserUpdateService } from '../../../services/user/user-update.service';

@Component({
  selector: 'app-my-profile',
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {

  email: string = '';
  name: string = '';

  dataForm: FormGroup;
  passwordForm: FormGroup;

  nameMinLen: number = 1;
  nameMaxLen: number = 20;
  passwordMinLen: number = 1;
  passwordMaxLen: number = 20;

  user: User;

  constructor(
    private userReadService: UserReadService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private userUpdateService: UserUpdateService,
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    let email = this.authenticationService.getAuhenticatedUserEmail();

    this.user = await this.userReadService.findByEmail(email);
  }

  initializeForm() {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', []],
      newPassword: ['', []],
      confirmNewPassword: ['', []],
    })
  }

  async updatePassword() {
    console.log("Vida que segue!")
    let oldPassword = this.passwordForm.controls['oldPassword'].value;
    let newPassword = this.passwordForm.controls['newPassword'].value;
    let confirmNewPassword = this.passwordForm.controls['confirmNewPassword'].value;

    console.log(`${oldPassword} | ${newPassword} | ${confirmNewPassword}`);

    await this.userUpdateService.updatePassword(this.user.id!, oldPassword, newPassword);
  }

  validateNewPassword() {

  }

  arePasswordsValid() {

  }

}
