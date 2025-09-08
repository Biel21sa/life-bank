import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  selector: 'app-clinic-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NgxMaskDirective
  ],
  templateUrl: './clinic-edit.component.html',
  styleUrl: './clinic-edit.component.css'
})
export class ClinicEditComponent implements OnInit {
  clinicForm!: FormGroup;
  clinicId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userReadService: UserReadService,
    private userUpdateService: UserUpdateService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.clinicId = this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadClinic();
  }

  initializeForm() {
    this.clinicForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      nameClinic: ['', Validators.required],
      cnpj: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      postalCode: ['', Validators.required]
    });
  }

  async loadClinic() {
    try {
      const clinic = await this.userReadService.findById(this.clinicId);
      if (clinic) {
        this.clinicForm.patchValue({
          name: clinic.name,
          cpf: clinic.cpf,
          email: clinic.email,
          phone: clinic.phone,
          nameClinic: clinic.nameClinic,
          cnpj: clinic.cnpj,
          street: clinic.street,
          number: clinic.number,
          neighborhood: clinic.neighborhood,
          postalCode: clinic.postalCode
        });
      }
    } catch (error) {
      this.toastr.error('Erro ao carregar dados da clínica');
      console.error(error);
    }
  }

  async onSubmit() {
    if (this.clinicForm.valid) {
      try {
        const updatedClinic: User = {
          ...this.clinicForm.value,
          id: this.clinicId
        };

        await this.userUpdateService.update(updatedClinic.id!, updatedClinic);
        this.toastr.success('Clínica atualizada com sucesso!');
        this.router.navigate(['/clinic/list']);
      } catch (error) {
        this.toastr.error('Erro ao atualizar clínica');
        console.error(error);
      }
    }
  }

  onCancel() {
    this.router.navigate(['/clinic/list']);
  }
}