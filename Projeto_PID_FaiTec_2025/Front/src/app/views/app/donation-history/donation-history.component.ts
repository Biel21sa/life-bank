import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';
import { MatTableDataSource } from '@angular/material/table';
import { DonationReadService } from '../../../services/donation/donation-read.service';
import { UserReadService } from '../../../services/user/user-read.service';
import { AuthenticationService } from '../../../services/security/authentication.service';

@Component({
  selector: 'app-donation-history',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    NgxMaskPipe,
  ],
  templateUrl: './donation-history.component.html',
  styleUrl: './donation-history.component.css'
})
export class DonationHistoryComponent implements OnInit {
  
  donations: any[] = [];
  dataSource = new MatTableDataSource(this.donations);
  displayedColumns: string[] = ['donor', 'bloodType', 'date', 'quantity', 'actions'];
  currentUser: any = null;

  constructor(
    private donationReadService: DonationReadService,
    private userReadService: UserReadService,
    private authService: AuthenticationService,
    private toastr: ToastrService,
  ){}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  async loadCurrentUser() {
    try {
      const email = this.authService.getAuhenticatedUserEmail();
      const users = await this.userReadService.findAll();
      this.currentUser = users?.find((u: { email: string; }) => u.email === email) || null;
      
      if (this.currentUser?.donationLocationId) {
        this.loadDonations();
      } else {
        this.toastr.error('Local de doação não encontrado');
      }
    } catch (error) {
      this.toastr.error('Erro ao carregar dados do usuário');
      console.error(error);
    }
  }

  loadDonations() {
    if (!this.currentUser?.donationLocationId) return;
    
    this.donationReadService.findByDonationLocationId(this.currentUser.donationLocationId.toString()).subscribe({
      next: (donations) => {
        this.donations = donations || [];
        this.dataSource.data = this.donations;
      },
      error: (error) => {
        this.toastr.error('Erro ao carregar doações');
        console.error(error);
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}