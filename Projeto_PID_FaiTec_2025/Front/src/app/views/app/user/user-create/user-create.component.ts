import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { User } from '../../../../domain/model/user';
import { UserRole } from '../../../../domain/model/user-role';
import { UserCreateService } from '../../../../services/user/user-create.service';
import { DonationLocation } from '../../../../domain/model/donation-location';
import { DonationLocationReadService } from '../../../../services/donation-location/donation-location-read.service';
import { MunicipalityReadService } from '../../../../services/municipality/municipality-read.service';
import { finalize } from 'rxjs';

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
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup;
  userRoles = Object.values(UserRole);
  donationLocations: DonationLocation[] = [];
  municipalities: any[] = [];
  hidePassword = true;
  isSubmitting = false;

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
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      street: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      donationLocationId: [''],
      bloodType: [''],
      gender: [''],
      nameClinic: [''],
      cnpj: [''],
      municipalityId: [''],
      acceptTerms: [false, Validators.requiredTrue]
    });

    this.userForm.get('role')?.valueChanges.subscribe(() => {
      this.updateValidators();
    });
  }

  ngOnInit(): void {
    this.loadDonationLocations();
    this.loadMunicipalities();
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

  get selectedRole(): UserRole {
    return this.userForm.get('role')?.value as UserRole;
  }

  updateValidators() {
    const role = this.selectedRole;

    const fieldsToClear = [
      'donationLocationId', 'bloodType', 'gender',
      'nameClinic', 'cnpj', 'municipalityId'
    ];

    fieldsToClear.forEach(fieldName => {
      const control = this.userForm.get(fieldName);
      control?.clearValidators();
      control?.setValue('');
    });

    if (role === UserRole.ADMINISTRATOR) {
      this.userForm.get('donationLocationId')?.setValidators([Validators.required]);
    } else if (role === UserRole.USER) {
      this.userForm.get('bloodType')?.setValidators([Validators.required]);
      this.userForm.get('gender')?.setValidators([Validators.required]);
    } else if (role === UserRole.CLINIC) {
      this.userForm.get('nameClinic')?.setValidators([Validators.required]);
      this.userForm.get('cnpj')?.setValidators([Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)]);
      this.userForm.get('municipalityId')?.setValidators([Validators.required]);
    }

    fieldsToClear.forEach(fieldName => {
      this.userForm.get(fieldName)?.updateValueAndValidity();
    });
  }

  applyCpfMask(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    event.target.value = value;
    this.userForm.get('cpf')?.setValue(value, { emitEvent: false });
  }

  applyPhoneMask(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    event.target.value = value;
    this.userForm.get('phone')?.setValue(value, { emitEvent: false });
  }

  applyCnpjMask(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.substring(0, 14);
    if (value.length > 12) {
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else if (value.length > 8) {
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, '$1.$2.$3/$4');
    } else if (value.length > 5) {
      value = value.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{1,3})/, '$1.$2');
    }
    event.target.value = value;
    this.userForm.get('cnpj')?.setValue(value, { emitEvent: false });
  }

  applyCepMask(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.substring(0, 8);
    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    }
    event.target.value = value;
    this.userForm.get('postalCode')?.setValue(value, { emitEvent: false });
  }

  private isSectionValid(fields: string[]): boolean {
    return fields.every(field => this.userForm.get(field)?.valid ?? false);
  }

  get isPersonalSectionValid(): boolean {
    return this.isSectionValid(['name', 'role', 'cpf', 'email', 'phone', 'password']);
  }

  get isAddressSectionValid(): boolean {
    return this.isSectionValid(['street', 'number', 'neighborhood', 'postalCode']);
  }

  get isSpecificSectionValid(): boolean {
    const role = this.selectedRole;
    if (role === UserRole.ADMINISTRATOR) {
      return this.isSectionValid(['donationLocationId']);
    }
    if (role === UserRole.USER) {
      return this.isSectionValid(['bloodType', 'gender']);
    }
    if (role === UserRole.CLINIC) {
      return this.isSectionValid(['nameClinic', 'cnpj', 'municipalityId']);
    }
    return !role;
  }

  get isTermsSectionValid(): boolean {
    return this.isSectionValid(['acceptTerms']);
  }

  getStepClass(step: string): { 'step-completed': boolean } {
    const sectionValidityMap: { [key: string]: boolean } = {
      'personal': this.isPersonalSectionValid,
      'address': this.isAddressSectionValid,
      'specific': this.isSpecificSectionValid,
      'terms': this.isTermsSectionValid,
    };
    return { 'step-completed': sectionValidityMap[step] };
  }

  getStepIndicatorClass(step: string): string {
    return this.getStepClass(step)['step-completed'] ? 'indicator-completed' : 'indicator-pending';
  }

  getStepIcon(step: string): string {
    return this.getStepClass(step)['step-completed'] ? 'check_circle' : 'radio_button_unchecked';
  }

  getSectionClass(section: string): object {
    return {};
  }

  getDonationLocationName(id: string): string | undefined {
    const numericId = String(id);
    return this.donationLocations.find(loc => loc.id === numericId)?.name;
  }

  getMunicipalityName(id: string): string | undefined {
    const numericId = Number(id);
    const municipality = this.municipalities.find(m => m.id === numericId);
    return municipality ? `${municipality.name} - ${municipality.state}` : undefined;
  }

  getSectionStatusClass(section: string): string {
    const isSectionValidMap: { [key: string]: boolean } = {
      'personal': this.isPersonalSectionValid,
      'address': this.isAddressSectionValid,
      'specific': this.isSpecificSectionValid,
      'terms': this.isTermsSectionValid,
    };
    return isSectionValidMap[section] ? 'status-valid' : 'status-pending';
  }

  getSectionStatusIcon(section: string): string {
    return this.getSectionStatusClass(section) === 'status-valid' ? 'check_circle' : 'pending';
  }

  getRoleIcon(role: UserRole | string): string {
    switch (role) {
      case UserRole.ADMINISTRATOR: return 'admin_panel_settings';
      case UserRole.USER: return 'volunteer_activism';
      case UserRole.CLINIC: return 'local_hospital';
      case UserRole.SYSTEM: return 'security';
      default: return 'person';
    }
  }

  getRoleTitle(role: UserRole | string): string {
    switch (role) {
      case UserRole.ADMINISTRATOR: return 'Dados do Administrador';
      case UserRole.USER: return 'Dados do Doador';
      case UserRole.CLINIC: return 'Dados da Clínica';
      default: return 'Dados Específicos';
    }
  }

  getFormSummary(): string {
    const totalControls = Object.keys(this.userForm.controls).filter(key => {
      const control = this.userForm.get(key);
      return control?.validator;
    });

    const validControls = Object.keys(this.userForm.controls).filter(key => {
      const control = this.userForm.get(key);
      return control?.valid;
    });

    const requiredCount = totalControls.length;
    const validCount = validControls.length;

    if (this.userForm.valid) {
      return 'Todos os campos foram preenchidos corretamente. Pronto para criar!';
    }
    return `${validCount} de ${requiredCount} campos obrigatórios preenchidos.`;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const user: User = this.userForm.value;

    this.userCreateService.create(user).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        console.log('Usuário criado com sucesso!');
        this.router.navigate(['/user/list']);
      },
      error: (error) => {
        console.error('Erro ao criar usuário:', error);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/user/list']);
  }
}