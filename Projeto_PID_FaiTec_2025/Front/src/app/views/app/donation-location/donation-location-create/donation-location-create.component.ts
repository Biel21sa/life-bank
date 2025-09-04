import { Component, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-donation-location-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    NgxMaskDirective
  ],
  templateUrl: './donation-location-create.component.html',
  styleUrl: './donation-location-create.component.css'
})
export class DonationLocationCreateComponent implements OnInit {

  donationLocationForm: FormGroup;
  municipalities: Municipality[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private donationLocationService: DonationLocationCreateService,
    private municipalityService: MunicipalityReadService,
    private toastrService: ToastrService
  ) {
    this.donationLocationForm = this.fb.group({
      name: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      neighborhood: ['', Validators.required],
      postalCode: ['', Validators.required],
      municipalityId: ['', Validators.required]
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
    if (this.donationLocationForm.valid) {
      const donationLocation: DonationLocation = this.donationLocationForm.value;
      this.donationLocationService.create(donationLocation).subscribe({
        next: () => {
          this.toastrService.success('Local de doação criado com sucesso!');
          this.router.navigate(['/donation-location/list']);
        },
        error: (error) => {
          console.error('Erro ao criar local de doação:', error);
          this.toastrService.error('Erro ao criar local de doação');
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/donation-location/list']);
  }
}