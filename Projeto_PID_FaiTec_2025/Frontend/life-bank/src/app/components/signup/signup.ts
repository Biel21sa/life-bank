import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    RouterModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})


export class Signup {

  signupStage = signal("type")

  

}
