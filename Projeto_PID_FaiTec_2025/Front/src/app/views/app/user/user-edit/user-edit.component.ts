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
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

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
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {

  form: FormGroup;
  userId: string = '-1';
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

    console.log(`id do usuario: ${userId}`);
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
      donationLocationId: ['']
    });

    this.form.get('role')?.valueChanges.subscribe(() => {
      this.updateValidators();
    });
  }

  async loadUserById(userId: string) {
    let user = await this.userReadService.findById(userId);
    console.log(user);
    this.form.patchValue(user);
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
    return this.form.get('role')?.value;
  }

  updateValidators() {
    const role = this.selectedRole;

    this.form.get('donationLocationId')?.clearValidators();
    this.form.get('blood_type')?.clearValidators();
    this.form.get('nameClinic')?.clearValidators();
    this.form.get('cnpj')?.clearValidators();

    if (role === UserRole.ADMINISTRATOR) {
      this.form.get('donationLocationId')?.setValidators([Validators.required]);
    } else if (role === UserRole.USER) {
      this.form.get('blood_type')?.setValidators([Validators.required]);
    } else if (role === UserRole.CLINIC) {
      this.form.get('nameClinic')?.setValidators([Validators.required]);
      this.form.get('cnpj')?.setValidators([Validators.required]);
    }

    this.form.get('donationLocationId')?.updateValueAndValidity();
    this.form.get('blood_type')?.updateValueAndValidity();
    this.form.get('nameClinic')?.updateValueAndValidity();
    this.form.get('cnpj')?.updateValueAndValidity();
  }

  validateFields() {
    return this.form.valid;
  }

  async update() {
    if (this.form.valid) {
      const user: User = { ...this.form.value, id: this.userId };

      try {
        await this.userUpdateService.update(this.userId, user);
        this.toastr.success('Usuário atualizado com sucesso');
        this.router.navigate(['/user/list']);
      } catch (error: any) {
        this.toastr.error('Erro ao atualizar usuário');
        console.error(error);
      }
    }
  }

}
