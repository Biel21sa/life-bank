import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { User } from '../../../../domain/model/user';
import { UserRole } from '../../../../domain/model/user-role';
import { UserCreateService } from '../../../../services/user/user-create.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-donor-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgxMaskDirective
  ],
  templateUrl: './donor-create.component.html',
  styleUrl: './donor-create.component.css'
})
export class DonorCreateComponent {
  donorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userCreateService: UserCreateService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.donorForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      bloodType: ['', Validators.required],
      gender: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      postalCode: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.donorForm.valid) {
      const donor: User = {
        ...this.donorForm.value,
        role: UserRole.USER
      };

      this.userCreateService.create(donor).subscribe({
        next: () => {
          this.toastr.success('Doador cadastrado com sucesso!');
          this.router.navigate(['/donor/list']);
        },
        error: (error) => {
          this.toastr.error('Erro ao cadastrar doador');
          console.error('Erro ao criar doador:', error);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/donor/list']);
  }
}