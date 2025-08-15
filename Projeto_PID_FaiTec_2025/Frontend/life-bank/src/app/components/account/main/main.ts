import { Component, computed, signal, viewChild } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';

import { phosphorHouseSimpleBold } from '@ng-icons/phosphor-icons/bold'

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
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
    NgIcon,
    MatListModule,
  ],
  providers: [
    provideIcons({phosphorHouseSimpleBold})
  ],
  templateUrl: './main.html',
  styleUrl: './main.css'
})

export class Main {
  FontAwesome = fontawesome

  activate(button: string){
    console.log(button + " activated.");
  }


  sidenavWidth = '250px'
  collapse(){
    if (this.sidenavWidth == '250px'){
      this.sidenavWidth = '70px'
    }else{
      this.sidenavWidth = '250px'
    }
  }
}
