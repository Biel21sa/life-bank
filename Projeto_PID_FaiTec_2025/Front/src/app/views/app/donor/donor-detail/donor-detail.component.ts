import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { User } from '../../../../domain/model/user';
import { UserReadService } from '../../../../services/user/user-read.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-donor-detail',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    NgxMaskPipe,
  ],
  templateUrl: './donor-detail.component.html',
  styleUrl: './donor-detail.component.css'
})
export class DonorDetailComponent implements OnInit {
  donor?: User;

  constructor(
    private userReadService: UserReadService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    let donorId = this.route.snapshot.paramMap.get('id');
    this.loadDonorById(donorId!);
  }

  async loadDonorById(donorId: string) {
    this.donor = await this.userReadService.findById(donorId);
  }

  getBloodTypeClass(bloodType: string): string {
    const classes: { [key: string]: string } = {
      'A+': 'blood-a-positive',
      'A-': 'blood-a-negative',
      'B+': 'blood-b-positive', 
      'B-': 'blood-b-negative',
      'AB+': 'blood-ab-positive',
      'AB-': 'blood-ab-negative',
      'O+': 'blood-o-positive',
      'O-': 'blood-o-negative'
    };
    return classes[bloodType] || '';
  }
}