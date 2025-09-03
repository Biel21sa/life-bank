import { Component, OnInit } from '@angular/core';

import { Router, RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { UserRole } from '../../../domain/model/user-role';
import { User } from '../../../domain/model/user';
import { UserCreateService } from '../../../services/user/user-create.service';


@Component({
  selector: 'app-sign-up',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    FormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  form: FormGroup;

  nameMinLength: number = 1;
  nameMaxLength: number = 10;

  passwordMinLength: number = 1;
  passwordMaxLength: number = 10;

  constructor(private formBuilder: FormBuilder, private userCreateService: UserCreateService, private router: Router) {
    this.initializeForm();
  }

  ngOnInit(): void { }

  initializeForm() {
    console.log('formulario de sign-up sendo inicializado');
    this.form = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(this.nameMinLength),
        Validators.maxLength(this.nameMaxLength),
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(this.passwordMinLength),
        Validators.maxLength(this.passwordMaxLength),
      ]],
      repeatPassword: ['', [
        Validators.required,
        Validators.minLength(this.passwordMinLength),
        Validators.maxLength(this.passwordMaxLength),
      ]],
    });
  }

  validateFields(): boolean {
    let isFullnameValid = this.form.controls['name'].valid;
    let isEmailValid = this.form.controls['email'].valid;
    let isPasswordValid = this.form.controls['password'].valid;
    let isRepeatPasswordValid = this.form.controls['repeatPassword'].valid;

    if (!this.arePasswordsValid()) {
      return false;
    }

    return isFullnameValid
      && isEmailValid
      && isPasswordValid
      && isRepeatPasswordValid;
  }

  arePasswordsValid() {
    let password = this.form.controls['password'].value;
    let repeatPassword = this.form.controls['repeatPassword'].value;

    return password === repeatPassword;
  }

  createAccount() {
    let user: User = {
      name: this.form.controls['name'].value,
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
      role: UserRole.USER
    };

    this.userCreateService.create(user).subscribe({
      next: value => {
        console.log(value);
        this.router.navigate(['account/sign-in']);
      },
      error: err => {
        console.log(err);
      }
    })

  }

}
