import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserReadService } from '../../../services/user/user-read.service';
import { User } from '../../../domain/model/user';
import { AuthenticationService } from '../../../services/security/authentication.service';

@Component({
  selector: 'app-clinic-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './clinic-home.component.html',
  styleUrls: ['./clinic-home.component.css']
})
export class ClinicHomeComponent implements OnInit {

  constructor(private router: Router, private userReadService: UserReadService, private authenticationService: AuthenticationService) { }

  user: User | null = null;

  ngOnInit() {
    const userId = this.authenticationService.getUserId?.();
    if (userId) {
      this.getUserInfo(userId);
    }
  }

  getUserInfo(userId: string) {
    this.userReadService.findById(userId)
      .then((user: any) => {
        this.user = user || null;
      })
      .catch(() => {
        this.user = null;
      });
  }

  navigateToBenefits() {
    this.router.navigate(['/benefit/verification']);
  }

  navigateToChat() {
    this.router.navigate(['/clinic-chat']);
  }
}