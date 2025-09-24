import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { User } from '../../../../domain/model/user';
import { UserReadService } from '../../../../services/user/user-read.service';
import { UserUpdateService } from '../../../../services/user/user-update.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-donor-edit',
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
  templateUrl: './donor-edit.component.html',
  styleUrl: './donor-edit.component.css'
})
export class DonorEditComponent implements OnInit {
  donorForm!: FormGroup;
  donorId!: string;
  initialValues: any;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userReadService: UserReadService,
    private userUpdateService: UserUpdateService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.donorId = this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadDonor();
  }

  initializeForm() {
    this.donorForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      bloodType: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      postalCode: ['', Validators.required]
    });
  }

  async loadDonor() {
    try {
      const donor = await this.userReadService.findById(this.donorId);
      if (donor) {
        this.donorForm.patchValue({
          name: donor.name,
          cpf: donor.cpf,
          email: donor.email,
          phone: donor.phone,
          bloodType: donor.bloodType,
          street: donor.street,
          number: donor.number,
          neighborhood: donor.neighborhood,
          postalCode: donor.postalCode
        });
        this.initialValues = this.donorForm.getRawValue();
      }
    } catch (error) {
      this.toastr.error('Erro ao carregar dados do doador');
      console.error(error);
    }
  }

  async onSubmit() {
    if (this.donorForm.valid) {
      this.isSubmitting = true;
      try {
        const updatedDonor: User = {
          ...this.donorForm.value,
          id: this.donorId
        };

        await this.userUpdateService.update(updatedDonor.id!, updatedDonor);
        this.toastr.success('Doador atualizado com sucesso!');
        this.router.navigate(['/donor/list']);
      } catch (error) {
        this.toastr.error('Erro ao atualizar doador');
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  onCancel() {
    this.router.navigate(['/donor/list']);
  }

  hasChanges(): boolean {
    if (!this.initialValues) return false;
    return JSON.stringify(this.initialValues) !== JSON.stringify(this.donorForm.getRawValue());
  }

  getChangedFieldsCount(): number {
    if (!this.initialValues) return 0;
    const current = this.donorForm.getRawValue();
    return Object.keys(current).filter(key => current[key] !== this.initialValues[key]).length;
  }

  isFieldModified(field: string): boolean {
    if (!this.initialValues) return false;
    return this.donorForm.get(field)?.value !== this.initialValues[field];
  }

  hasPersonalInfoChanges(): boolean {
    return ['name', 'cpf', 'email', 'phone'].some(f => this.isFieldModified(f));
  }

  hasDonorInfoChanges(): boolean {
    return this.isFieldModified('bloodType');
  }

  hasAddressChanges(): boolean {
    return ['street', 'number', 'neighborhood', 'postalCode'].some(f => this.isFieldModified(f));
  }

  showValidationSummary(): boolean {
    return !this.donorForm.valid && this.donorForm.touched;
  }

  getFormStatusClass(): string {
    if (!this.hasChanges()) return 'unchanged';
    return this.donorForm.valid ? 'modified valid' : 'modified invalid';
  }

  getFormStatusIcon(): string {
    if (!this.hasChanges()) return 'check';
    return this.donorForm.valid ? 'edit' : 'error_outline';
  }

  getFormStatusText(): string {
    if (!this.hasChanges()) return 'Sem alterações';
    return this.donorForm.valid ? 'Alterações válidas' : 'Há erros';
  }

  getBloodTypeDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'A+': 'Pode doar para A+ e AB+; pode receber de A+, A-, O+ e O-',
      'A-': 'Pode doar para A+, A-, AB+ e AB-; pode receber de A- e O-',
      'B+': 'Pode doar para B+ e AB+; pode receber de B+, B-, O+ e O-',
      'B-': 'Pode doar para B+, B-, AB+ e AB-; pode receber de B- e O-',
      'AB+': 'Receptor universal; pode doar apenas para AB+',
      'AB-': 'Pode doar para AB+ e AB-; pode receber de todos Rh-',
      'O+': 'Pode doar para todos os tipos Rh+; pode receber de O+ e O-',
      'O-': 'Doador universal; pode receber apenas de O-'
    };
    return descriptions[type] || 'Tipo sanguíneo não reconhecido.';
  }
}