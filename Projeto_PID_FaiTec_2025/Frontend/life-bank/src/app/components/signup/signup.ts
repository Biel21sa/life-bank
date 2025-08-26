import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    RouterModule,
    NgClass
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})


export class Signup {

  signupStage = signal("type");
  accountType = "doador";

  updateAccountType(type:string){
    this.accountType = type;
  }
  

}
