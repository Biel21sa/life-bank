import { Component, OnInit } from '@angular/core';
import { UserReadService } from '../../../services/user/user-read.service';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/security/authentication.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { User } from '../../../domain/model/user';
import { ToastrService } from 'ngx-toastr';
import { UserUpdateService } from '../../../services/user/user-update.service';
import { DonationLocationReadService } from '../../../services/donation-location/donation-location-read.service';
import { DonationLocation } from '../../../domain/model/donation-location';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-my-profile',
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgxMaskDirective,
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {

  user: User | null = null;
  selectedTab = 0;
  donationLocations: DonationLocation[] = [];

  dataForm: FormGroup;
  passwordForm: FormGroup;

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private userReadService: UserReadService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private userUpdateService: UserUpdateService,
    private donationLocationService: DonationLocationReadService,
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.loadUserData();
    this.loadDonationLocations();
  }

  initializeForms() {
    this.dataForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      street: ['', [Validators.required]],
      number: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      donationLocationId: [''],
      bloodType: [''],
      nameClinic: [''],
      cnpj: ['']
    });

    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmNewPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async loadUserData() {
    try {
      const email = this.authenticationService.getAuhenticatedUserEmail();
      this.user = await this.userReadService.findByEmail(email);

      if (this.user) {
        this.dataForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          cpf: this.user.cpf,
          phone: this.user.phone,
          street: this.user.street,
          number: this.user.number,
          neighborhood: this.user.neighborhood,
          postalCode: this.user.postalCode,
          donationLocationId: this.user.donationLocationId,
          bloodType: this.user.bloodType,
          nameClinic: this.user.nameClinic,
          cnpj: this.user.cnpj
        });
      }
    } catch (error) {
      this.toastr.error('Erro ao carregar dados do usuário');
      console.error(error);
    }
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

  async updateData() {
    if (this.dataForm.valid && this.user) {
      try {
        const updatedUser = { ...this.user, ...this.dataForm.value };
        await this.userUpdateService.update(updatedUser.id, updatedUser);
        this.toastr.success('Dados atualizados com sucesso!');
        this.loadUserData();
      } catch (error) {
        this.toastr.error('Erro ao atualizar dados');
        console.error(error);
      }
    }
  }

  async updatePassword() {
    if (this.passwordForm.valid && this.user) {
      try {
        const { oldPassword, newPassword } = this.passwordForm.value;
        await this.userUpdateService.updatePassword(this.user.id!, oldPassword, newPassword);
        this.toastr.success('Senha alterada com sucesso!');
        this.resetPasswordForm();
      } catch (error) {
        this.toastr.error('Erro ao alterar senha. Verifique a senha atual.');
        console.error(error);
      }
    }
  }

  resetDataForm() {
    this.loadUserData();
  }

  resetPasswordForm() {
    this.passwordForm.reset();
  }

  getPasswordStrength(): string {
    const password = this.passwordForm.get('newPassword')?.value || '';

    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)) {
      return 'strong';
    }
    return 'medium';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    const texts = {
      weak: 'Fraca',
      medium: 'Média',
      strong: 'Forte'
    };
    return texts[strength as keyof typeof texts];
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.passwordForm.get('newPassword')?.value || '');
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.passwordForm.get('newPassword')?.value || '');
  }

}