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
  fullnameCharacterMin = 4;
  fullnameCharacterMax = 30;
  passwordCharacterMin = 6;
  passwordCharacterMax = 20;

  signupStage = signal("type");
  accountType = "doador";

  constructor(private formBuilder: FormBuilder){
    this.initializeForm()
  }

  initializeForm(){
    this.form = this.formBuilder.group({
      fullname: ['', [
        Validators.required,
        Validators.minLength(this.fullnameCharacterMin),
        Validators.maxLength(this.fullnameCharacterMax)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      cnpj: ['',[
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14)
      ]],
      password:['',[
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]],
      repeatpassword:['',[
        Validators.required,
        Validators.minLength(this.passwordCharacterMin),
        Validators.maxLength(this.passwordCharacterMax)
      ]]
    })
  }

  validateCredentials(){
    let validName = this.form.controls['fullname'].valid
    let validEmail = this.form.controls['email'].valid
    let validCnpj = this.form.controls['cnpj'].valid
    let validPassword = this.form.controls['password'].valid
    let equalPasswords = this.passwordsAreEqual()
    
    if (this.accountType == 'doador'){
      return validName && validEmail && validPassword && equalPasswords
    } else {
      return validName && validEmail && validCnpj && validPassword && equalPasswords
    }
  }

  passwordsAreEqual():boolean {
    return this.form.controls['repeatpassword'].valid && this.form.controls['repeatpassword'].value === this.form.controls['password'].value
  }

  updateAccountType(type:string){
    this.accountType = type;
  }
  

}
