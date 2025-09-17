import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../../../services/security/authentication.service';


@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
    CommonModule,
    MatToolbarModule,
    FormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    FontAwesomeModule,
    RouterModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  faFooterIcon = fontawesome.faHeartBroken;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  isSystemAdmin(): boolean {
    return this.authenticationService.isSystemAdmin();
  }

  isAdministrator(): boolean {
    return this.authenticationService.isAdministrator();
  }

  isUser(): boolean {
    return this.authenticationService.isUser();
  }

  isClinic(): boolean {
    return this.authenticationService.isClinic();
  }

  public logout() {
    console.log('logout clicado');
    this.authenticationService.logout();
    this.router.navigate(['account/sign-in']);
  }

  getDonationLocationId(): string {
    return this.authenticationService.getDonationLocationId()!;
  }

  onSidenavClosed() {
    // Fechar todos os expansion panels quando o sidenav fechar
    const expansionPanels = document.querySelectorAll('mat-expansion-panel');
    expansionPanels.forEach(panel => {
      const panelElement = panel as any;
      if (panelElement._body && panelElement.expanded) {
        panelElement.close();
      }
    });
  }

}
