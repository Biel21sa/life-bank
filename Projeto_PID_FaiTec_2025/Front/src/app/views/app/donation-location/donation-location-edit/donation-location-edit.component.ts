import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-donation-location-edit',
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
export class DonationLocationEditComponent implements OnInit {

  donationLocationForm: FormGroup;
  donationLocationId: string = '';
  municipalities: Municipality[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private donationLocationService: DonationLocationUpdateService,
    private municipalityService: MunicipalityReadService,
    private toastrService: ToastrService
  ) {
    this.donationLocationForm = this.fb.group({
      id: [''],
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.donationLocationId = id;
      this.loadDonationLocation(id);
    }
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

  loadDonationLocation(id: string) {
    this.donationLocationService.findById(id).subscribe({
      next: (location) => {
        this.donationLocationForm.patchValue(location);
      },
      error: (error) => {
        console.error('Erro ao carregar local de doação:', error);
      }
    });
  }

  onSubmit() {
    if (this.donationLocationForm.valid) {
      const donationLocation: DonationLocation = this.donationLocationForm.value;
      this.donationLocationService.update(this.donationLocationId, donationLocation).subscribe({
        next: () => {
          this.toastrService.success('Local de doação atualizado com sucesso!');
          this.router.navigate(['/donation-location/list']);
        },
        error: (error) => {
          console.error('Erro ao atualizar local de doação:', error);
          this.toastrService.error('Erro ao atualizar local de doação');
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/donation-location/list']);
  }
}