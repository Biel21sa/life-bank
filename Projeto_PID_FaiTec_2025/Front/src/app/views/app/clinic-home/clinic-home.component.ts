import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clinic-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './clinic-home.component.html',
  styleUrls: ['./clinic-home.component.css']
})
export class ClinicHomeComponent {

  constructor(private router: Router) { }

  navigateToBenefits() {
    this.router.navigate(['/benefit/verification']);
  }
}