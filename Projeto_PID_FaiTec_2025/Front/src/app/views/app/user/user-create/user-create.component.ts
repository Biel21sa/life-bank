import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { User } from '../../../../domain/model/user';
import { UserRole } from '../../../../domain/model/user-role';
import { UserCreateService } from '../../../../services/user/user-create.service';
import { DonationLocation } from '../../../../domain/model/donation-location';
import { DonationLocationReadService } from '../../../../services/donation-location/donation-location-read.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  userForm: FormGroup;
  userRoles = Object.values(UserRole);
  donationLocations: DonationLocation[] = [];

  userRoleLabels = {
    [UserRole.ADMINISTRATOR]: 'Administrador',
    [UserRole.USER]: 'Doador',
    [UserRole.CLINIC]: 'Clínica',
    [UserRole.SYSTEM]: 'Admin do Sistema'
  };

  constructor(
    private fb: FormBuilder,
    private userCreateService: UserCreateService,
    private router: Router,
    private donationLocationService: DonationLocationReadService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      postal_code: ['', Validators.required],
      donation_location_id: [''],
      blood_type: [''],
      nameClinic: [''],
      cnpj: ['']
    });

    this.loadDonationLocations();
  }

  loadDonationLocations() {
    this.donationLocationService.findAll().subscribe({
      next: (locations) => {
        this.donationLocations = locations;
      },
      error: (error) => {
        console.error('Erro ao carregar locais de doação:', error);
      }
    });
  }

  get selectedRole() {
    return this.userForm.get('role')?.value;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      this.userCreateService.create(user).subscribe({
        next: () => {
          this.router.navigate(['/user/list']);
        },
        error: (error) => {
          console.error('Erro ao criar usuário:', error);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/user/list']);
  }
}