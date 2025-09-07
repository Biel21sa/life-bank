import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorDropSlashBold, phosphorHouseSimpleBold } from '@ng-icons/phosphor-icons/bold'

@Component({
  selector: 'app-menu',
  imports: [
    FontAwesomeModule,
    NgIcon
  ],
  providers:[
    provideIcons({phosphorDropSlashBold})
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  readonly FontAwesome = fontawesome
}
