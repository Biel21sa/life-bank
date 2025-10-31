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
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatCheckboxModule,
    NgxMaskDirective
  ],
  templateUrl: './donor-create.component.html',
  styleUrl: './donor-create.component.css'
})
export class DonorCreateComponent {
  donorForm: FormGroup;
  isSubmitting = false;

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
      password: ['', [Validators.required, Validators.minLength(6)]],
      bloodType: ['', Validators.required],
      gender: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      postalCode: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.donorForm.valid) {
      this.isSubmitting = true;

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
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/donor/list']);
  }

  getStepClass(step: string): string {
    const controlMap: Record<string, string[]> = {
      personal: ['name', 'cpf', 'phone', 'email', 'password'],
      donor: ['bloodType', 'gender'],
      address: ['street', 'number', 'neighborhood', 'postalCode'],
      terms: ['acceptTerms']
    };

    const controls = controlMap[step] || [];
    const allValid = controls.every(c => this.donorForm.get(c)?.valid);

    return allValid ? 'step completed' : 'step pending';
  }

  getStepIcon(step: string): string {
    return this.getStepClass(step).includes('completed') ? 'check_circle' : 'hourglass_empty';
  }

  getSectionClass(section: string): string {
    const controlsMap: Record<string, string[]> = {
      personal: ['name', 'cpf', 'phone', 'email', 'password'],
      donor: ['bloodType', 'gender'],
      address: ['street', 'number', 'neighborhood', 'postalCode'],
      terms: ['acceptTerms']
    };

    const controls = controlsMap[section] || [];
    const allValid = controls.every(c => this.donorForm.get(c)?.valid);

    return allValid ? 'section-card completed' : 'section-card incomplete';
  }

  getSectionStatusIcon(section: string): string {
    return this.getSectionClass(section).includes('completed') ? 'check_circle' : 'error';
  }

  showValidationSummary(): boolean {
    return this.donorForm.invalid && this.donorForm.touched;
  }

  getValidationMessage(): string {
    if (this.donorForm.get('acceptTerms')?.invalid) {
      return 'Você deve aceitar os termos antes de continuar.';
    }
    return 'Preencha todos os campos obrigatórios para continuar.';
  }
}