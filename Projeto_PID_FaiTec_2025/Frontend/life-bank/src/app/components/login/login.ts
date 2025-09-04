import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserCredentialDto } from '../../domain/dto/user-credential-dto';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-login',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  form: FormGroup

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    console.log(environment.api_endpoint);
    
  }

  validateFields(){
    return this.form.controls['email'].valid && this.form.controls['password'].valid
  }

  login() {
    console.log('botao de login clicado');

    let credentials: UserCredentialDto = {
      email: this.form.controls['email'].value!,
      password: this.form.controls['password'].value!,
    };

    console.log(credentials);
  }
}
