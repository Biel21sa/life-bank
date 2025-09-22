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
import { NgxMaskDirective } from 'ngx-mask';
import { User } from '../../../../domain/model/user';
import { UserRole } from '../../../../domain/model/user-role';
import { UserCreateService } from '../../../../services/user/user-create.service';
import { ToastrService } from 'ngx-toastr';
import { Municipality } from '../../../../domain/model/municipality';
import { MunicipalityReadService } from '../../../../services/municipality/municipality-read.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-clinic-create',
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
    MatIconModule,
    MatCheckboxModule,
    NgxMaskDirective
  ],
  templateUrl: './clinic-create.component.html',
  styleUrl: './clinic-create.component.css'
})
export class ClinicCreateComponent implements OnInit {
  clinicForm: FormGroup;

  municipalities: Municipality[] = [];

  constructor(
    private fb: FormBuilder,
    private userCreateService: UserCreateService,
    private router: Router,
    private municipalityService: MunicipalityReadService,
    private toastr: ToastrService
  ) {
    this.clinicForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      nameClinic: ['', Validators.required],
      cnpj: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      postalCode: ['', Validators.required],
      municipalityId: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.loadMunicipalities();
  }

  loadMunicipalities() {
    this.municipalityService.findAll().subscribe({
      next: (municipalities) => {
        this.municipalities = municipalities;
      },
      error: (error) => {
        console.error('Erro ao carregar municípios:', error);
      }
    });
  }

  onSubmit() {
    if (this.clinicForm.valid) {
      const clinic: User = {
        ...this.clinicForm.value,
        role: UserRole.CLINIC
      };

      this.userCreateService.create(clinic).subscribe({
        next: () => {
          this.toastr.success('Clínica cadastrada com sucesso!');
          this.router.navigate(['/clinic/list']);
        },
        error: (error) => {
          this.toastr.error('Erro ao cadastrar clínica');
          console.error('Erro ao criar clínica:', error);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/clinic/list']);
  }
}