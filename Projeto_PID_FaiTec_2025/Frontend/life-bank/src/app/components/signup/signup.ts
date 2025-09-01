import { NgClass, NgStyle } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    RouterModule,
    NgClass,
    NgStyle,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})


export class Signup {
  
  form!: FormGroup

  signupStage = signal("type");
  accountType = "doador";

  constructor(private formBuilder: FormBuilder){
    this.initializeForm()
  }

  initializeForm(){
    this.form = this.formBuilder.group({
      fullname: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      cnpj: ['',[
        Validators.required,
        Validators.minLength(14)
      ]],
      password:['',[
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]],
      repeatpassword:['',[
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]]
    })
  }

  validateCredentials(){
    let validName = this.form.controls['fullname'].valid
    let validEmail = this.form.controls['email'].valid
    let validCnpj = this.form.controls['cnpj'].valid
    let validPassword = this.form.controls['password'].valid
    let equalPasswords = this.form.controls['repeatpassword'].valid && this.form.controls['repeatpassword'].value === this.form.controls['password'].value
    
    if (this.accountType == 'doador'){
      return validName && validEmail && validPassword && equalPasswords
    } else {
      return validName && validEmail && validCnpj && validPassword && equalPasswords
    }
  }

  updateAccountType(type:string){
    this.accountType = type;
  }
  

}
