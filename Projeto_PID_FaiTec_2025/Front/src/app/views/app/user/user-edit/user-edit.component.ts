import { Component, OnInit } from '@angular/core';
import { UserReadService } from '../../../../services/user/user-read.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserUpdateService } from '../../../../services/user/user-update.service';
import { User } from '../../../../domain/model/user';
import { UserRole } from '../../../../domain/model/user-role';
import { DonationLocation } from '../../../../domain/model/donation-location';
import { DonationLocationReadService } from '../../../../services/donation-location/donation-location-read.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-edit',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    NgxMaskDirective,
    MatIconModule
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {

  form: FormGroup;
  userId: string = '-1';
  isSubmitting = false;
  userRoles = Object.values(UserRole);
  donationLocations: DonationLocation[] = [];

  userRoleLabels = {
    [UserRole.ADMINISTRATOR]: 'Administrador',
    [UserRole.USER]: 'Doador',
    [UserRole.CLINIC]: 'Clínica',
    [UserRole.SYSTEM]: 'Admin do Sistema'
  };

  constructor(
    private userReadService: UserReadService,
    private userUpdateService: UserUpdateService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private donationLocationService: DonationLocationReadService
  ) {
    this.initializeForm();
    this.loadDonationLocations();
  }

  ngOnInit(): void {
    let userId = this.route.snapshot.paramMap.get('id');
    this.userId = userId!;
    this.loadUserById(userId!);
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      postalCode: ['', Validators.required],
      donationLocationId: [''],
      bloodType: [''],
      gender: [''],
      nameClinic: [''],
      cnpj: ['']
    });

    this.form.get('role')?.valueChanges.subscribe(() => {
      this.updateValidators();
    });
  }

  async loadUserById(userId: string) {
    let user = await this.userReadService.findById(userId);
    this.form.patchValue(user);
    this.form.markAsPristine();

  }

  loadDonationLocations() {
    this.donationLocationService.findAll().subscribe({
      next: (locations) => (this.donationLocations = locations),
      error: (error) => console.error('Erro ao carregar locais de doação:', error)
    });
  }

  get selectedRole() {
    return this.form.get('role')?.value;
  }

  updateValidators() {
    const role = this.selectedRole;

    this.form.get('donationLocationId')?.clearValidators();
    this.form.get('bloodType')?.clearValidators();
    this.form.get('nameClinic')?.clearValidators();
    this.form.get('cnpj')?.clearValidators();

    if (role === UserRole.ADMINISTRATOR) {
      this.form.get('donationLocationId')?.setValidators([Validators.required]);
    } else if (role === UserRole.USER) {
      this.form.get('bloodType')?.setValidators([Validators.required]);
    } else if (role === UserRole.CLINIC) {
      this.form.get('nameClinic')?.setValidators([Validators.required]);
      this.form.get('cnpj')?.setValidators([Validators.required]);
    }

    this.form.updateValueAndValidity();
  }

  validateFields() {
    return this.form.valid;
  }

  async update() {
    if (this.form.valid) {
      this.isSubmitting = true;
      const user: User = { ...this.form.value, id: this.userId };

      try {
        await this.userUpdateService.update(this.userId, user);
        this.toastr.success('Usuário atualizado com sucesso');
        this.router.navigate(['/user/list']);
      } catch (error: any) {
        this.toastr.error('Erro ao atualizar usuário');
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  hasPersonalChanges(): boolean {
    return this.form.get('name')?.dirty ||
      this.form.get('cpf')?.dirty ||
      this.form.get('email')?.dirty ||
      this.form.get('phone')?.dirty || false;
  }

  hasAddressChanges(): boolean {
    return this.form.get('street')?.dirty ||
      this.form.get('number')?.dirty ||
      this.form.get('neighborhood')?.dirty ||
      this.form.get('postalCode')?.dirty || false;
  }

  hasSpecificChanges(): boolean {
    return this.form.get('donationLocationId')?.dirty ||
      this.form.get('bloodType')?.dirty ||
      this.form.get('gender')?.dirty ||
      this.form.get('nameClinic')?.dirty ||
      this.form.get('cnpj')?.dirty || false;
  }

  hasAnyChanges(): boolean {
    return this.hasPersonalChanges() || this.hasAddressChanges() || this.hasSpecificChanges();
  }

  getDonationLocationName(id: string): string | undefined {
    const numericId = Number(id);
    return this.donationLocations.find(loc => loc.id === numericId)?.name;
  }

  getPersonalSectionClass() {
    return this.hasPersonalChanges() ? 'modified' : 'unchanged';
  }

  getAddressSectionClass() {
    return this.hasAddressChanges() ? 'modified' : 'unchanged';
  }

  getAdminSectionClass() {
    return this.hasSpecificChanges() ? 'modified' : 'unchanged';
  }

  getDonorSectionClass() {
    return this.hasSpecificChanges() ? 'modified' : 'unchanged';
  }

  getClinicSectionClass() {
    return this.hasSpecificChanges() ? 'modified' : 'unchanged';
  }

  getPersonalStatusClass() {
    return this.hasPersonalChanges() ? 'modified' : 'unchanged';
  }

  getAddressStatusClass() {
    return this.hasAddressChanges() ? 'modified' : 'unchanged';
  }

  getSpecificStatusClass() {
    return this.hasSpecificChanges() ? 'modified' : 'unchanged';
  }

  getPersonalStatusIcon() {
    return this.hasPersonalChanges() ? 'edit' : 'check_circle';
  }

  getAddressStatusIcon() {
    return this.hasAddressChanges() ? 'edit' : 'check_circle';
  }

  getSpecificStatusIcon() {
    return this.hasSpecificChanges() ? 'edit' : 'check_circle';
  }

  getRoleIcon(role: UserRole): string {
    switch (role) {
      case UserRole.ADMINISTRATOR: return 'admin_panel_settings';
      case UserRole.USER: return 'volunteer_activism';
      case UserRole.CLINIC: return 'local_hospital';
      case UserRole.SYSTEM: return 'settings';
      default: return 'person';
    }
  }

  getRoleTitle(role: UserRole): string {
    return this.userRoleLabels[role] || 'Usuário';
  }

  getFormSummary(): string {
    if (!this.hasAnyChanges()) {
      return 'Nenhuma alteração realizada até o momento.';
    }
    return 'Existem alterações pendentes. Revise os dados antes de salvar.';
  }
}
