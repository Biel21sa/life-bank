import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { User } from '../../../../domain/model/user';
import { UserRole } from '../../../../domain/model/user-role';
import { UserCreateService } from '../../../../services/user/user-create.service';
import { DonationLocation } from '../../../../domain/model/donation-location';
import { DonationLocationReadService } from '../../../../services/donation-location/donation-location-read.service';
import { MunicipalityReadService } from '../../../../services/municipality/municipality-read.service';

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
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup;
  userRoles = Object.values(UserRole);
  donationLocations: DonationLocation[] = [];
  municipalities: any[] = [];

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
    private municipalityService: MunicipalityReadService,
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
      postalCode: ['', Validators.required],
      donationLocationId: [''],
      bloodType: [''],
      gender: [''],
      nameClinic: [''],
      cnpj: [''],
      municipalityId: ['']
    });

    this.userForm.get('role')?.valueChanges.subscribe(() => {
      this.updateValidators();
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

  updateValidators() {
    const role = this.selectedRole;

    // Reset validators
    this.userForm.get('donationLocationId')?.clearValidators();
    this.userForm.get('bloodType')?.clearValidators();
    this.userForm.get('gender')?.clearValidators();
    this.userForm.get('nameClinic')?.clearValidators();
    this.userForm.get('cnpj')?.clearValidators();
    this.userForm.get('municipalityId')?.clearValidators();

    // Add validators based on role
    if (role === UserRole.ADMINISTRATOR) {
      this.userForm.get('donationLocationId')?.setValidators([Validators.required]);
    } else if (role === UserRole.USER) {
      this.userForm.get('bloodType')?.setValidators([Validators.required]);
      this.userForm.get('gender')?.setValidators([Validators.required]);
    } else if (role === UserRole.CLINIC) {
      this.userForm.get('nameClinic')?.setValidators([Validators.required]);
      this.userForm.get('cnpj')?.setValidators([Validators.required]);
      this.userForm.get('municipalityId')?.setValidators([Validators.required]);
    }

    // Update form validation
    this.userForm.get('donationLocationId')?.updateValueAndValidity();
    this.userForm.get('bloodType')?.updateValueAndValidity();
    this.userForm.get('gender')?.updateValueAndValidity();
    this.userForm.get('nameClinic')?.updateValueAndValidity();
    this.userForm.get('cnpj')?.updateValueAndValidity();
    this.userForm.get('municipalityId')?.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.loadMunicipalities();
  }

  loadMunicipalities() {
    this.municipalityService.findAll().subscribe({
      next: (municipalities) => {
        this.municipalities = municipalities;
      },
      error: (error: any) => {
        console.error('Erro ao carregar municípios:', error);
      }
    });
  }

  applyCpfMask(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    event.target.value = value;
    this.userForm.get('cpf')?.setValue(value);
  }

  applyPhoneMask(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    }
    event.target.value = value;
    this.userForm.get('phone')?.setValue(value);
  }

  applyCnpjMask(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
      value = value.replace(/(\d{2})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1/$2');
      value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    event.target.value = value;
    this.userForm.get('cnpj')?.setValue(value);
  }

  applyCepMask(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    event.target.value = value;
    this.userForm.get('postalCode')?.setValue(value);
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