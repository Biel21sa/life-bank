import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Donation } from '../../../../domain/model/donation';
import { User } from '../../../../domain/model/user';
import { Donor } from '../../../../domain/model/donor';
import { DonationCreateService } from '../../../../services/donation/donation-create.service';
import { UserReadService } from '../../../../services/user/user-read.service';
import { AuthenticationService } from '../../../../services/security/authentication.service';
import { DonorReadService } from '../../../../services/donor/donor-read-service';

@Component({
  selector: 'app-donation-create',
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
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskPipe
  ],
  templateUrl: './donation-create.component.html',
  styleUrls: ['./donation-create.component.css']
})
export class DonationCreateComponent implements OnInit {
  donationForm: FormGroup;
  donors: Donor[] = [];
  currentUser: User | null = null;
  isSubmitting = false;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private donationCreateService: DonationCreateService,
    private userReadService: UserReadService,
    private donorReadService: DonorReadService,
    private authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.donationForm = this.fb.group({
      donorId: ['', Validators.required],
      quantity: [450, [Validators.required, Validators.min(100), Validators.max(500)]],
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadDonors();
  }

  async loadCurrentUser() {
    try {
      const email = this.authService.getAuhenticatedUserEmail();
      const users = await this.userReadService.findAll();
      this.currentUser = users?.find((u: { email: string; }) => u.email === email) || null;

      if (!this.currentUser?.donationLocationId) {
        this.toastr.error('Local de doação não encontrado para o usuário');
        this.router.navigate(['/donation-history']);
      }
    } catch (error) {
      this.toastr.error('Erro ao carregar dados do usuário');
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  loadDonors() {
    this.donorReadService.findAll().subscribe({
      next: (donors) => {
        this.donors = donors?.filter(donor => donor.apto) || [];
      },
      error: (error) => {
        this.toastr.error('Erro ao carregar doadores');
        console.error(error);
      }
    });
  }

  getSelectedDonorName(): string {
    const selectedDonorId = this.donationForm.get('donorId')?.value;
    if (selectedDonorId) {
      const selectedDonor = this.donors.find(donor => donor.id === selectedDonorId);
      return selectedDonor?.user?.name || '';
    }
    return '';
  }

  getSelectedDonor(): Donor | undefined {
    const donorId = this.donationForm.get('donorId')?.value;
    return this.donors.find(d => d.id === donorId);
  }

  setQuantity(value: number) {
    this.donationForm.get('quantity')?.setValue(value);
  }

  getCurrentDate(): Date {
    return new Date();
  }

  getExpirationDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 42);
    return date;
  }

  onSubmit() {
    if (this.donationForm.valid && this.currentUser?.donationLocationId) {
      this.isSubmitting = true;

      const selectedDonor = this.getSelectedDonor();
      const collectionDate = new Date();
      const expirationDate = new Date(collectionDate);
      expirationDate.setDate(expirationDate.getDate() + 42);

      const donation: Donation = {
        donorId: selectedDonor?.id!,
        donationLocationId: this.currentUser.donationLocationId.toString(),
        collectionDate: collectionDate,
        expirationDate: expirationDate,
        bloodType: selectedDonor?.bloodType || '',
        quantity: this.donationForm.value.quantity / 1000
      };

      this.donationCreateService.create(donation).subscribe({
        next: () => {
          this.toastr.success('Doação registrada com sucesso!');
          this.router.navigate(['/donation-history']);
        },
        error: (error) => {
          this.toastr.error('Erro ao registrar doação');
          console.error(error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/donation-history']);
  }
}