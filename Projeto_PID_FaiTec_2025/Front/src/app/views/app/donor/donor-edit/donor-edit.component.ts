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
      }
    } catch (error) {
      this.toastr.error('Erro ao carregar dados do doador');
      console.error(error);
    }
  }

  async onSubmit() {
    if (this.donorForm.valid) {
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
      }
    }
  }

  onCancel() {
    this.router.navigate(['/donor/list']);
  }
}