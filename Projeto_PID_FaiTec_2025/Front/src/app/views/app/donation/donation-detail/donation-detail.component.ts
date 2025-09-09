import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { DonationReadService } from '../../../../services/donation/donation-read.service';

@Component({
  selector: 'app-donation-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgxMaskPipe,
  ],
  templateUrl: './donation-detail.component.html',
  styleUrl: './donation-detail.component.css'
})
export class DonationDetailComponent implements OnInit {
  donation: any = null;
  donationId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donationReadService: DonationReadService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.donationId = this.route.snapshot.paramMap.get('id') || '';
    if (this.donationId) {
      this.loadDonation();
    }
  }

  loadDonation() {
    this.donationReadService.findById(this.donationId).subscribe({
      next: (donation) => {
        this.donation = donation;
      },
      error: (error) => {
        this.toastr.error('Erro ao carregar detalhes da doação');
        console.error(error);
        this.router.navigate(['/donation-history']);
      }
    });
  }

  getBloodTypeClass(bloodType: string): string {
    const classes: { [key: string]: string } = {
      'A': 'blood-a-positive',
      'A_POSITIVE': 'blood-a-positive',
      'A_NEGATIVE': 'blood-a-negative',
      'B_POSITIVE': 'blood-b-positive',
      'B_NEGATIVE': 'blood-b-negative',
      'AB_POSITIVE': 'blood-ab-positive',
      'AB_NEGATIVE': 'blood-ab-negative',
      'O_POSITIVE': 'blood-o-positive',
      'O_NEGATIVE': 'blood-o-negative'
    };
    return classes[bloodType] || '';
  }

  goBack() {
    this.router.navigate(['/donation-history']);
  }
}