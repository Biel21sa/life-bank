import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationLocationUpdateService } from '../../../../services/donation-location/donation-location-update.service';
import { DonationLocation } from '../../../../domain/model/donation-location';
import { Municipality } from '../../../../domain/model/municipality';
import { MunicipalityReadService } from '../../../../services/municipality/municipality-read.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

interface FieldChange {
  field: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-donation-location-edit',
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
  templateUrl: './donation-location-edit.component.html',
  styleUrl: './donation-location-edit.component.css'
})
export class DonationLocationEditComponent implements OnInit, OnDestroy {

  donationLocationForm: FormGroup;
  donationLocationId: string = '';
  municipalities: Municipality[] = [];
  originalData: DonationLocation | null = null;
  isLoading = true;
  isSubmitting = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private donationLocationService: DonationLocationUpdateService,
    private municipalityService: MunicipalityReadService,
    private toastrService: ToastrService
  ) {
    this.donationLocationForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadMunicipalities();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.donationLocationId = id;
      this.loadDonationLocation(id);
    } else {
      this.handleError('ID do local não encontrado');
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      street: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      number: ['', [Validators.required, Validators.min(1), Validators.max(99999)]],
      neighborhood: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      municipalityId: ['', Validators.required]
    });
  }

  loadMunicipalities(): void {
    this.municipalityService.findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (municipalities) => {
          this.municipalities = municipalities.sort((a, b) =>
            a.name.localeCompare(b.name, 'pt-BR')
          );
        },
        error: (error) => {
          console.error('Erro ao carregar municípios:', error);
          this.toastrService.error('Erro ao carregar lista de municípios');
        }
      });
  }

  loadDonationLocation(id: string): void {
    this.isLoading = true;

    this.donationLocationService.findById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (location) => {
          // CLONAR O OBJETO E LIMPAR O CEP ANTES DE SALVAR COMO ORIGINAL
          this.originalData = {
            ...location,
            postalCode: this.cleanCep(location.postalCode)
          };
          this.donationLocationForm.patchValue(location);
          this.isLoading = false;
          this.toastrService.success('Dados carregados com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao carregar local de doação:', error);
          this.handleError('Erro ao carregar dados do local');
          this.isLoading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.donationLocationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const donationLocation: DonationLocation = {
        ...this.donationLocationForm.value,
        id: this.donationLocationId
      };

      this.donationLocationService.update(this.donationLocationId, donationLocation)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastrService.success('Local de doação atualizado com sucesso!');
            this.router.navigate(['/donation-location/list']);
          },
          error: (error) => {
            console.error('Erro ao atualizar local de doação:', error);
            this.handleSubmissionError(error);
            this.isSubmitting = false;
          }
        });
    } else {
      this.markFormGroupTouched();
      this.toastrService.warning('Por favor, corrija os erros no formulário');
    }
  }

  private handleSubmissionError(error: any): void {
    if (error.status === 400) {
      this.toastrService.error('Dados inválidos. Verifique as informações preenchidas.');
    } else if (error.status === 404) {
      this.toastrService.error('Local de doação não encontrado.');
    } else if (error.status === 409) {
      this.toastrService.error('Já existe um local com essas informações.');
    } else {
      this.toastrService.error('Erro interno do servidor. Tente novamente.');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.donationLocationForm.controls).forEach(key => {
      const control = this.donationLocationForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    if (this.hasChanges()) {
      const confirmLeave = confirm(
        'Você tem alterações não salvas. Deseja realmente sair sem salvar?'
      );

      if (confirmLeave) {
        this.navigateToList();
      }
    } else {
      this.navigateToList();
    }
  }

  private navigateToList(): void {
    this.router.navigate(['/donation-location/list']);
  }

  hasChanges(): boolean {
    if (!this.originalData) return false;

    const currentData = this.donationLocationForm.value;

    return (
      currentData.name !== this.originalData.name ||
      currentData.street !== this.originalData.street ||
      currentData.number !== this.originalData.number ||
      currentData.neighborhood !== this.originalData.neighborhood ||
      currentData.postalCode !== this.originalData.postalCode ||
      currentData.municipalityId !== this.originalData.municipalityId
    );
  }

  getChanges(): FieldChange[] {
    if (!this.originalData) return [];

    const changes: FieldChange[] = [];
    const currentData = this.donationLocationForm.value;

    if (currentData.name !== this.originalData.name) {
      changes.push({
        field: 'Nome',
        description: `"${this.originalData.name}" → "${currentData.name}"`,
        icon: 'business'
      });
    }

    if (currentData.street !== this.originalData.street) {
      changes.push({
        field: 'Rua',
        description: `"${this.originalData.street}" → "${currentData.street}"`,
        icon: 'home'
      });
    }

    if (currentData.number !== this.originalData.number) {
      changes.push({
        field: 'Número',
        description: `"${this.originalData.number}" → "${currentData.number}"`,
        icon: 'tag'
      });
    }

    if (currentData.neighborhood !== this.originalData.neighborhood) {
      changes.push({
        field: 'Bairro',
        description: `"${this.originalData.neighborhood}" → "${currentData.neighborhood}"`,
        icon: 'location_city'
      });
    }

    if (currentData.postalCode !== this.originalData.postalCode) {
      changes.push({
        field: 'CEP',
        description: `"${this.originalData.postalCode}" → "${currentData.postalCode}"`,
        icon: 'place'
      });
    }

    if (currentData.municipalityId !== this.originalData.municipalityId) {
      const originalMunicipality = this.municipalities.find(m => m.id === this.originalData?.municipalityId);
      const newMunicipality = this.municipalities.find(m => m.id === currentData.municipalityId);

      changes.push({
        field: 'Município',
        description: `"${originalMunicipality?.name || 'N/A'}" → "${newMunicipality?.name || 'N/A'}"`,
        icon: 'location_on'
      });
    }

    return changes;
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
      const min = field.errors?.['min'].min;
      return `${this.getFieldLabel(fieldName)} deve ser maior que ${min}`;
    }

    if (field?.hasError('max')) {
      const max = field.errors?.['max'].max;
      return `${this.getFieldLabel(fieldName)} deve ser menor que ${max}`;
    }

    if (field?.hasError('pattern')) {
      return `${this.getFieldLabel(fieldName)} está em formato inválido`;
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nome',
      street: 'Rua',
      number: 'Número',
      neighborhood: 'Bairro',
      postalCode: 'CEP',
      municipalityId: 'Município'
    };

    return labels[fieldName] || fieldName;
  }

  private handleError(message: string): void {
    this.toastrService.error(message);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.donationLocationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.donationLocationForm.get(fieldName);
    return !!(field && field.valid && (field.dirty || field.touched));
  }

  getFormCompletionPercentage(): number {
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

  cleanCep(cep: string): string {
    return cep ? cep.replace(/\D/g, '') : '';
  }

  getMunicipalityDisplayName(municipalityId: string): string {
    const municipality = this.municipalities.find(m => m.id === municipalityId);
    return municipality ? `${municipality.name} - ${municipality.state}` : '';
  }

  get isFormValid(): boolean {
    return this.donationLocationForm.valid;
  }

  get isFormDirty(): boolean {
    return this.donationLocationForm.dirty;
  }

  get canSubmit(): boolean {
    return this.isFormValid && this.hasChanges() && !this.isSubmitting;
  }

  get submitButtonText(): string {
    if (this.isSubmitting) return 'Salvando...';
    if (!this.hasChanges()) return 'Nenhuma alteração';
    return 'Atualizar Local';
  }

  get formStatusText(): string {
    if (this.isFormValid) {
      return this.hasChanges() ? 'Formulário válido - Pronto para salvar' : 'Formulário válido - Sem alterações';
    }
    return 'Preencha todos os campos obrigatórios';
  }

  getAriaLabel(section: string): string {
    switch (section) {
      case 'form':
        return 'Formulário de edição de local de doação';
      case 'basic-info':
        return 'Seção de informações básicas';
      case 'address':
        return 'Seção de endereço';
      case 'actions':
        return 'Ações do formulário';
      default:
        return section;
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  trackByMunicipality(index: number, municipality: Municipality): string {
    return municipality.id!;
  }

  trackByChange(index: number, change: FieldChange): string {
    return change.field;
  }
}
