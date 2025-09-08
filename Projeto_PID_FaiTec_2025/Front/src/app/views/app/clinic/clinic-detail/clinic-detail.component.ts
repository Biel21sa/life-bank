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
  selector: 'app-clinic-detail',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    NgxMaskPipe,
  ],
  templateUrl: './clinic-detail.component.html',
  styleUrl: './clinic-detail.component.css'
})
export class ClinicDetailComponent implements OnInit {
  clinic?: User;

  constructor(
    private userReadService: UserReadService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    let clinicId = this.route.snapshot.paramMap.get('id');
    this.loadClinicById(clinicId!);
  }

  async loadClinicById(clinicId: string) {
    this.clinic = await this.userReadService.findById(clinicId);
  }
}