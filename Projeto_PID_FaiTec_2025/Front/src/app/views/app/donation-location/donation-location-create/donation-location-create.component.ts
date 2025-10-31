import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DonationLocationCreateService } from '../../../../services/donation-location/donation-location-create.service';
import { MunicipalityReadService } from '../../../../services/municipality/municipality-read.service';
import { DonationLocation } from '../../../../domain/model/donation-location';
import { Municipality } from '../../../../domain/model/municipality';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-donation-location-create',
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
  templateUrl: './donation-location-create.component.html',
  styleUrl: './donation-location-create.component.css'
})
export class DonationLocationCreateComponent implements OnInit, OnDestroy {

  donationLocationForm: FormGroup;
  municipalities: Municipality[] = [];
  isSubmitting = false;
  isLoadingMunicipalities = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private donationLocationService: DonationLocationCreateService,
    private municipalityService: MunicipalityReadService,
    private toastrService: ToastrService
  ) {
    this.donationLocationForm = this.createForm();
    this.setupFormValidation();
  }

  ngOnInit(): void {
    this.loadMunicipalities();
    this.setupFormWatchers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      street: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      number: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(99999)
      ]],
      neighborhood: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      postalCode: ['', [
        Validators.required,
        Validators.pattern(/^\d{5}-?\d{3}$/)
      ]],
      municipalityId: ['', Validators.required]
    });
  }

  private setupFormValidation(): void {
    this.donationLocationForm.get('name')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        if (value && value.trim().length > 0) {
          value.trim();
        }
      });
  }

  private setupFormWatchers(): void {
    this.donationLocationForm.get('postalCode')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(cep => {
        if (cep && cep.length === 9) {
          this.searchAddressByCep(cep);
        }
      });
  }

  private loadMunicipalities(): void {
    this.isLoadingMunicipalities = true;
    this.municipalityService.findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (municipalities) => {
          this.municipalities = municipalities.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          this.isLoadingMunicipalities = false;
        },
        error: (error) => {
          console.error('Erro ao carregar municípios:', error);
          this.toastrService.error('Erro ao carregar lista de municípios');
          this.isLoadingMunicipalities = false;
        }
      });
  }

  private searchAddressByCep(cep: string): void {
    const cleanCep = cep.replace('-', '');

    if (cleanCep.length === 8) {
      this.toastrService.info('Funcionalidade de busca por CEP em desenvolvimento');
    }
  }

  onSubmit(): void {
    if (this.donationLocationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formData = this.donationLocationForm.value;
      const donationLocation: DonationLocation = {
        ...formData,
        postalCode: formData.postalCode.replace('-', '')
      };

      this.donationLocationService.create(donationLocation)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.toastrService.success('Local de doação criado com sucesso!');
            this.router.navigate(['/donation-location/list']);
          },
          error: (error) => {
            console.error('Erro ao criar local de doação:', error);
            this.handleSubmissionError(error);
            this.isSubmitting = false;
          }
        });
    } else {
      this.markFormGroupTouched();
      this.toastrService.warning('Por favor, preencha todos os campos obrigatórios');
    }
  }

  private handleSubmissionError(error: any): void {
    if (error.status === 400) {
      this.toastrService.error('Dados inválidos. Verifique as informações preenchidas.');
    } else if (error.status === 409) {
      this.toastrService.error('Já existe um local de doação com este nome.');
    } else if (error.status === 500) {
      this.toastrService.error('Erro interno do servidor. Tente novamente mais tarde.');
    } else {
      this.toastrService.error('Erro ao criar local de doação. Tente novamente.');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.donationLocationForm.controls).forEach(key => {
      const control = this.donationLocationForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    if (this.donationLocationForm.dirty) {
      const confirmMessage = 'Você tem alterações não salvas. Deseja realmente sair?';
      if (confirm(confirmMessage)) {
        this.router.navigate(['/donation-location/list']);
      }
    } else {
      this.router.navigate(['/donation-location/list']);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.donationLocationForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} é obrigatório`;
    }

    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${minLength} caracteres`;
    }

    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} deve ter no máximo ${maxLength} caracteres`;
    }

    if (field?.hasError('min')) {
      return `Número deve ser maior que zero`;
    }

    if (field?.hasError('max')) {
      return `Número deve ser menor que 100.000`;
    }

    if (field?.hasError('pattern')) {
      if (fieldName === 'postalCode') {
        return 'CEP deve estar no formato 00000-000';
      }
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nome do local',
      street: 'Rua',
      number: 'Número',
      neighborhood: 'Bairro',
      postalCode: 'CEP',
      municipalityId: 'Município'
    };

    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.donationLocationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.donationLocationForm.get(fieldName);
    return !!(field && field.valid && (field.dirty || field.touched));
  }

  get isFormValid(): boolean {
    return this.donationLocationForm.valid;
  }

  get isFormDirty(): boolean {
    return this.donationLocationForm.dirty;
  }

  get formProgress(): number {
    const totalFields = Object.keys(this.donationLocationForm.controls).length;
    const validFields = Object.keys(this.donationLocationForm.controls)
      .filter(key => this.donationLocationForm.get(key)?.valid).length;

    return Math.round((validFields / totalFields) * 100);
  }

  formatCep(cep: string): string {
    if (!cep) return '';
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  getAriaLabel(fieldName: string): string {
    const field = this.donationLocationForm.get(fieldName);
    const label = this.getFieldLabel(fieldName);

    if (field?.invalid && (field.dirty || field.touched)) {
      return `${label} - Campo inválido`;
    }

    if (field?.valid && (field.dirty || field.touched)) {
      return `${label} - Campo válido`;
    }

    return label;
  }
}